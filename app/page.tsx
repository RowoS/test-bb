import Footer from "@/shared/ui/footer";
import Hero from "@/shared/ui/hero";
import Features from "@/shared/ui/featuresSection";
import NavBar from "@/shared/components/NavBar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}