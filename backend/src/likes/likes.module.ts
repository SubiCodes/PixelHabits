import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [DatabaseService],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
