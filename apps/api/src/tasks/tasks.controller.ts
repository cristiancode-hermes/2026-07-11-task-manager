import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UseGuards, Request, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'in_progress', 'completed'] })
  async findAll(@Request() req: any, @Query('status') status?: string) {
    return this.tasksService.findAll(req.user.id, status);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.tasksService.findOne(id, req.user.id);
  }

  @Post()
  async create(@Body() dto: CreateTaskDto, @Request() req: any) {
    return this.tasksService.create(dto, req.user.id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @Request() req: any,
  ) {
    return this.tasksService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    await this.tasksService.remove(id, req.user.id);
    return { message: 'Task deleted successfully' };
  }
}
