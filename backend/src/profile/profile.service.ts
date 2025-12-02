import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProfileService {
  constructor(private readonly databaseService: DatabaseService) { }

  async findOne(id: string) {
    const profile = await this.databaseService.users_sync.findUnique({
      where: { id },
    });
    
    const habitsCount = await this.databaseService.habits.count({
      where: { ownerId: id },
    });
    
    const activitiesCount = await this.databaseService.activities.count({
      where: { ownerId: id },
    });

    // Calculate longest streak across all user's habits
    const habits = await this.databaseService.habits.findMany({
      where: { ownerId: id },
      include: {
        activities: {
          select: {
            createdAt: true,
          },
        },
      },
    });

    let longestStreak = 0;

    for (const habit of habits) {
      const activityDates = Array.from(
        new Set(
          habit.activities.map((a) => {
            const date = new Date(a.createdAt);
            // Convert to YYYY-MM-DD in local timezone
            return date.toISOString().split('T')[0];
          })
        )
      );
      
      activityDates.sort();

      if (activityDates.length > 0) {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        const lastActivityDateStr = activityDates[activityDates.length - 1];

        if (lastActivityDateStr === todayStr || lastActivityDateStr === yesterdayStr) {
          let streak = 1;
          
          for (let i = activityDates.length - 1; i > 0; i--) {
            const prevStr = activityDates[i - 1];
            const currStr = activityDates[i];
            
            const prevDate = new Date(prevStr + 'T00:00:00');
            const currDate = new Date(currStr + 'T00:00:00');
            
            const diffDays = Math.round(
              (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            
            if (diffDays === 1) {
              streak++;
            } else {
              break;
            }
          }
          
          if (streak > longestStreak) {
            longestStreak = streak;
          }
        }
      }
    }

    return {
      ...profile,
      habitsCount,
      activitiesCount,
      longestStreak,
    };
  }

  update(id: string, updateProfileDto: UpdateProfileDto) {
    if (updateProfileDto.bio !== undefined) {
      return this.databaseService.users_sync.update({
        where: { id },
        data: {
          bio: updateProfileDto.bio,
        },
      });
    }
    if (updateProfileDto.is_new !== undefined) {
      return this.databaseService.users_sync.update({
        where: { id },
        data: {
          isNew: updateProfileDto.is_new,
        },
      });
    }
    return this.findOne(id);
  }

}
