import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COURSES } from "@/data/courses";
import CourseHero from "@/components/sections/courses/CourseHero";
import CourseSubNav from "@/components/sections/courses/CourseSubNav";
import WhatYouWillMaster from "@/components/sections/courses/WhatYouWillMaster";
import CurriculumAccordion from "@/components/sections/courses/CurriculumAccordion";
import InstructorBio from "@/components/sections/courses/InstructorBio";
import CoursePricing from "@/components/sections/courses/CoursePricing";
import CourseFAQ from "@/components/sections/courses/CourseFAQ";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COURSES.map((course) => ({
    slug: course.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = COURSES.find((c) => c.slug === slug);
  if (!course) return {};

  return {
    title: `${course.title} | Institute of Trading Tricks`,
    description: course.subtitle,
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = COURSES.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="w-full bg-[#080B11]">
      <CourseHero course={course} />
      <CourseSubNav />
      <WhatYouWillMaster />
      <CurriculumAccordion modules={course.modules} />
      <InstructorBio instructor={course.instructor} />
      <CoursePricing tiers={course.pricingTiers} />
      <CourseFAQ />
    </div>
  );
}
