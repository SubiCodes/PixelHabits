
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body() body: any,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    // Parse the activity JSON string from body.activity
    const activityData = typeof body.activity === 'string' ? JSON.parse(body.activity) : body.activity;
    const createActivityDto: CreateActivityDto = {
      ...activityData,
      mediaUrls: files,
    };
    return this.activitiesService.create(createActivityDto);
  }

  @Get()
  findAll(@Query('habitId') habitId: string, @Query('requestingUserId') requestingUserId: string) {
    return this.activitiesService.findAll(habitId, requestingUserId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const activity = await this.activitiesService.findOne(id);

    if (!activity) {
      throw new NotFoundException({
        error: 'ACTIVITY_NOT_FOUND',
        message: 'Activity not found',
        suggestion: 'That activity does not exist or may have been deleted',
      });
    }

    return activity;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.activitiesService.update(
      id,
      updateActivityDto,
      updateActivityDto.mediaUrlsToDelete,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.activitiesService.remove(id);
  }
}
