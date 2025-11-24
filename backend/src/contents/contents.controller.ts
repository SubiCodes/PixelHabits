import { Body, Controller, Param, Post } from '@nestjs/common';
import { ContentsService } from './contents.service';

@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Post(':userId')
  async getRecommendedContent(
    @Param('userId') userId: string,
    @Body('activityIds') activityIds?: string[]
  ) {
    return this.contentsService.getRecommendedContent(userId, activityIds);
  }
}
