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

    const addedSearch = await this.databaseService.users_sync.update({
      where: { id: createSearchDto.userId },
      data: {
        searches: updatedSearches,
      },
    });
    return addedSearch;
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

  async getSuggestions(searchText: string) {
    if (!searchText || searchText.trim().length === 0) {
      return { habits: [], users: [], activities: [] };
    }

    const searchTerm = searchText.toLowerCase();

    // Search habits by title
    const habits = await this.databaseService.habits.findMany({
      where: {
        title: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
      },
      take: 5,
    });

    // Search users by username
    const usersRaw = await this.databaseService.users_sync.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        rawJson: true,
      },
      take: 5,
    });

    // Parse rawJson to extract profile_image_url
    const users = usersRaw.map(user => {
      const rawJson = typeof user.rawJson === 'string' 
        ? JSON.parse(user.rawJson) 
        : user.rawJson;
      return {
        id: user.id,
        name: user.name,
        profile_image_url: rawJson.profile_image_url || null,
      };
    });

    // Search activities by caption
    const activities = await this.databaseService.activities.findMany({
      where: {
        caption: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        caption: true,
      },
      take: 5,
    });

    return {
      habits,
      users,
      activities,
    };
  }
}
