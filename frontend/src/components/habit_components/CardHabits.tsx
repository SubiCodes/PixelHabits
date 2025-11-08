'use client'

import React, { useState } from 'react'
import { toZonedTime , format } from 'date-fns-tz';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// ...existing code...
import { MoreVertical, Pencil, PlusIcon, Trash2 } from 'lucide-react'
import { Habit } from '@/store/useHabitStore'
import { DialogEditHabit } from './DialogEditHabit'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DialogDeleteHabit } from './DialogDeleteHabit'
import Lottie from 'lottie-react';
import streakInactive from '../../lottie-jsons/StreakInactive.json';
import streak3to49 from '../../lottie-jsons/Streak3To49.json';
import streak50to99 from '../../lottie-jsons/Streak50to99.json';
import streak100 from '../../lottie-jsons/Streak100.json';
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'


interface CardHabitsProps {
    habit: Habit;
    openCreateActivityDialog?: () => void;
    boxCount?: number;
}



const PH_TZ = 'Asia/Manila';
function getPHDateString(date: Date) {
    // Get the date in Asia/Manila timezone, format as yyyy-MM-dd
    return format(toZonedTime (date, PH_TZ), 'yyyy-MM-dd', { timeZone: PH_TZ });
}

function CardHabits({ habit, openCreateActivityDialog, boxCount = 80 }: CardHabitsProps) {
    const router = useRouter();

    // Calculate today's PH date and activity dates set (PH)
    const now = new Date();
    const todayStr = getPHDateString(now);
    const activityDatesSet = new Set((habit.activities || []).map((activity) => getPHDateString(new Date(activity.createdAt))));
    // Check if there is activity today
    const hasActivityToday = activityDatesSet.has(todayStr);

    // Select the correct animation
    let streakAnimation = streakInactive;
    if (hasActivityToday && habit.streak && habit.streak >= 3 && habit.streak < 50) {
        streakAnimation = streak3to49;
    } else if (hasActivityToday && habit.streak && habit.streak >= 50 && habit.streak < 100) {
        streakAnimation = streak50to99;
    } else if (hasActivityToday && habit.streak && habit.streak >= 100) {
        streakAnimation = streak100;
    }
    // Calculate total days and maxPage for pagination
    const startDate = new Date(habit.createdAt);
    startDate.setHours(0, 0, 0, 0);
    const totalDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const maxPage = totalDays > boxCount ? Math.ceil(totalDays / boxCount) - 1 : 0;
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [page, setPage] = useState(0) // 0 = latest, 1 = previous, etc.

    // Format the date
    const formattedDate = new Date(habit.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const openHabit = () => {
        router.push(`/habits/${habit.id}`);
    };

    const openCreateActivity = () => {
        if (!hasActivityToday && openCreateActivityDialog) {
            openCreateActivityDialog();
        } else {
            toast.error("You've already logged an activity for today!");
        }
    }

    return (
        <Card className="w-full hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0" style={{ cursor: 'pointer' }} onClick={openHabit}>
                        <CardTitle className="text-xl">{habit.title}</CardTitle>
                        <span className="text-sm text-muted-foreground">{formattedDate}</span>
                    </div>

                    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                        <DropdownMenuTrigger asChild>
                            <span
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9"
                                tabIndex={0}
                                role="button"
                                aria-label="Open menu"
                                onClick={e => e.stopPropagation()}
                            >
                                <MoreVertical className="h-4 w-4" />
                            </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DialogEditHabit
                                habit={habit}
                                trigger={
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); }}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        <span>Edit Habit</span>
                                    </DropdownMenuItem>
                                }
                            />
                            <DialogDeleteHabit
                                habit={habit}
                                trigger={
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); }}>
                                        <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                        <span className="text-destructive">Delete Habit</span>
                                    </DropdownMenuItem>
                                }
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {habit.description && (
                    <CardDescription className="mt-2 text-sm cursor-pointer" onClick={openHabit}>
                        {habit.description}
                    </CardDescription>
                )}
                {/* Custom grid showing activity days */}
                <div className="mt-4 cursor-pointer" onClick={openHabit}>
                    <div className="flex flex-col items-center w-full">
                        <div
                            className="grid gap-x-2 gap-y-1 justify-center"
                            style={{ gridTemplateColumns: `repeat(${Math.ceil(boxCount / 5)}, minmax(0, 1fr))`, gridAutoRows: '20px' }}
                        >
                            {(() => {
                                const boxes = [];
                                let gridStartDate = new Date(now);
                                gridStartDate.setDate(now.getDate() - (page * boxCount + (boxCount - 1)));
                                if (gridStartDate < startDate) {
                                    gridStartDate = new Date(startDate);
                                }
                                for (let i = 0; i < boxCount; i++) {
                                    const boxDate = new Date(gridStartDate);
                                    boxDate.setDate(gridStartDate.getDate() + i);
                                    if (boxDate > now) {
                                        boxes.push(
                                            <div
                                                key={boxDate.toDateString() + i}
                                                className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center bg-white opacity-40"
                                            />
                                        );
                                        continue;
                                    }
                                    const dateStr = getPHDateString(boxDate);
                                    const hasActivity = activityDatesSet.has(dateStr);
                                    // Past day, no activity
                                    if (!hasActivity && boxDate < now) {
                                        boxes.push(
                                            <div
                                                key={dateStr + i}
                                                className="w-5 h-5 border rounded flex items-center justify-center cursor-pointer bg-gray-200"
                                                title={boxDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            />
                                        );
                                        continue;
                                    }
                                    // Past or today, with activity
                                    boxes.push(
                                        <div
                                            key={dateStr + i}
                                            className={`w-5 h-5 border rounded flex items-center justify-center cursor-pointer ${hasActivity ? 'bg-green-500' : 'bg-white'}`}
                                            title={boxDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        />
                                    );
                                }
                                return boxes;
                            })()}
                        </div>
                        {/* Pagination controls */}
                        {maxPage > 0 && (
                            <div className="flex justify-between items-center w-full mt-2">
                                <button
                                    className="px-2 py-1 text-xs border rounded disabled:opacity-50"
                                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                >
                                    Previous
                                </button>
                                <span className="text-xs mx-2">Page {page + 1} of {maxPage + 1}</span>
                                <button
                                    className="px-2 py-1 text-xs border rounded disabled:opacity-50"
                                    onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                                    disabled={page === maxPage}
                                >   
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {/* Enhanced Bottom UI: Streak and Add Activity */}
                <div className="flex items-end justify-between mt-6 w-full px-2 py-3 bg-linear-to-r from-gray-50 via-white to-gray-50 rounded-lg shadow-sm border">
                    {/* Streak Animation Bottom Left */}
                    <div className="flex items-center gap-3" onClick={openHabit}>
                        <div className="bg-white border rounded-lg shadow flex items-center justify-center" style={{ width: 56, height: 56 }}>
                            <Lottie animationData={streakAnimation} loop={true} autoplay={true} style={{ width: '80%', height: '80%' }} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Current Streak</span>
                            <span className="text-base font-bold text-green-600">{habit.streak || 0} days</span>
                        </div>
                    </div>
                    {/* Add Activity Button Bottom Right */}
                    {openCreateActivityDialog && (
                        <div className="flex items-center h-full">
                            <button
                                className="bg-white cursor-pointer border rounded-lg shadow flex items-center justify-center font-semibold text-green-600 hover:bg-green-50 transition-all duration-150"
                                style={{ width: 56, height: 56 }}
                                aria-label="Add Activity"
                                onClick={e => { e.stopPropagation(); openCreateActivity(); }}
                            >
                                <PlusIcon className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </CardHeader>
        </Card>
    )
}

export default CardHabits

