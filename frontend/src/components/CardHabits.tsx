'use client'

import React, { useState } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import streakInactive from '../../public/json-animations/StreakInactive.json';
import streak3to49 from '../../public/json-animations/Streak3To49.json';
import streak50to99 from '../../public/json-animations/Streak50to99.json';
import streak100 from '../../public/json-animations/Streak100.json';


interface CardHabitsProps {
    habit: Habit
}

function CardHabits({ habit }: CardHabitsProps) {
    // Calculate today's date and activity dates set first
    const today = new Date();
    today.setHours(0,0,0,0);
    const activityDatesSet = new Set((habit.activities || []).map((activity) => new Date(activity.createdAt).toDateString()));
    // Get today's date string
    const todayStr = today.toDateString();
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
    startDate.setHours(0,0,0,0);
    const totalDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const maxPage = totalDays > 100 ? Math.ceil(totalDays / 100) - 1 : 0;
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [page, setPage] = useState(0) // 0 = latest, 1 = previous, etc.

    // Format the date
    const formattedDate = new Date(habit.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })


    // ...existing code...

    return (
        <Card className="w-full hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl">{habit.title}</CardTitle>
                        <span className="text-sm text-muted-foreground">{formattedDate}</span>
                    </div>

                    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DialogEditHabit
                                habit={habit}
                                trigger={
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        <span>Edit Habit</span>
                                    </DropdownMenuItem>
                                }
                            />
                            <DialogDeleteHabit
                                habit={habit}
                                trigger={
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                        <span className="text-destructive">Delete Habit</span>
                                    </DropdownMenuItem>
                                }
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {habit.description && (
                    <CardDescription className="mt-2 text-sm">
                        {habit.description}
                    </CardDescription>
                )}
                {/* Custom grid showing activity days */}
                <div className="mt-4">
                    <div className="flex flex-col items-center">
                        <div
                            className="grid grid-cols-20 gap-1 justify-center"
                            style={{ gridAutoRows: '20px', gridAutoFlow: 'row' }}
                        >
                            {(() => {
                                const boxes = [];
                                let gridStartDate = new Date(today);
                                gridStartDate.setDate(today.getDate() - (page * 100 + 99));
                                if (gridStartDate < startDate) {
                                    gridStartDate = new Date(startDate);
                                }
                                for (let i = 0; i < 100; i++) {
                                    const boxDate = new Date(gridStartDate);
                                    boxDate.setDate(gridStartDate.getDate() + i);
                                    if (boxDate > today) {
                                        boxes.push(
                                            <div
                                                key={boxDate.toDateString() + i}
                                                className="w-5 h-5 border rounded flex items-center justify-center bg-white"
                                            />
                                        );
                                        continue;
                                    }
                                    const dateStr = boxDate.toDateString();
                                    const hasActivity = activityDatesSet.has(dateStr);
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
                    <div className="flex items-center gap-3">
                        <div className="bg-white border rounded-lg shadow flex items-center justify-center" style={{ width: 56, height: 56 }}>
                            <Lottie animationData={streakAnimation} loop={true} autoplay={true} style={{ width: '80%', height: '80%' }} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Current Streak</span>
                            <span className="text-base font-bold text-green-600">{habit.streak || 0} days</span>
                        </div>
                    </div>
                    {/* Add Activity Button Bottom Right */}
                    <div className="flex items-center h-full">
                        <button
                            className="bg-white border rounded-lg shadow flex items-center justify-center font-semibold text-green-600 hover:bg-green-50 transition-all duration-150"
                            style={{ width: 56, height: 56 }}
                            aria-label="Add Activity"
                        >
                            <PlusIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}

export default CardHabits

