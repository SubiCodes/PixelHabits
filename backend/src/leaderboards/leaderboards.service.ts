import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class LeaderboardsService {
    constructor(private readonly databaseService: DatabaseService) { }

    @Cron('0 0 * * *', {
        timeZone: 'Asia/Manila',
    })
    async updateLeaderboards() {
        console.log('Updating leaderboards at 12AM Philippine time');

        try {
            // Calculate interaction leaders
            await this.calculateInteractionLeaders();
            
            // Calculate streak leaders
            await this.calculateStreakLeaders();

            console.log('Leaderboards updated successfully');
        } catch (error) {
            console.error('Error updating leaderboards:', error);
        }
    }

    private async calculateInteractionLeaders() {
        // Get all activities with their interactions grouped by owner
        const activities = await this.databaseService.activities.findMany({
            select: {
                ownerId: true,
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                        views: true,
                    }
                },
                comments: {
                    select: {
                        _count: {
                            select: {
                                replies: true,
                            }
                        }
                    }
                }
            }
        });

        // Aggregate interactions by user
        const userInteractions = new Map<string, number>();

        // Count all interactions for each user's activities
        for (const activity of activities) {
            const currentCount = userInteractions.get(activity.ownerId) || 0;
            
            // Count likes, comments, and views on the activity
            const activityInteractions =
                activity._count.likes +
                activity._count.comments +
                activity._count.views;
            
            // Count replies on all comments of this activity
            const replyCount = activity.comments.reduce((sum, comment) => {
                return sum + comment._count.replies;
            }, 0);
            
            const totalInteractions = activityInteractions + replyCount;
            userInteractions.set(activity.ownerId, currentCount + totalInteractions);
        }

        // Sort users by interaction count and get top 10
        const sortedLeaders = Array.from(userInteractions.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        const sortedUsers = sortedLeaders.map(([userId]) => userId);
        const sortedAmounts = sortedLeaders.map(([, amount]) => amount);

        // Update or create the interaction leaderboard
        await this.databaseService.leaderboards.upsert({
            where: { type: 'interaction' },
            update: {
                userIds: sortedUsers,
                amounts: sortedAmounts,
                updatedAt: new Date(),
            },
            create: {
                type: 'interaction',
                userIds: sortedUsers,
                amounts: sortedAmounts,
            }
        });

        console.log('Interaction leaders updated:', sortedUsers.length, 'users');
    }

    private async calculateStreakLeaders() {
        // Get all users from users_sync table
        const users = await this.databaseService.users_sync.findMany({
            where: {
                deletedAt: null,
            },
            select: {
                id: true,
            }
        });

        const userStreaks: { userId: string; streak: number }[] = [];

        // Calculate streak for each user
        for (const user of users) {
            const activities = await this.databaseService.activities.findMany({
                where: {
                    ownerId: user.id,
                },
                select: {
                    createdAt: true,
                },
                orderBy: {
                    createdAt: 'asc',
                }
            });

            const streak = this.calculateUserStreak(activities);
            if (streak > 0) {
                userStreaks.push({ userId: user.id, streak });
            }
        }

        // Sort by streak (descending) and get top 10
        const sortedLeaders = userStreaks
            .sort((a, b) => b.streak - a.streak)
            .slice(0, 10);
        
        const sortedUsers = sortedLeaders.map(({ userId }) => userId);
        const sortedAmounts = sortedLeaders.map(({ streak }) => streak);

        // Update or create the streak leaderboard
        await this.databaseService.leaderboards.upsert({
            where: { type: 'streak' },
            update: {
                userIds: sortedUsers,
                amounts: sortedAmounts,
                updatedAt: new Date(),
            },
            create: {
                type: 'streak',
                userIds: sortedUsers,
                amounts: sortedAmounts,
            }
        });

        console.log('Streak leaders updated:', sortedUsers.length, 'users');
    }

    private calculateUserStreak(activities: { createdAt: Date }[]): number {
        if (activities.length === 0) return 0;

        // Get unique activity dates in PH timezone
        const activityDates = Array.from(new Set(
            activities.map(a => {
                const date = typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt;
                return this.getPHDateString(date);
            })
        ));
        activityDates.sort();

        let streak = 0;
        if (activityDates.length > 0) {
            const now = new Date();
            const todayStr = this.getPHDateString(now);
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            const yesterdayStr = this.getPHDateString(yesterday);
            const lastActivityDateStr = activityDates[activityDates.length - 1];
            const lastDateStr = lastActivityDateStr;

            if (lastDateStr === todayStr || lastDateStr === yesterdayStr) {
                streak = 1;
                for (let i = activityDates.length - 1; i > 0; i--) {
                    const prevStr = activityDates[i - 1];
                    const currStr = activityDates[i];
                    // Parse as local midnight
                    const prevDate = new Date(prevStr + 'T00:00:00');
                    const currDate = new Date(currStr + 'T00:00:00');
                    const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
                    if (diffDays === 1) {
                        streak++;
                    } else {
                        break;
                    }
                }
            }
        }

        return streak;
    }

    private getPHDateString(date: Date): string {
        // Convert to Philippine timezone (UTC+8)
        const phDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
        const year = phDate.getFullYear();
        const month = String(phDate.getMonth() + 1).padStart(2, '0');
        const day = String(phDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
