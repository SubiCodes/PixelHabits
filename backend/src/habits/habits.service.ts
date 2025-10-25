import { Injectable } from '@nestjs/common';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { DatabaseService } from 'src/database/database.service';
import { Habit } from 'generated/prisma/client';

@Injectable()
export class HabitsService {
  constructor(private readonly databaseService: DatabaseService) {}

  private async findHabitById(id: string): Promise<Habit | null> {
    return this.databaseService.habit.findUnique({
      where: { id },
    });
  }

  async create(createHabitDto: CreateHabitDto): Promise<Habit> {
    return this.databaseService.habit.create({
      data: createHabitDto,
    });
  }

  async findAll(ownerId: string): Promise<Habit[]> {
    return this.databaseService.habit.findMany({
      where: { ownerId },
    });
  }

  async findOne(id: string): Promise<Habit | null> {
    return this.findHabitById(id);
  }

  async update(id: string, updateHabitDto: UpdateHabitDto): Promise<Habit | null> {
    const habit = await this.findHabitById(id);
    
    if (!habit) {
      return null;
    }
    
    return this.databaseService.habit.update({
      where: { id },
      data: updateHabitDto,
    });
  }

  async remove(id: string): Promise<Habit | null> {
    const habit = await this.findHabitById(id);
    
    if (!habit) {
      return null;
    }
    
    return this.databaseService.habit.delete({
      where: { id },
    });
  }
}
