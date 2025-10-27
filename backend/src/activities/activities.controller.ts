import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('media', 5))
  create(@Body() createActivityDto: CreateActivityDto, @UploadedFiles() files?: Express.Multer.File[]) {
    return this.activitiesService.create(createActivityDto, files);
  }

  @Get()
  findAll(@Query('habitId') habitId: string) {
    return this.activitiesService.findAll(habitId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto) {
    return this.activitiesService.update(id, updateActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activitiesService.remove(id);
  }
}
