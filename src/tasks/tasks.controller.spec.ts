import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task, TaskStatus } from './task.entity';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService: TasksService;

  beforeEach(async () => {
    // Create a testing module to test the TasksController
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
      ],
    }).compile();

    // Get an instance of the TasksController and the mocked repository
    tasksController = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  describe('create', () => {
    it('should create and return a task', async () => {
      // Arrange
      const task = {
        id: 1,
        content: 'New Task',
        status: TaskStatus.OPEN,
      };

      jest.spyOn(tasksService, 'create').mockResolvedValue(task);

      // Act
      const result = await tasksController.create(task);

      // Assert
      expect(result).toEqual(task);
      expect(tasksService.create).toHaveBeenCalledWith(task);
    });
  });
});
