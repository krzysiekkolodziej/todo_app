import {
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Controller,
  NotFoundException,
  Query,
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  private logger = new Logger(TasksController.name);

  @Get()
  async findAll(@Query() query): Promise<Task[]> {
    const take = query.take || undefined; // No default limit
    const page = query.page || 1;
    const skip = page && take ? (page - 1) * take : undefined;
    const keyword = query.keyword || '';

    // Use query.sortField and query.sortOrder for sorting
    const sortField = query.sortField || 'id';
    const sortOrder = query.sortOrder || 'ASC';

    this.logger.verbose(
      `Fetching tasks with parameters: take=${take}, skip=${skip}, keyword=${keyword}, sortField=${sortField}, sortOrder=${sortOrder}`,
    );

    const tasks = await this.tasksService.findAll(
      take,
      skip,
      keyword,
      sortField,
      sortOrder,
    );
    this.logger.log(`Fetched ${tasks.length} tasks successfully.`);
    return tasks;
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Task> {
    this.logger.verbose(`Fetching task with ID ${id}...`);
    const task = await this.tasksService.findOne(id);
    if (!task) {
      this.logger.warn(`Task with ID ${id} not found`);
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    this.logger.log(`Fetched task with ID ${id} successfully.`);
    return task;
  }

  @Post()
  async create(@Body() newTask: Task): Promise<Task> {
    this.logger.verbose('Creating a new task...');
    const createdTask = await this.tasksService.create(newTask);
    this.logger.log(`Created new task with ID ${createdTask.id}.`);
    return createdTask;
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatedTask: Task,
  ): Promise<Task> {
    this.logger.verbose(`Updating task with ID ${id}...`);
    const task = await this.tasksService.update(id, updatedTask);
    if (!task) {
      this.logger.warn(`Task with ID ${id} not found`);
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    this.logger.log(`Updated task with ID ${id} successfully.`);

    return task;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    this.logger.verbose(`Deleting task with ID ${id}...`);
    await this.tasksService.remove(id);
    return;
  }
}
