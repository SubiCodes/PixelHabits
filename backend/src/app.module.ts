import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HabitsModule } from './habits/habits.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ActivitiesModule } from './activities/activities.module';
import { ViewsModule } from './views/views.module';

@Module({
  imports: [DatabaseModule, HabitsModule, CloudinaryModule, ActivitiesModule, ViewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
