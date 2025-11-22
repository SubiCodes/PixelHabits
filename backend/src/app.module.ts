import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HabitsModule } from './habits/habits.module';

@Module({
  imports: [DatabaseModule, HabitsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
