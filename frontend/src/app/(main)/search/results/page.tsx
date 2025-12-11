"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Search Results</h1>
            {query && (
              <p className="text-sm text-muted-foreground">
                Results for &quot;{query}&quot;
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {query && (
            <p className="text-muted-foreground">
              Showing results for: &ldquo;<span className="font-semibold text-foreground">{query}</span>&rdquo;
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default SearchResults;
