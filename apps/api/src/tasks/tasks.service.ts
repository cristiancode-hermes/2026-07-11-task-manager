import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity.js';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto.js';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async findAll(userId: number, status?: string): Promise<Task[]> {
    const where: any = { userId };
    if (status) where.status = status;
    return this.taskRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Task> {
    const task = await this.taskRepo.findOne({ where: { id, userId } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async create(dto: CreateTaskDto, userId: number): Promise<Task> {
    const task = this.taskRepo.create({
      title: dto.title,
      description: dto.description || undefined,
      priority: dto.priority || 'medium',
      status: dto.status || 'pending',
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      userId,
    });
    return this.taskRepo.save(task) as unknown as Task;
  }

  async update(id: number, dto: UpdateTaskDto, userId: number): Promise<Task> {
    const task = await this.findOne(id, userId);
    const updateData: any = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.priority !== undefined) updateData.priority = dto.priority;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.dueDate !== undefined) updateData.dueDate = new Date(dto.dueDate);
    if (dto.description === null) updateData.description = null;
    if (dto.dueDate === null) updateData.dueDate = null;

    await this.taskRepo.update(id, updateData);
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.taskRepo.remove(task);
  }
}
