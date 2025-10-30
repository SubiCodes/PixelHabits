"use client"

import CardHabits from '@/components/CardHabits';
import LoadingPage from '@/components/LoadingPage';
import { useActivityStore } from '@/store/useActivityStore';
import { useHabitStore } from '@/store/useHabitStore';
import { useUser } from '@stackframe/stack';
import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import streakInactive from '../../../../lottie-jsons/StreakInactive.json';
import streak3to49 from '../../../../lottie-jsons/Streak3To49.json';
import streak50to99 from '../../../../lottie-jsons/Streak50to99.json';
import streak100 from '../../../../lottie-jsons/Streak100.json';
import ResponsiveCalendarGrid from '@/components/ResponsiveCalendarGrid';

function Habit({ params }: { params: Promise<{ id: string }> }) {

    const { id } = React.use(params);
    const user = useUser();
    const habit = useHabitStore((state) => state.getHabit(id));

     const calendarParentRef = React.useRef<HTMLDivElement>(null);

    const habitActivities = useActivityStore((state) => state.habitActivities);
    const gettingActivities = useActivityStore((state) => state.gettingActivities);
    const getActivitiesByHabitId = useActivityStore((state) => state.getActivitiesByHabitId);
    const gettingActivitiesError = useActivityStore((state) => state.gettingActivitiesError);

    useEffect(() => {
        if (!user) return;
        getActivitiesByHabitId(id, user.id);
    }, [id, user, getActivitiesByHabitId]);

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
        <div className='w-full max-h-screen overflow-y-auto flex flex-col p-2 gap-2'>
            {/* Header Section */}
            {habit && (
                <>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-white rounded-xl shadow border">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{habit.title}</h1>
                            {habit.description && (
                                <p className="text-lg text-muted-foreground mb-2">{habit.description}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white border rounded-lg shadow flex items-center justify-center" style={{ width: 56, height: 56 }}>
                                <Lottie
                                    animationData={streakAnimation}
                                    loop={true}
                                    autoplay={true}
                                    style={{ width: '80%', height: '80%' }}
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">Current Streak</span>
                                <span className="text-base font-bold text-green-600">{habit.streak || 0} days</span>
                            </div>
                        </div>
                    </div>
                    <div ref={calendarParentRef} className="w-full min-w-full px-1">
                        <ResponsiveCalendarGrid habit={habit} />
                    </div>
                </>
            )}
            {/* ...rest of page... */}
        </div>
    )
}

export default Habit
