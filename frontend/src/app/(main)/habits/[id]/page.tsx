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
    <div className="w-full flex flex-col gap-2 p-2">
            {/* Header Section */}
            {habit && (
                <>
                    <header className="w-full bg-gradient-to-r from-green-100 via-white to-green-50 rounded-t-xl shadow p-8 border-b flex flex-col md:flex-row items-center justify-between mb-0">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-4xl font-extrabold text-green-700 mb-2 tracking-tight">{habit.title}</h1>
                            {habit.description && (
                                <p className="text-lg text-gray-700 mb-2">{habit.description}</p>
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
                    <div ref={calendarParentRef} className="w-full">
                        <div className="bg-white rounded-xl shadow p-4 border w-full">
                            <ResponsiveCalendarGrid habit={habit} />
                        </div>
                    </div>
                </>
            )}
            {/* ...rest of page... */}
        </div>
    )
}

export default Habit
