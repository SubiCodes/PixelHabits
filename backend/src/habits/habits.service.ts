/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Injectable } from '@nestjs/common';
import { toZonedTime, format } from 'date-fns-tz';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { DatabaseService } from 'src/database/database.service';
import { habits } from 'generated/prisma/client';

@Injectable()
export class HabitsService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createHabitDto: CreateHabitDto): Promise<habits> {
    return this.databaseService.habits.create({
      data: {
        ...createHabitDto,
        id: crypto.randomUUID(),
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    });
  }

  async findAll(ownerId: string, requestingUserId: string): Promise<any[]> {
    const isOwner = ownerId === requestingUserId;
    const habits = await this.databaseService.habits.findMany({
      where: { ownerId, ...(isOwner ? {} : { isPublic: true }) },
      include: { activities: true }
    });

    // Add current streak property to each habit (consecutive days ending at last activity, alive if last activity is today or yesterday)
    return habits.map(habit => {
      const PH_TZ = 'Asia/Manila';
      function getPHDateString(date: Date) {
        return format(toZonedTime(date, PH_TZ), 'yyyy-MM-dd', { timeZone: PH_TZ });
      }
      const activities = (habit.activities ?? []) as Array<{ createdAt: Date | string }>;
      const activityDates = Array.from(new Set(
        activities.map(a => {
          const date = typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt;
          return getPHDateString(date);
        })
      ));
      activityDates.sort();
      let streak = 0;
      if (activityDates.length > 0) {
        const now = new Date();
        const todayStr = getPHDateString(now);
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const yesterdayStr = getPHDateString(yesterday);
        const lastActivityDateStr = activityDates[activityDates.length - 1];
        const lastDateStr = lastActivityDateStr;
        if (lastDateStr === todayStr || lastDateStr === yesterdayStr) {
          streak = 1;
          for (let i = activityDates.length - 1; i > 0; i--) {
            const prevStr = activityDates[i - 1];
            const currStr = activityDates[i];
            // Parse as local midnight
            const prevDate = new Date(prevStr + 'T00:00:00');
            const currDate = new Date(currStr + 'T00:00:00');
            const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
              streak++;
            } else {
              break;
            }
          }
        }
      }
      return { ...habit, streak };
    });
  }

  async findOne(id: string): Promise<any | null> {
    const habit = await this.databaseService.habits.findUnique({
      where: { id },
      include: { activities: true }
    });
    if (!habit) return null;
    const PH_TZ = 'Asia/Manila';
    function getPHDateString(date: Date) {
      return format(toZonedTime(date, PH_TZ), 'yyyy-MM-dd', { timeZone: PH_TZ });
    }
    const activities = (habit.activities ?? []) as Array<{ createdAt: Date | string }>;
    const activityDates = Array.from(new Set(
      activities.map(a => {
        const date = typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt;
        return getPHDateString(date);
      })
    ));
    activityDates.sort();
    let streak = 0;
    if (activityDates.length > 0) {
      const now = new Date();
      const todayStr = getPHDateString(now);
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const yesterdayStr = getPHDateString(yesterday);
      const lastActivityDateStr = activityDates[activityDates.length - 1];
      const lastDateStr = lastActivityDateStr;
      if (lastDateStr === todayStr || lastDateStr === yesterdayStr) {
        streak = 1;
        for (let i = activityDates.length - 1; i > 0; i--) {
          const prevStr = activityDates[i - 1];
          const currStr = activityDates[i];
          // Parse as local midnight
          const prevDate = new Date(prevStr + 'T00:00:00');
          const currDate = new Date(currStr + 'T00:00:00');
          const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            streak++;
          } else {
            break;
          }
        }
      }
    }
    return { ...habit, streak };
  }

  async update(id: string, updateHabitDto: UpdateHabitDto): Promise<habits> {
    return this.databaseService.habits.update({
      where: { id },
      data: updateHabitDto,
      include: { activities: true }
    });
  }

  async remove(id: string): Promise<habits> {
    return this.databaseService.habits.delete({
      where: { id },
    });
  }
}
