export interface NavLink {
  label: string;
  href: string;
  activePattern?: string;
  badge?: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "code" | "terminal" | "quiz";
  isFree?: boolean;
}

export interface CourseModule {
  id: string;
  moduleNumber: string;
  title: string;
  description: string;
  lessons: CourseLesson[];
}

export interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  price: string;
  originalPrice?: string;
  period?: string;
  badge?: string;
  isPopular?: boolean;
  features: string[];
  ctaText: string;
  ctaHref: string;
}

export interface Course {
  slug: string;
  title: string;
  subtitle: string;
  cohort: string;
  level: string;
  duration: string;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  overview: string;
  outcomes: string[];
  modules: CourseModule[];
  pricingTiers: PricingTier[];
  instructor: TeamMember;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  avatarUrl: string;
  rating: number;
  quote: string;
  highlightProfit?: string;
  verifiedBroker?: string;
  category?: "retail" | "prop-firm" | "institutional";
}

export interface StudentStat {
  label: string;
  value: string;
  subtext: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  specialization: string;
  trackRecord?: string;
}

export interface Milestone {
  year: string;
  quarter?: string;
  title: string;
  description: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  courseTrack: string;
  message: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
}

