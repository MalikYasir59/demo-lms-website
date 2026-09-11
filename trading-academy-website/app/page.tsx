import type { Metadata } from "next";
import HomeHero from "@/components/sections/home/HomeHero";
import FounderMasterclass from "@/components/sections/home/FounderMasterclass";
import StudentLMSPlatform from "@/components/sections/home/StudentLMSPlatform";
import PhysicalCampusFloor from "@/components/sections/home/PhysicalCampusFloor";
import AuditedResultsPayouts from "@/components/sections/home/AuditedResultsPayouts";
import LmsEnrollmentPricing from "@/components/sections/home/LmsEnrollmentPricing";

export const metadata: Metadata = {
  title: "Institute of Trading Tricks | Institutional Trading Floor & Student LMS",
  description:
    "Master institutional trading with zero fluff and pure execution. Islamabad physical campus floors, proprietary student LMS portal, live daily London/NY sessions, and verified prop firm pass blueprints.",
};

export default function HomePage() {
  return (
    <div className="w-full bg-[#080B11]">
      <HomeHero />
      <FounderMasterclass />
      <StudentLMSPlatform />
      <PhysicalCampusFloor />
      <AuditedResultsPayouts />
      <LmsEnrollmentPricing />
    </div>
  );
}
