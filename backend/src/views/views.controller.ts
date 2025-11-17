import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ViewsService } from './views.service';
import { CreateViewDto } from './dto/create-view.dto';

@Controller('views')
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) {}

  @Post()
  create(@Body() createViewDto: CreateViewDto) {
    return this.viewsService.create(createViewDto);
  }

  @Get()
  findAll(userId: string) {
    return this.viewsService.findAll(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.viewsService.remove(id);
  }
}
