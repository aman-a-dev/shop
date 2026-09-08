import { SearchBar } from "@/components/blocks/search-bar";

export default async function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Our Products</h1>
      <SearchBar />
    </div>
  );
}

export const dynamic = "force-dynamic";
