import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HabitsModule } from './habits/habits.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ActivitiesModule } from './activities/activities.module';

@Module({
  imports: [DatabaseModule, HabitsModule, CloudinaryModule, ActivitiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
