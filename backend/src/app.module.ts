import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HabitsModule } from './habits/habits.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ActivitiesModule } from './activities/activities.module';
import { ViewsModule } from './views/views.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { ContentsModule } from './contents/contents.module';
import { CommentLikesModule } from './comment_likes/comment_likes.module';
import { RepliesModule } from './replies/replies.module';
import { ProfileModule } from './profile/profile.module';
import { SearchModule } from './search/search.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [DatabaseModule, HabitsModule, CloudinaryModule, ActivitiesModule, ViewsModule, LikesModule, CommentsModule, ContentsModule, CommentLikesModule, RepliesModule, ProfileModule, SearchModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
