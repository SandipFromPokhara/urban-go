import HeroSection from "./HeroSection";
import SearchArea from "./SearchArea";

function TransportPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection />

      {/* Body Section */}
      <section className="max-w-6xl ms-auto px-6 mt-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column */}
          <div className="w-full md:w-2/5">
            <SearchArea />
          </div>

          {/* Right Column: Map placeholder */}
          <div className="w-full md:w-3/5 h-96 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Map will go here</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default TransportPage;
