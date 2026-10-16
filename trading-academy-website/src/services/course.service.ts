import { connectToDatabase } from "@/lib/db";
import { Course, ICourseDocument } from "@/models/Course";
import { Module, IModuleDocument } from "@/models/Module";
import { Lecture, ILectureDocument } from "@/models/Lecture";
import { Category } from "@/models/Category";
import { Author } from "@/models/Author";
import { encryptVideoId, hashVideoId } from "@/lib/crypto";
import { parseYouTubeId, fetchYouTubeMeta } from "@/lib/youtube";
import { slugify } from "@/lib/validators/course";
import { recordAuditLog } from "./audit.service";
import { ApiError } from "@/lib/errors";
import { COURSE_STATUS, MODULE_STATUS, LECTURE_STATUS, PAGINATION } from "@/lib/constants";

// =============================================================================
// CATEGORIES & AUTHORS
// =============================================================================

export async function listCategories() {
  await connectToDatabase();
  return await Category.find().sort({ order: 1, name: 1 }).lean();
}

export async function createCategory(data: { name: string; slug?: string; description?: string; color?: string; order?: number }, actorId: string) {
  await connectToDatabase();
  const slug = slugify(data.slug || data.name);
  const existing = await Category.findOne({ slug });
  if (existing) throw ApiError.conflict("Category slug already in use");

  const category = await Category.create({ ...data, slug });
  await recordAuditLog({
    actorId,
    action: "category.create",
    entityType: "category",
    entityId: category._id.toString(),
    summary: `Created course category '${category.name}'`,
  });
  return category;
}

export async function updateCategory(id: string, data: Partial<{ name: string; slug?: string; description?: string; color?: string; order?: number }>, actorId: string) {
  await connectToDatabase();
  if (data.slug) data.slug = slugify(data.slug);
  const category = await Category.findByIdAndUpdate(id, { $set: data }, { new: true });
  if (!category) throw ApiError.notFound("Category not found");
  await recordAuditLog({
    actorId,
    action: "category.update",
    entityType: "category",
    entityId: id,
    summary: `Updated course category '${category.name}'`,
  });
  return category;
}

export async function deleteCategory(id: string, actorId: string) {
  await connectToDatabase();
  const category = await Category.findById(id);
  if (!category) throw ApiError.notFound("Category not found");
  if (category.courseCount > 0) {
    throw ApiError.conflict(`Cannot delete category while assigned to ${category.courseCount} course(s).`);
  }
  await Category.findByIdAndDelete(id);
  await recordAuditLog({
    actorId,
    action: "category.delete",
    entityType: "category",
    entityId: id,
    summary: `Deleted category '${category.name}'`,
  });
  return { ok: true };
}

export async function listAuthors() {
  await connectToDatabase();
  return await Author.find({ isActive: true }).sort({ name: 1 }).lean();
}

export async function createAuthor(data: any, actorId: string) {
  await connectToDatabase();
  const slug = slugify(data.slug || data.name);
  const existing = await Author.findOne({ slug });
  if (existing) throw ApiError.conflict("Author slug already in use");
  const author = await Author.create({ ...data, slug });
  await recordAuditLog({
    actorId,
    action: "author.create",
    entityType: "author",
    entityId: author._id.toString(),
    summary: `Created instructor profile '${author.name}'`,
  });
  return author;
}

// =============================================================================
// VIDEO VALIDATION
// =============================================================================

export async function validateVideo(videoUrlOrId: string) {
  await connectToDatabase();
  const videoId = parseYouTubeId(videoUrlOrId);
  if (!videoId) {
    throw ApiError.badRequest("Invalid YouTube video URL or ID format.");
  }

  const hmac = hashVideoId(videoId);
  const existingLecture = await Lecture.findOne({ "video.hmac": hmac, deletedAt: null })
    .populate("courseId", "title")
    .select("title courseId")
    .lean();

  const meta = await fetchYouTubeMeta(videoId);

  return {
    valid: true,
    videoId,
    meta,
    isDuplicate: !!existingLecture,
    duplicateIn: existingLecture
      ? {
          lectureTitle: existingLecture.title,
          courseTitle: (existingLecture.courseId as any)?.title || "Another Course",
        }
      : null,
  };
}

// =============================================================================
// COURSES
// =============================================================================

export interface ListCoursesOptions {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  q?: string;
  status?: string;
  categoryId?: string;
  difficulty?: string;
}

export async function listCourses(options: ListCoursesOptions = {}) {
  await connectToDatabase();
  const page = Math.max(1, options.page || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, options.limit || PAGINATION.DEFAULT_LIMIT));
  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = { deletedAt: null };
  if (options.status && options.status !== "all") query.status = options.status;
  if (options.categoryId) query.categoryIds = options.categoryId;
  if (options.difficulty && options.difficulty !== "all") query.difficulty = options.difficulty;
  if (options.q) {
    query.$or = [
      { title: { $regex: options.q.trim(), $options: "i" } },
      { tags: { $in: [new RegExp(options.q.trim(), "i")] } },
    ];
  }

  const sortField = options.sort || "order";
  const sortOrder = options.order === "asc" ? 1 : -1;

  const [items, total] = await Promise.all([
    Course.find(query)
      .populate("categoryIds", "name color")
      .populate("authorId", "name title avatar")
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),
    Course.countDocuments(query),
  ]);

  return { items, page, limit, total, totalPages: Math.ceil(total / limit) || 1 };
}

export async function createCourse(data: any, actorId: string, ip = "127.0.0.1") {
  await connectToDatabase();
  let baseSlug = slugify(data.slug || data.title);
  let slug = baseSlug;
  let counter = 1;
  while (await Course.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const course = await Course.create({
    ...data,
    slug,
    createdBy: actorId,
    status: COURSE_STATUS.DRAFT,
  });

  if (data.categoryIds?.length) {
    await Category.updateMany({ _id: { $in: data.categoryIds } }, { $inc: { courseCount: 1 } });
  }

  await recordAuditLog({
    actorId,
    action: "course.create",
    entityType: "course",
    entityId: course._id.toString(),
    summary: `Created course '${course.title}'`,
    after: { title: course.title, slug: course.slug },
    ip,
  });

  return course;
}

export async function getCourseWithTree(courseId: string) {
  await connectToDatabase();
  const course = await Course.findOne({ _id: courseId, deletedAt: null })
    .populate("categoryIds", "name color")
    .populate("authorId", "name title bio avatar social")
    .lean();

  if (!course) throw ApiError.notFound("Course not found");

  const [modules, lectures] = await Promise.all([
    Module.find({ courseId, deletedAt: null }).sort({ order: 1 }).lean(),
    Lecture.find({ courseId, deletedAt: null }).sort({ order: 1 }).lean(),
  ]);

  // Nest lectures within their parent modules
  const modulesWithLectures = modules.map((mod) => ({
    ...mod,
    lectures: lectures.filter((lec) => lec.moduleId.toString() === mod._id.toString()),
  }));

  return { ...course, modules: modulesWithLectures };
}

export async function updateCourse(id: string, data: any, actorId: string, ip = "127.0.0.1") {
  await connectToDatabase();
  const course = await Course.findOne({ _id: id, deletedAt: null });
  if (!course) throw ApiError.notFound("Course not found");

  const before = course.toObject();
  if (data.slug && data.slug !== course.slug) {
    const newSlug = slugify(data.slug);
    const existing = await Course.findOne({ slug: newSlug, _id: { $ne: id } });
    if (existing) throw ApiError.conflict("Slug already in use by another course");
    course.slug = newSlug;
  }

  // Update allowed fields
  if (data.title !== undefined) course.title = data.title;
  if (data.subtitle !== undefined) course.subtitle = data.subtitle;
  if (data.description !== undefined) course.description = data.description;
  if (data.thumbnail !== undefined) course.thumbnail = data.thumbnail;
  if (data.introVideoUrl !== undefined) course.introVideoUrl = data.introVideoUrl;
  if (data.categoryIds !== undefined) course.categoryIds = data.categoryIds;
  if (data.authorId !== undefined) course.authorId = data.authorId;
  if (data.tags !== undefined) course.tags = data.tags;
  if (data.difficulty !== undefined) course.difficulty = data.difficulty;
  if (data.language !== undefined) course.language = data.language;
  if (data.learningOutcomes !== undefined) course.learningOutcomes = data.learningOutcomes;
  if (data.requirements !== undefined) course.requirements = data.requirements;
  if (data.audience !== undefined) course.audience = data.audience;
  if (data.showOnPublicSite !== undefined) course.showOnPublicSite = data.showOnPublicSite;
  if (data.settings !== undefined) {
    course.settings = { ...course.settings, ...data.settings };
  }

  await course.save();

  await recordAuditLog({
    actorId,
    action: "course.update",
    entityType: "course",
    entityId: id,
    summary: `Updated details for course '${course.title}'`,
    before: { title: before.title, settings: before.settings },
    after: { title: course.title, settings: course.settings },
    ip,
  });

  return course;
}

export async function softDeleteCourse(id: string, actorId: string, ip = "127.0.0.1") {
  await connectToDatabase();
  const course = await Course.findOne({ _id: id, deletedAt: null });
  if (!course) throw ApiError.notFound("Course not found");

  course.deletedAt = new Date();
  course.status = COURSE_STATUS.ARCHIVED;
  await course.save();

  // Soft delete all child modules and lectures
  await Promise.all([
    Module.updateMany({ courseId: id }, { $set: { deletedAt: new Date() } }),
    Lecture.updateMany({ courseId: id }, { $set: { deletedAt: new Date() } }),
  ]);

  await recordAuditLog({
    actorId,
    action: "course.delete",
    entityType: "course",
    entityId: id,
    summary: `Archived course '${course.title}' and its curriculum hierarchy`,
    ip,
  });

  return { ok: true, message: "Course archived" };
}

export async function publishCourse(id: string, actorId: string, ip = "127.0.0.1") {
  await connectToDatabase();
  const course = await Course.findOne({ _id: id, deletedAt: null });
  if (!course) throw ApiError.notFound("Course not found");

  // Readiness Checks per spec Section 6.5
  const publishedModules = await Module.find({ courseId: id, status: MODULE_STATUS.PUBLISHED, deletedAt: null });
  if (publishedModules.length === 0) {
    throw ApiError.badRequest("Readiness Check Failed: Course must have at least one published module before publishing.");
  }

  const publishedLectures = await Lecture.find({
    courseId: id,
    status: LECTURE_STATUS.PUBLISHED,
    deletedAt: null,
  }).select("+video.ref");

  if (publishedLectures.length === 0) {
    throw ApiError.badRequest("Readiness Check Failed: Course must have at least one published lecture.");
  }

  // Ensure each published module has at least one lecture
  const publishedModuleIds = new Set(publishedLectures.map((l) => l.moduleId.toString()));
  for (const mod of publishedModules) {
    if (!publishedModuleIds.has(mod._id.toString())) {
      throw ApiError.badRequest(`Readiness Check Failed: Module '${mod.title}' has no published lectures.`);
    }
  }

  course.status = COURSE_STATUS.PUBLISHED;
  course.publishedAt = new Date();
  await course.save();

  await recordAuditLog({
    actorId,
    action: "course.publish",
    entityType: "course",
    entityId: id,
    summary: `Published course '${course.title}' with ${publishedLectures.length} active lectures`,
    ip,
  });

  return { ok: true, status: course.status, publishedAt: course.publishedAt };
}

// =============================================================================
// MODULES & LECTURES
// =============================================================================

export async function createModule(courseId: string, data: any, actorId: string, ip = "127.0.0.1") {
  await connectToDatabase();
  const course = await Course.findOne({ _id: courseId, deletedAt: null });
  if (!course) throw ApiError.notFound("Course not found");

  const highest = await Module.findOne({ courseId, deletedAt: null }).sort({ order: -1 }).select("order");
  const nextOrder = highest ? highest.order + 1 : 0;

  const moduleDoc = await Module.create({
    ...data,
    courseId,
    order: data.order !== undefined ? data.order : nextOrder,
  });

  course.stats.moduleCount = (course.stats.moduleCount || 0) + 1;
  await course.save();

  await recordAuditLog({
    actorId,
    action: "module.create",
    entityType: "module",
    entityId: moduleDoc._id.toString(),
    summary: `Created module '${moduleDoc.title}' in course '${course.title}'`,
    ip,
  });

  return moduleDoc;
}

export async function updateModule(id: string, data: any, actorId: string, ip = "127.0.0.1") {
  await connectToDatabase();
  const mod = await Module.findOneAndUpdate({ _id: id, deletedAt: null }, { $set: data }, { new: true });
  if (!mod) throw ApiError.notFound("Module not found");
  await recordAuditLog({
    actorId,
    action: "module.update",
    entityType: "module",
    entityId: id,
    summary: `Updated module '${mod.title}'`,
    ip,
  });
  return mod;
}

export async function deleteModule(id: string, actorId: string, ip = "127.0.0.1") {
  await connectToDatabase();
  const mod = await Module.findOne({ _id: id, deletedAt: null });
  if (!mod) throw ApiError.notFound("Module not found");

  mod.deletedAt = new Date();
  await mod.save();

  await Lecture.updateMany({ moduleId: id }, { $set: { deletedAt: new Date() } });
  await Course.findByIdAndUpdate(mod.courseId, { $inc: { "stats.moduleCount": -1 } });

  await recordAuditLog({
    actorId,
    action: "module.delete",
    entityType: "module",
    entityId: id,
    summary: `Deleted module '${mod.title}'`,
    ip,
  });

  return { ok: true };
}

export async function reorderModules(courseId: string, items: Array<{ id: string; order: number }>, actorId: string, ip = "127.0.0.1") {
  await connectToDatabase();
  const operations = items.map((item) => ({
    updateOne: {
      filter: { _id: item.id, courseId },
      update: { $set: { order: item.order } },
    },
  }));

  await Module.bulkWrite(operations);
  await recordAuditLog({
    actorId,
    action: "module.reorder",
    entityType: "course",
    entityId: courseId,
    summary: `Reordered ${items.length} modules in course`,
    ip,
  });
  return { ok: true };
}

export async function createLecture(courseId: string, moduleId: string, data: any, actorId: string, ip = "127.0.0.1") {
  await connectToDatabase();
  const videoId = parseYouTubeId(data.videoUrlOrId);
  if (!videoId) throw ApiError.badRequest("Valid YouTube video link or ID is required.");

  // Encrypt video ID and calculate HMAC for duplicate detection
  const ref = encryptVideoId(videoId);
  const hmac = hashVideoId(videoId);

  // Fetch metadata / duration
  const meta = await fetchYouTubeMeta(videoId);
  const durationSec = data.durationSec || meta.durationSec || 0;

  const highest = await Lecture.findOne({ moduleId, deletedAt: null }).sort({ order: -1 }).select("order");
  const nextOrder = highest ? highest.order + 1 : 0;

  const lecture = await Lecture.create({
    courseId,
    moduleId,
    title: data.title.trim(),
    description: data.description || "",
    notesHtml: data.notesHtml || "",
    order: data.order !== undefined ? data.order : nextOrder,
    status: data.status || LECTURE_STATUS.DRAFT,
    video: {
      provider: "youtube",
      ref,
      hmac,
      durationSec,
      sourceTitle: meta.title,
      verifiedAt: new Date(),
      version: 1,
    },
    resources: data.resources || [],
    drip: data.drip || {},
  });

  // Update module and course aggregated statistics
  await Promise.all([
    Module.findByIdAndUpdate(moduleId, { $inc: { "stats.lectureCount": 1, "stats.durationSec": durationSec } }),
    Course.findByIdAndUpdate(courseId, { $inc: { "stats.lectureCount": 1, "stats.totalDurationSec": durationSec } }),
  ]);

  await recordAuditLog({
    actorId,
    action: "lecture.create",
    entityType: "lecture",
    entityId: lecture._id.toString(),
    summary: `Created lecture '${lecture.title}' with encrypted YouTube reference`,
    ip,
  });

  return lecture;
}

export async function updateLecture(id: string, data: any, actorId: string, ip = "127.0.0.1") {
  await connectToDatabase();
  const lecture = await Lecture.findOne({ _id: id, deletedAt: null }).select("+video.ref");
  if (!lecture) throw ApiError.notFound("Lecture not found");

  if (data.title !== undefined) lecture.title = data.title;
  if (data.description !== undefined) lecture.description = data.description;
  if (data.notesHtml !== undefined) lecture.notesHtml = data.notesHtml;
  if (data.status !== undefined) lecture.status = data.status;
  if (data.drip !== undefined) lecture.drip = data.drip;
  if (data.resources !== undefined) lecture.resources = data.resources;

  // If a new video link is provided, re-encrypt and update duration
  if (data.videoUrlOrId) {
    const videoId = parseYouTubeId(data.videoUrlOrId);
    if (!videoId) throw ApiError.badRequest("Invalid YouTube URL");
    const meta = await fetchYouTubeMeta(videoId);
    const durationSec = data.durationSec || meta.durationSec || 0;

    lecture.video = {
      provider: "youtube",
      ref: encryptVideoId(videoId),
      hmac: hashVideoId(videoId),
      durationSec,
      sourceTitle: meta.title,
      verifiedAt: new Date(),
      version: (lecture.video?.version || 1) + 1,
    };
  }

  await lecture.save();

  await recordAuditLog({
    actorId,
    action: "lecture.update",
    entityType: "lecture",
    entityId: id,
    summary: `Updated lecture '${lecture.title}'`,
    ip,
  });

  return lecture;
}

export async function deleteLecture(id: string, actorId: string, ip = "127.0.0.1") {
  await connectToDatabase();
  const lecture = await Lecture.findOne({ _id: id, deletedAt: null });
  if (!lecture) throw ApiError.notFound("Lecture not found");

  lecture.deletedAt = new Date();
  await lecture.save();

  const dur = lecture.video?.durationSec || 0;
  await Promise.all([
    Module.findByIdAndUpdate(lecture.moduleId, { $inc: { "stats.lectureCount": -1, "stats.durationSec": -dur } }),
    Course.findByIdAndUpdate(lecture.courseId, { $inc: { "stats.lectureCount": -1, "stats.totalDurationSec": -dur } }),
  ]);

  await recordAuditLog({
    actorId,
    action: "lecture.delete",
    entityType: "lecture",
    entityId: id,
    summary: `Deleted lecture '${lecture.title}'`,
    ip,
  });

  return { ok: true };
}

export async function reorderLectures(moduleId: string, items: Array<{ id: string; order: number }>, actorId: string, ip = "127.0.0.1") {
  await connectToDatabase();
  const operations = items.map((item) => ({
    updateOne: {
      filter: { _id: item.id, moduleId },
      update: { $set: { order: item.order } },
    },
  }));

  await Lecture.bulkWrite(operations);
  await recordAuditLog({
    actorId,
    action: "lecture.reorder",
    entityType: "module",
    entityId: moduleId,
    summary: `Reordered ${items.length} lectures in module`,
    ip,
  });
  return { ok: true };
}

export async function getLectureById(id: string) {
  await connectToDatabase();
  const lecture = await Lecture.findOne({ _id: id, deletedAt: null }).lean();
  if (!lecture) throw ApiError.notFound("Lecture not found");
  return lecture;
}
