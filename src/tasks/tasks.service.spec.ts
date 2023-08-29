import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task, TaskStatus } from './task.entity';

describe('TasksService', () => {
  let tasksService: TasksService;
  let repository: Repository<Task>;

  beforeEach(async () => {
    // Create a testing module to test the TasksService
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
      ],
    }).compile();

    // Get an instance of the TasksService and the mocked repository
    tasksService = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    // The tasksService should be defined after creating the testing module
    expect(tasksService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      // Arrange
      const expectedTasks = [
        { id: 1, content: 'Task 1', status: TaskStatus.OPEN },
        { id: 2, content: 'Task 2', status: TaskStatus.IN_PROGRESS },
        { id: 3, content: 'Task 3', status: TaskStatus.DONE },
      ];

      // Mock the find method of the repository to return expectedTasks
      jest.spyOn(repository, 'find').mockResolvedValue(expectedTasks);

      // Act: Call the tasksService's findAll method
      const tasks = await tasksService.findAll(10, 0, '', 'id', 'ASC');

      // Assert: Ensure the returned tasks match the expectedTasks
      expect(tasks).toEqual(expectedTasks);
    });
  });
});
