"use client";

import React, { useState } from "react";
import { Search as SearchIcon, X, Clock, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchStore } from "@/store/useSearchStore";

function Search() {

  const getRecentSearches = useSearchStore((state) => state.getRecentSearches);
  const gettingRecentSearches = useSearchStore((state) => state.gettingRecentSearches);
  const recentSearches = useSearchStore((state) => state.recentSearches);
  const createSearch = useSearchStore((state) => state.createSearch);
  const creartingSearch = useSearchStore((state) => state.creartingSearch);

  const [searchQuery, setSearchQuery] = useState("");

  // Hardcoded recent searches
  const recentSearchess = [
    "Morning workout routine",
    "Healthy breakfast ideas",
    "Meditation techniques",
    "Running tips",
    "Yoga poses for beginners",
  ];

  // Hardcoded suggestions
  const suggestions = [
    "Morning workout routine for beginners",
    "Morning yoga stretches",
    "Morning meditation",
    "Morning run playlist",
    "Morning habit tracker",
    "Morning journaling prompts",
    "Morning skincare routine",
  ];

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleSearchClick = (query: string) => {
    setSearchQuery(query);
  };

  const handleRemoveRecentSearch = (search: string) => {
    // Will be implemented later with backend integration
    console.log("Remove:", search);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center gap-3 p-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for habits, users, or activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-12 text-base"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Recent Searches - Show when search is empty */}
          {!searchQuery && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Recent Searches</h2>
              </div>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer group"
                    onClick={() => handleSearchClick(search)}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{search}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveRecentSearch(search);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions - Show when search is not empty */}
          {searchQuery && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Suggestions</h2>
              </div>
              <div className="space-y-2">
                {suggestions
                  .filter((suggestion) =>
                    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => handleSearchClick(suggestion)}
                    >
                      <SearchIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{suggestion}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default Search;
