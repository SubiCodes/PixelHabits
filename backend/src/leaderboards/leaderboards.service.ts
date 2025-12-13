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
        const sortedUsers = Array.from(userInteractions.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([userId]) => userId);

        // Update or create the interaction leaderboard
        await this.databaseService.leaderboards.upsert({
            where: { type: 'interaction' },
            update: {
                userIds: sortedUsers,
                updatedAt: new Date(),
            },
            create: {
                type: 'interaction',
                userIds: sortedUsers,
            }
        });

        console.log('Interaction leaders updated:', sortedUsers.length, 'users');
    }
}
