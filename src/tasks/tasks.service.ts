import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository, Like } from 'typeorm';
import { Logger } from '@nestjs/common';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}
  private logger = new Logger(TasksService.name);

  async findAll(
    take: number,
    skip: number,
    keyword: string,
    sortField: string,
    sortOrder: 'ASC' | 'DESC',
  ): Promise<Task[]> {
    const where = keyword ? { content: Like(`%${keyword}%`) } : {};
    return this.tasksRepository.find({
      where,
      take,
      skip,
      order: {
        [sortField]: sortOrder,
      },
    });
  }

  async findOne(id: number): Promise<Task | null> {
    const task = this.tasksRepository.findOneBy({ id: id });
    return task || null;
  }

  async create(newTask: Task): Promise<Task> {
    const createdTask = await this.tasksRepository.create(newTask);
    return this.tasksRepository.save(createdTask);
  }

  async update(id: number, updatedTask: Task): Promise<Task | undefined> {
    const task = await this.tasksRepository.findOneBy({ id: id });
    if (!task) return undefined;

    await this.tasksRepository.update(id, updatedTask);
    return task;
  }

  async remove(id: number): Promise<void> {
    const task = await this.tasksRepository.findOneBy({ id: id });

    if (!task) {
      this.logger.warn(`Task with ID ${id} not found`);
      return;
    } else {
      await this.tasksRepository.delete(id);
      this.logger.log(`Task ${id} deleted successfully!`);
      return;
    }
  }
}
