import { Injectable } from '@nestjs/common';
import { CreateSearchDto } from './dto/create-search.dto';
import { DatabaseService } from 'src/database/database.service';
import { enrichWithUserData } from 'src/common/utils/user-enrichment.util';
import { serializeModelDates } from 'src/utils/serializeModelDates';
import { toZonedTime, format } from 'date-fns-tz';

@Injectable()
export class SearchService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createSearchDto: CreateSearchDto) {
    const user = await this.databaseService.users_sync.findUnique({
      where: { id: createSearchDto.userId },
      select: { searches: true },
    });

    const existingSearches = user?.searches || [];
    const newSearches = createSearchDto.searches;

    // Remove duplicates if they exist, then add them to the end
    const filteredSearches = existingSearches.filter(term => !newSearches.includes(term));
    const updatedSearches = [...filteredSearches, ...newSearches];

    await this.databaseService.users_sync.update({
      where: { id: createSearchDto.userId },
      data: {
        searches: updatedSearches,
      },
    });
    return updatedSearches;
  };

  async remove(id: string, searchTerm: string) {
    const user = await this.databaseService.users_sync.findUnique({
      where: { id: id },
      select: { searches: true },
    });

    const updatedSearches = (user?.searches || []).filter(term => term !== searchTerm);

    const updatedUser = await this.databaseService.users_sync.update({
      where: { id: id },
      data: {
        searches: updatedSearches,
      },
    });
    return updatedUser;
  };

  async getRecentSearches(id: string) {
    const user = await this.databaseService.users_sync.findUnique({
      where: { id: id },
      select: { searches: true },
    });
    return user?.searches || [];
  }

  async getSuggestions(searchText: string): Promise<string[]> {
    if (!searchText || searchText.trim().length === 0) {
      return [];
    }

    const searchTerm = searchText.toLowerCase();

    // Search habits by title
    const habits = await this.databaseService.habits.findMany({
      where: {
        title: {
          contains: searchTerm,
          mode: 'insensitive',
        },
        isPublic: true,
      },
      select: {
        title: true,
      },
      take: 5,
    });

    // Search users by username
    const users = await this.databaseService.users_sync.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      select: {
        name: true,
      },
      take: 5,
    });

    // Search activities by caption
    const activities = await this.databaseService.activities.findMany({
      where: {
        caption: {
          contains: searchTerm,
          mode: 'insensitive',
        },
        isPublic: true,
      },
      select: {
        caption: true,
      },
      take: 5,
    });

    // Flatten all results into a single string array
    const suggestions = [
      ...habits.map(h => h.title),
      ...users.map(u => u.name).filter(name => name !== null),
      ...activities.map(a => a.caption),
    ];

    return suggestions;
  };

  async search(searchText: string) {
    if (!searchText || searchText.trim().length === 0) {
      return { habits: [], users: [], activities: [] };
    }

    const searchTerm = searchText.toLowerCase();

    // Search public habits by title
    const habits = await this.databaseService.habits.findMany({
      where: {
        title: {
          contains: searchTerm,
          mode: 'insensitive',
        },
        isPublic: true,
      },
      include: {
        activities: {
          include: {
            likes: { select: { ownerId: true } },
            comments: { select: { id: true } }
          }
        },
      },
      take: 20,
    });

    // Add current streak property to each habit (consecutive days ending at last activity, alive if last activity is today or yesterday)
    const habitsWithStreak = habits.map(habit => {
      const PH_TZ = 'Asia/Manila';
      function getPHDateString(date: Date) {
        return format(toZonedTime(date, PH_TZ), 'yyyy-MM-dd', { timeZone: PH_TZ });
      }
      const activities = (habit.activities ?? []).map(activity => ({
        ...activity,
        likes: activity.likes ? activity.likes.map(like => like.ownerId) : [],
        comments: activity.comments ? activity.comments.length : 0
      }));
      const activityDates = Array.from(new Set(
        activities.map(a => {
          const date = typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt;
          return getPHDateString(date);
        })
      ));
      activityDates.sort();
      let streak = 0;
      if (activityDates.length > 0) {
        const now = new Date();
        const todayStr = getPHDateString(now);
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const yesterdayStr = getPHDateString(yesterday);
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
      return { ...habit, activities, streak };
    });

    // Search users by name
    const users = await this.databaseService.users_sync.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      take: 20,
    });

    // Search public activities by caption
    const rawActivities = await this.databaseService.activities.findMany({
      where: {
        caption: {
          contains: searchTerm,
          mode: 'insensitive',
        },
        isPublic: true,
      },
      include: {
        likes: { select: { ownerId: true } },
        comments: { select: { id: true } }
      },
      take: 20,
    });

    let activities = rawActivities.map(activity => {
      const { likes, comments, ...rest } = activity;
      return {
        ...rest,
        likes: Array.isArray(likes) ? likes.map(like => like.ownerId) : [],
        comments: Array.isArray(comments) ? comments.length : 0
      };
    });

    try {
      if (activities.length > 0 && typeof enrichWithUserData === 'function') {
        activities = await enrichWithUserData(activities);
        activities = activities.map(act => serializeModelDates([act])[0]);
      }
    } catch {
      // enrichment util not available, skip
    }

    return {
      habits: habitsWithStreak,
      users,
      activities,
    };
  }

}
