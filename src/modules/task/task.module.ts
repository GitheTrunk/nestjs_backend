import { Module } from '@nestjs/common';
import { TasksController } from './task.controller';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [TaskService],
  exports: [TypeOrmModule],
  // Add any other necessary configurations or modules
})
export class TaskModule {}
