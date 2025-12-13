/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { Trophy, Flame, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Lottie from 'lottie-react';
import Streak3To49 from '@/lottie-jsons/Streak3To49.json';
import Streak50to99 from '@/lottie-jsons/Streak50to99.json';
import Streak100 from '@/lottie-jsons/Streak100.json';
import { useLeaderBoardStore } from '@/store/useLeaderBoards.store';
import LoadingPage from '@/components/LoadingPage';
import ErrorPage from '@/components/ErrorPage';

function Leaderboards() {
  const [timeUntilRefresh, setTimeUntilRefresh] = useState('');

  const interactionLeadersData = useLeaderBoardStore((state) => state.interactionLeaders);
  const streakLeadersData = useLeaderBoardStore((state) => state.streakLeaders);
  const gettingLeaderBoards = useLeaderBoardStore((state) => state.gettingLeaderBoards);
  const getLeaderBoards = useLeaderBoardStore((state) => state.getLeaderBoards);
  const gettingLeaderBoardsError = useLeaderBoardStore((state) => state.gettingLeaderBoardsError);

  // Transform store data to UI format
  const interactionLeaders = interactionLeadersData?.users.map((user, index) => ({
    id: user.id,
    name: user.name || 'Unknown User',
    profileImageUrl: (user.rawJson as any)?.profile_image_url || '',
    points: interactionLeadersData.amounts[index] || 0,
  })) || [];

  const streakLeaders = streakLeadersData?.users.map((user, index) => ({
    id: user.id,
    name: user.name || 'Unknown User',
    profileImageUrl: (user.rawJson as any)?.profile_image_url || '',
    streak: streakLeadersData.amounts[index] || 0,
  })) || [];

  useEffect(() => {
    getLeaderBoards();
  }, [getLeaderBoards]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const phTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));

      // Calculate next 12AM Philippine time
      const nextMidnight = new Date(phTime);
      nextMidnight.setHours(24, 0, 0, 0);

      const diff = nextMidnight.getTime() - phTime.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeUntilRefresh(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStreakAnimation = (streak: number) => {
    if (streak >= 100) return Streak100;
    if (streak >= 50) return Streak50to99;
    return Streak3To49;
  };

  const getMedalColor = (position: number) => {
    switch (position) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-700';
      default: return 'text-muted-foreground';
    }
  };

  const getMedalBg = (position: number) => {
    switch (position) {
      case 1: return 'bg-yellow-500/20 border-yellow-500/40 border-2';
      case 2: return 'bg-gray-400/20 border-gray-400/40 border-2';
      case 3: return 'bg-amber-700/20 border-amber-700/40 border-2';
      default: return 'bg-card border';
    }
  };

  if (gettingLeaderBoards) {
    return (
      <div className='min-h-full max-h-full min-w-full max-w-full flex items-center justify-center'>
        <LoadingPage />
      </div>
    );
  }

  if (gettingLeaderBoardsError) {
    return (
      <div className='min-h-full max-h-full min-w-full max-w-full flex items-center justify-center'>
        <ErrorPage errorMessage={gettingLeaderBoardsError} retryAction={getLeaderBoards}/>
      </div>
    );
  }

  return (
    <div className="max-h-screen overflow-auto bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Leaderboards</h1>
            </div>
            <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="text-muted-foreground">Refresh in </span>
                <span className="font-mono font-semibold">{timeUntilRefresh}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Top performers updated daily at 12:00 AM (PH Time)
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-6 space-y-6">
        {/* Streak Leaders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Longest Streaks
            </CardTitle>
            <CardDescription>
              Users with the longest consecutive daily activity streaks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {streakLeaders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No streak leaders yet</p>
            ) : (
              streakLeaders.map((leader, index) => (
                <div
                  key={leader.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${getMedalBg(index + 1)}`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${index < 3 ? getMedalColor(index + 1) : 'text-muted-foreground'}`}>
                    {index < 3 ? <Trophy className="h-5 w-5" /> : `#${index + 1}`}
                  </div>

                  <Avatar className="h-12 w-12 border-2">
                    <AvatarImage src={leader.profileImageUrl} />
                    <AvatarFallback>{leader.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <p className="font-semibold">{leader.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {leader.streak} day streak
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Lottie
                      animationData={getStreakAnimation(leader.streak)}
                      loop
                      className="h-12 w-12"
                    />
                    <Badge variant="secondary" className="text-base font-bold px-3 py-1">
                      {leader.streak}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Interaction Leaders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Most Interacted
            </CardTitle>
            <CardDescription>
              Users with the most engagement on their activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {interactionLeaders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No interaction leaders yet</p>
            ) : (
              interactionLeaders.map((leader, index) => (
                <div
                  key={leader.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${getMedalBg(index + 1)}`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${index < 3 ? getMedalColor(index + 1) : 'text-muted-foreground'}`}>
                    {index < 3 ? <Trophy className="h-5 w-5" /> : `#${index + 1}`}
                  </div>

                  <Avatar className="h-12 w-12 border-2">
                    <AvatarImage src={leader.profileImageUrl} />
                    <AvatarFallback>{leader.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <p className="font-semibold">{leader.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {leader.points.toLocaleString()} interactions
                    </p>
                  </div>

                  <Badge variant="secondary" className="text-base font-bold px-3 py-1">
                    {leader.points.toLocaleString()}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Leaderboards;
