import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reserve Your Seat & Contact | Institute of Trading Tricks",
  description:
    "Send an enquiry and our team will get back to you during opening hours. Visit our campus in PWD Islamabad, Wah Cantt or Attock.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
