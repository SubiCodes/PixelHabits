"use client"

import CardHabits from '@/components/CardHabits';
import LoadingPage from '@/components/LoadingPage';
import { Activity, useActivityStore } from '@/store/useActivityStore';
import { useHabitStore } from '@/store/useHabitStore';
import { useUser } from '@stackframe/stack';
import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import streakInactive from '../../../../lottie-jsons/StreakInactive.json';
import streak3to49 from '../../../../lottie-jsons/Streak3To49.json';
import streak50to99 from '../../../../lottie-jsons/Streak50to99.json';
import streak100 from '../../../../lottie-jsons/Streak100.json';
import ResponsiveCalendarGrid from '@/components/ResponsiveCalendarGrid';
import CardActivity from '@/components/CardActivity';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { DialogEditHabit } from '@/components/DialogEditHabit';
import { DialogDeleteHabit } from '@/components/DialogDeleteHabit';
import { DialogViewActivity } from '@/components/DialogViewActivity';
import { DialogEditActivity } from '@/components/DialogEditActivity';

function Habit({ params }: { params: Promise<{ id: string }> }) {

    const [isActivityOpen, setIsActivityOpen] = useState<boolean>(false);
    const [isEditActivityDialogOpen, setIsEditActivityDialogOpen] = useState<boolean>(false);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const openActivity = async (activity: Activity) => {
        setSelectedActivity(activity);
        setIsActivityOpen(true);
    };
    const closeActivity = () => {
        setIsActivityOpen(false);
    };
    const openEditActivityDialog = async (activity: Activity) => {
        setSelectedActivity(activity);
        setIsEditActivityDialogOpen(true);
    };
    const closeViewAndEditDialogs = () => {
        setIsActivityOpen(false);
        setIsEditActivityDialogOpen(false);
    };

    const { id } = React.use(params);
    const user = useUser();
    const habit = useHabitStore((state) => state.habit);
    const getHabit = useHabitStore((state) => state.getHabit);

    const calendarParentRef = React.useRef<HTMLDivElement>(null);

    const habitActivities = useActivityStore((state) => state.habitActivities);
    const gettingActivities = useActivityStore((state) => state.gettingActivities);
    const getActivitiesByHabitId = useActivityStore((state) => state.getActivitiesByHabitId);
    const gettingActivitiesError = useActivityStore((state) => state.gettingActivitiesError);

    useEffect(() => {
        if (!user) return;
        getHabit(id);
        getActivitiesByHabitId(id, user.id);
    }, [id, user, getActivitiesByHabitId, getHabit]);

    if (gettingActivities) {
        return <LoadingPage />;
    }

    // Select the correct animation (same logic as CardHabits)
    let streakAnimation = streakInactive;
    if (habit?.streak && habit.streak >= 3 && habit.streak < 50) {
        streakAnimation = streak3to49;
    } else if (habit?.streak && habit.streak >= 50 && habit.streak < 100) {
        streakAnimation = streak50to99;
    } else if (habit?.streak && habit.streak >= 100) {
        streakAnimation = streak100;
    }

    return (
        <div className="w-full flex flex-col gap-2 p-2">
            {/* Header Section */}
            {habit && (
                <>
                    <div className="relative">
                        <header className="w-full bg-gradient-to-r from-green-100 via-white to-green-50 rounded-t-xl shadow p-8 border-b flex flex-col md:flex-row items-center justify-between mb-0">
                            <div className="flex-1 min-w-0">
                                <h1 className="text-4xl font-extrabold text-green-700 mb-2 tracking-tight">{habit.title}</h1>
                                {habit.description && (
                                    <p className="text-lg text-gray-700 mb-2 text-center md:text-start mb-4">{habit.description}</p>
                                )}
                            </div>
                            <div className="flex flex-col items-center ml-6">
                                <div className="bg-white border-2 border-green-200 rounded-full shadow flex items-center justify-center mb-2" style={{ width: 64, height: 64 }}>
                                    <Lottie
                                        animationData={streakAnimation}
                                        loop={true}
                                        autoplay={true}
                                        style={{ width: '80%', height: '80%' }}
                                    />
                                </div>
                                <span className="text-xs text-green-700 font-semibold">Current Streak</span>
                                <span className="text-lg font-bold text-green-600">{habit.streak || 0} days</span>
                            </div>
                        </header>
                        {/* Dropdown options button - top right, spaced away from streak */}
                        <div className="absolute top-4 right-2 z-10">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap border-0 rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 hover:cursor-pointer hover:text-accent-foreground dark:hover:bg-accent/50 size-9"
                                        aria-label="Open habit options"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="6" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="18" r="1.5" /></svg>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DialogEditHabit
                                        habit={habit}
                                        atHabitPage={true}
                                        trigger={
                                            <DropdownMenuItem onSelect={e => e.preventDefault()}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z" /></svg>
                                                <span>Edit Habit</span>
                                            </DropdownMenuItem>
                                        }
                                    />
                                    <DialogDeleteHabit
                                        habit={habit}
                                        atHabitPage={true}
                                        trigger={
                                            <DropdownMenuItem onSelect={e => e.preventDefault()}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                <span className="text-destructive">Delete Habit</span>
                                            </DropdownMenuItem>
                                        }
                                    />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div ref={calendarParentRef} className="w-full">
                        <div className="bg-white rounded-xl shadow p-4 border w-full">
                            <ResponsiveCalendarGrid habit={habit} />
                        </div>
                    </div>
                    <div className='flex-1 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-2'>
                        {habitActivities.map((activity) => (
                            <CardActivity key={activity.id} activity={activity} openActivity={() => openActivity(activity)} />
                        ))}
                    </div>
                </>
            )}
            <DialogViewActivity
                open={isActivityOpen}
                close={() => setIsActivityOpen(false)}
                activity={selectedActivity}
                editFunc={(activity) => activity && openEditActivityDialog(activity as unknown as Activity)}
                deleteFunc={(activity) => console.log("Under Construction", activity?.id)}
            />
            <DialogEditActivity open={isEditActivityDialogOpen} onOpenChange={setIsEditActivityDialogOpen} activity={selectedActivity ?? null} onEditSuccess={closeViewAndEditDialogs} />
        </div>
    )
}

export default Habit
