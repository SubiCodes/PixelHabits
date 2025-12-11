import { Injectable } from '@nestjs/common';
import { CreateSearchDto } from './dto/create-search.dto';
import { DatabaseService } from 'src/database/database.service';

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
      take: 20,
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
    const activities = await this.databaseService.activities.findMany({
      where: {
        caption: {
          contains: searchTerm,
          mode: 'insensitive',
        },
        isPublic: true,
      },
      take: 20,
    });

    return {
      habits,
      users,
      activities,
    };
  }

}
