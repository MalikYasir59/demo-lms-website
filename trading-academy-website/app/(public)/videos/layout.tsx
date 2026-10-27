import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Videos | Institute of Trading Tricks",
  description:
    "Lessons, live sessions and student stories from the Institute of Trading Tricks YouTube channel — 125 videos and counting.",
};

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
