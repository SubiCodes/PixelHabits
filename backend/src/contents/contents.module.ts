import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ContentsService } from './contents.service';
import { ContentsController } from './contents.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [ContentsController],
  providers: [ContentsService],
})
export class ContentsModule {}
