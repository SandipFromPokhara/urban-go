import Hero from "../components/homeComponents/Hero";
import CategoryGrid from "../components/homeComponents/CategoryGrid";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-cover bg-center bg-fixed bg-background-color">
      <div className="relative z-10">
        <Hero />
        <CategoryGrid />
      </div>
    </div>
  );
}