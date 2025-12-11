import { Controller, Post, Body, Param, Delete, Get } from '@nestjs/common';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  create(@Body() createSearchDto: CreateSearchDto) {
    return this.searchService.create(createSearchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Body('searchTerm') searchTerm: string) {
    return this.searchService.remove(id, searchTerm);
  }

  @Get(':id')
  getRecentSearches(@Param('id') id: string) {
    return this.searchService.getRecentSearches(id);
  }

  @Get('suggestions/:searchText')
  getSuggestions(@Param('searchText') searchText: string) {
    return this.searchService.getSuggestions(searchText);
  }
}
