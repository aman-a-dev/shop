import { SearchBar } from "@/components/blocks/search-bar";
import HeroCarousel  from "@/components/blocks/hero-carousel";

export default async function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <HeroCarousel/>
      <SearchBar />
    </div>
  );
}

export const dynamic = "force-dynamic";
