import { SearchBar } from "@/components/blocks/search-bar";
import SplashPage from "./splash-page";

export default async function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Our Products</h1>
      <SearchBar />
      <SplashPage />
    </div>
  );
}

export const dynamic = "force-dynamic";
