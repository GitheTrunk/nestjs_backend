import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  getAllTasks() {
    return this.taskService.findAll();
  }

  @Get('/:id')
  getTask(@Param('id') id: string) {
    return this.taskService.getTask(Number(id));
  }
  @Post('/')
  createTask(@Body() body: any) {
    return this.taskService.createTask({ ...body, createdAt: new Date() });
  }

  @Patch('/:id/done')
  markTaskAsDone(@Param('id') id: string) {
    return this.taskService.update(Number(id), { completedAt: new Date() });
  }

  @Patch('/:id/pending')
  markTaskAsPending(@Param('id') id: string) {
    return this.taskService.update(Number(id), { completedAt: undefined });
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(Number(id));
  }
}