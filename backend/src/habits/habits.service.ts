import { Injectable } from '@nestjs/common';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { DatabaseService } from 'src/database/database.service';
import { Habit } from 'generated/prisma/client';

@Injectable()
export class HabitsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createHabitDto: CreateHabitDto): Promise<Habit> {
    return this.databaseService.habit.create({
      data: createHabitDto,
    });
  }

  async findAll(ownerId: string, requestingUserId: string): Promise<any[]> {
    const isOwner = ownerId === requestingUserId;
    const habits = await this.databaseService.habit.findMany({
      where: { ownerId, ...(isOwner ? {} : { isPublic: true })},
      include: { activities: true }
    });

    // Add current streak property to each habit (consecutive days ending at last activity, alive if last activity is today or yesterday)
    return habits.map(habit => {
      const activityDates = Array.from(new Set(
        (habit.activities || []).map(a => new Date(a.createdAt).toISOString().slice(0, 10))
      ));
      activityDates.sort();
      let streak = 0;
      if (activityDates.length > 0) {
        streak = 1;
        for (let i = activityDates.length - 1; i > 0; i--) {
          const prev = new Date(activityDates[i - 1]);
          const curr = new Date(activityDates[i]);
          const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            streak++;
          } else {
            break;
          }
        }
        // Only reset streak if last activity is before yesterday
        const lastActivityDate = new Date(activityDates[activityDates.length - 1]);
        const today = new Date();
        today.setHours(0,0,0,0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const lastDateStr = lastActivityDate.toISOString().slice(0,10);
        const todayStr = today.toISOString().slice(0,10);
        const yesterdayStr = yesterday.toISOString().slice(0,10);
        if (lastDateStr !== todayStr && lastDateStr !== yesterdayStr) {
          streak = 0;
        }
      }
      return { ...habit, streak };
    });
  }

  async findOne(id: string): Promise<any | null> {
    const habit = await this.databaseService.habit.findUnique({
      where: { id },
      include: { activities: true }
    });
    if (!habit) return null;
    const activityDates = Array.from(new Set(
      (habit.activities || []).map(a => new Date(a.createdAt).toISOString().slice(0, 10))
    ));
    activityDates.sort();
    let streak = 0;
    if (activityDates.length > 0) {
      streak = 1;
      for (let i = activityDates.length - 1; i > 0; i--) {
        const prev = new Date(activityDates[i - 1]);
        const curr = new Date(activityDates[i]);
        const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          streak++;
        } else {
          break;
        }
      }
      // Only reset streak if last activity is before yesterday
      const lastActivityDate = new Date(activityDates[activityDates.length - 1]);
      const today = new Date();
      today.setHours(0,0,0,0);
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const lastDateStr = lastActivityDate.toISOString().slice(0,10);
      const todayStr = today.toISOString().slice(0,10);
      const yesterdayStr = yesterday.toISOString().slice(0,10);
      if (lastDateStr !== todayStr && lastDateStr !== yesterdayStr) {
        streak = 0;
      }
    }
    return { ...habit, streak };
  }

  async update(id: string, updateHabitDto: UpdateHabitDto): Promise<Habit> {
    return this.databaseService.habit.update({
      where: { id },
      data: updateHabitDto,
    });
  }

  async remove(id: string): Promise<Habit> {
    return this.databaseService.habit.delete({
      where: { id },
    });
  }
}
