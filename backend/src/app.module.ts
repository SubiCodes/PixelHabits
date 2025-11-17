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

@Module({
  imports: [DatabaseModule, HabitsModule, CloudinaryModule, ActivitiesModule, ViewsModule, LikesModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
