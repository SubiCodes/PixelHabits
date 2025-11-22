import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HabitsModule } from './habits/habits.module';
import { ActivitiesModule } from './activities/activities.module';

@Module({
  imports: [DatabaseModule, HabitsModule, ActivitiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
