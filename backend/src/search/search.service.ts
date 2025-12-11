import { Injectable } from '@nestjs/common';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SearchService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createSearchDto: CreateSearchDto) {
    const user = await this.databaseService.users_sync.findUnique({
      where: { id: createSearchDto.userId },
      select: { searches: true },
    });

    const addedSearch = await this.databaseService.users_sync.update({
      where: { id: createSearchDto.userId },
      data: {
        searches: [...(user?.searches || []), ...createSearchDto.searches],
      },
    });
    return addedSearch;
  }

  findAll() {
    return `This action returns all search`;
  }

  findOne(id: number) {
    return `This action returns a #${id} search`;
  }

  update(id: number, updateSearchDto: UpdateSearchDto) {
    return `This action updates a #${id} search`;
  }

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
  }
}
