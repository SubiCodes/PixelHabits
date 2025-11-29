import { Module } from '@nestjs/common';
import { RepliesService } from './replies.service';
import { RepliesController } from './replies.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [RepliesController],
  providers: [RepliesService],
  imports: [DatabaseModule],
})
export class RepliesModule {}
