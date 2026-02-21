import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TaskModule } from './modules/task/task.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity';
import { Task } from './modules/task/task.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'todo.sqlite',
    entities: [User, Task],
    synchronize: true,
  }),
  UserModule,
  TaskModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
