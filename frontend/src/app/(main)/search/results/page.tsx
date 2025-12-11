"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchStore } from "@/store/useSearchStore";
import LoadingPage from "@/components/LoadingPage";
import Error from "next/error";

function SearchResults() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const gettingSearchResults = useSearchStore((state) => state.gettingSearchResults);
    const searchResults = useSearchStore((state) => state.searchResults);
    const getSearchResults = useSearchStore((state) => state.getSearchResults);
    const getSearchResultsError = useSearchStore((state) => state.getSearchResultsError);

    React.useEffect(() => {
        getSearchResults(query);
    }, [query]);

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 bg-background border-b">
                <div className="flex items-center gap-3 p-4">
                    <button
                        onClick={() => router.back()}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold text-foreground">Search Results</h1>
                        {query && (
                            <p className="text-sm text-muted-foreground">
                                Results for &quot;{query}&quot;
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {gettingSearchResults ? (
                    <LoadingPage />
                ) : getSearchResultsError ? (
                    <Error statusCode={500} title="Failed to load search results" />
                ) : (
                    <div className="p-4">
                        {query && (
                            <p className="text-muted-foreground">
                                Showing results for: &ldquo;<span className="font-semibold text-foreground">{query}</span>&rdquo;
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchResults;
