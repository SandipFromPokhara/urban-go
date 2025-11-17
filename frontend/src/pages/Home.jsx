import Hero from "../components/homeComponents/Hero";
import CategoryGrid from "../components/homeComponents/CategoryGrid";
import WhySection from "../components/homeComponents/WhySection";

export default function Home({ isDarkMode }) {
  return (
    <div className="relative min-h-screen bg-cover bg-center bg-fixed josefin-sans-regular" style={{backgroundColor: isDarkMode ? 'var(--color-background-color)' : 'white'}}>
      <div className="relative z-10">
        <Hero />
        <CategoryGrid isDarkMode={isDarkMode} />
        <WhySection isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}