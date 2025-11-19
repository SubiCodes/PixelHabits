import { Controller, Post, Query } from '@nestjs/common';
import { ContentsService } from './contents.service';

@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}
  
  @Post('userId')
  async getContents(@Query('userId') userId: string) {
    return this.contentsService.getRecommendedContent(userId);
  }
}
