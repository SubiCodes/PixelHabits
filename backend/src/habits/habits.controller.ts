import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) { }

  @Post()
  async create(@Body() createHabitDto: CreateHabitDto) {
    return this.habitsService.create(createHabitDto);
  }

  @Get()
  async findAll(@Query('ownerId') ownerId: string, @Query('requestingUserId') requestingUserId: string) {
    return this.habitsService.findAll(ownerId, requestingUserId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const habit = await this.habitsService.findOne(id);

    if (!habit) {
      throw new NotFoundException({
        error: 'HABIT_NOT_FOUND',
        message: 'Habit not found',
        suggestion: 'That habit does not exist or may have been deleted',
      });
    }

    return habit;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateHabitDto: UpdateHabitDto) {
    return this.habitsService.update(id, updateHabitDto);
    // If not found, Prisma throws P2025 → PrismaExceptionFilter handles it
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.habitsService.remove(id);
    // If not found, Prisma throws P2025 → PrismaExceptionFilter handles it
  }
}
