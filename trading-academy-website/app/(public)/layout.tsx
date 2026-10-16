import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingSupportButton from "@/components/layout/FloatingSupportButton";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Global Ambient Floor 0 Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-ambient-glow opacity-70" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <FloatingSupportButton />
      </div>
    </>
  );
}
