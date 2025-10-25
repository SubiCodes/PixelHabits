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

  findAll() {
    return `This action returns all habits`;
  }

  findOne(id: number) {
    return `This action returns a #${id} habit`;
  }

  update(id: number, updateHabitDto: UpdateHabitDto) {
    return `This action updates a #${id} habit`;
  }

  remove(id: number) {
    return `This action removes a #${id} habit`;
  }
}
