import "@/styles/public.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingSupportButton from "@/components/layout/FloatingSupportButton";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="public-theme min-h-screen flex flex-col bg-[#050919] text-slate-100 selection:bg-[#D4C385] selection:text-[#040714] antialiased">
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <FloatingSupportButton />
    </div>
  );
}
