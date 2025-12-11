/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchStore } from "@/store/useSearchStore";
import LoadingPage from "@/components/LoadingPage";
import ErrorPage from "@/components/ErrorPage";
import TabsProfilePages from "@/components/profile_components/TabsProfilePages";
import CardActivity from "@/components/activity_components/CardActivity";
import CardHabits from "@/components/habit_components/CardHabits";
import CardUser from "@/components/user_components/CardUser";

function SearchResults() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const gettingSearchResults = useSearchStore((state) => state.gettingSearchResults);
    const searchResults = useSearchStore((state) => state.searchResults);
    const getSearchResults = useSearchStore((state) => state.getSearchResults);
    const getSearchResultsError = useSearchStore((state) => state.getSearchResultsError);

    const [activeTab, setActiveTab] = React.useState("All");

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
                    <div className="flex flex-1 min-h-full items-center justify-center">
                        <LoadingPage />
                    </div>
                ) : getSearchResultsError ? (
                    <div className="flex flex-1 min-h-full items-center justify-center">
                        <ErrorPage retryAction={() => getSearchResults(query)}/>
                    </div>
                ) : (
                    <div className="flex flex-col p-4">
                       <TabsProfilePages pages={["All", "Activities", "Habits", "User"]} activeTab={activeTab} onChangeTab={(tab) => setActiveTab(tab)} />
                        
                        <div className="mt-4 space-y-4">
                            {activeTab === "All" && (() => {
                                const activities = (searchResults && !Array.isArray(searchResults)) ? searchResults.activities : [];
                                const users = (searchResults && !Array.isArray(searchResults)) ? searchResults.users : [];
                                const habits = (searchResults && !Array.isArray(searchResults)) ? searchResults.habits : [];
                                const interleaved: Array<{ type: 'activity' | 'user' | 'habit', data: any, id: string }> = [];
                                
                                let actIndex = 0, userIndex = 0, habitIndex = 0;
                                
                                while (actIndex < activities.length || userIndex < users.length || habitIndex < habits.length) {
                                    // Add 2 activities
                                    for (let i = 0; i < 2 && actIndex < activities.length; i++) {
                                        const activity = activities[actIndex++];
                                        interleaved.push({ type: 'activity', data: activity, id: activity.id });
                                    }
                                    // Add 2 users
                                    for (let i = 0; i < 2 && userIndex < users.length; i++) {
                                        const user = users[userIndex++];
                                        interleaved.push({ type: 'user', data: user, id: user.id });
                                    }
                                    // Add 2 habits
                                    for (let i = 0; i < 2 && habitIndex < habits.length; i++) {
                                        const habit = habits[habitIndex++];
                                        interleaved.push({ type: 'habit', data: habit, id: habit.id });
                                    }
                                }
                                
                                // Group consecutive items of the same type
                                const grouped: Array<{ type: 'activity' | 'user' | 'habit', items: any[] }> = [];
                                for (const item of interleaved) {
                                    const lastGroup = grouped[grouped.length - 1];
                                    if (lastGroup && lastGroup.type === item.type) {
                                        lastGroup.items.push(item);
                                    } else {
                                        grouped.push({ type: item.type, items: [item] });
                                    }
                                }
                                
                                return grouped.map((group, groupIndex) => (
                                    <div key={`group-${group.type}-${groupIndex}`}>
                                        {group.type === 'activity' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {group.items.map((item) => (
                                                    <CardActivity key={item.id} activity={item.data as any} openActivity={() => {}} />
                                                ))}
                                            </div>
                                        )}
                                        {group.type === 'user' && (
                                            <div className="flex flex-col gap-4">
                                                {group.items.map((item) => (
                                                    <CardUser key={item.id} user={item.data as any} onClick={() => {}} />
                                                ))}
                                            </div>
                                        )}
                                        {group.type === 'habit' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {group.items.map((item) => (
                                                    <CardHabits key={item.id} habit={item.data as any} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ));
                            })()}
                            
                            {activeTab === "Activities" && (searchResults && !Array.isArray(searchResults)) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {searchResults.activities?.map((activity) => (
                                        <CardActivity key={activity.id} activity={activity} openActivity={() => {}} />
                                    ))}
                                </div>
                            )}
                            
                            {activeTab === "Habits" && (searchResults && !Array.isArray(searchResults)) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {searchResults.habits?.map((habit) => (
                                        <CardHabits key={habit.id} habit={habit} />
                                    ))}
                                </div>
                            )}
                            
                            {activeTab === "User" && (searchResults && !Array.isArray(searchResults)) && searchResults.users?.map((user) => (
                                <CardUser key={user.id} user={user} onClick={() => {}} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchResults;
