// components/admin/SearchBar.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export function SearchBar({
  placeholder = "Search...",
  className,
  debounceMs = 300,
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("search") || "";

  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (query) {
        params.set("search", query);
      } else {
        params.delete("search");
      }
      router.replace(`${pathname}?${params.toString()}`);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [query, pathname, router, searchParams, debounceMs]);

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />
      {query && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
          onClick={handleClear}
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}
