import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private tasksRepo: Repository<Task>,
  ) {}

  createTask(taskData: Partial<Task>) {
    const task = this.tasksRepo.create(taskData);
    return this.tasksRepo.save(task);
  }

  findAll() {
    return this.tasksRepo.find({ relations: ['user'] });
  }

  getTask(id: number) {
    return this.tasksRepo.findOne({ where: { id }, relations: ['user'] });
  }

  async update(id: number, updateData: Partial<Task>) {
    await this.tasksRepo.update(id, updateData);
    return this.getTask(id);
  }

  deleteTask(id: number) {
    return this.tasksRepo.delete(id);
  }
}
