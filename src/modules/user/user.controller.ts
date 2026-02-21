import {
  Get,
  Param,
  Controller,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('/:username')
  getUser(@Param('username') username: string) {
    return this.userService.findOne(Number(username));
  }

  @Post('/')
  createUser(@Body() body: createUserDto) {
    return this.userService.createUser(body);
  }

  @Patch('/:username')
  updateUser(
    @Param('username') username: string,
    @Body() body: { username: string; email: string; password: string },
  ) {
    return this.userService.update(Number(username), body);
  }

  @Delete('/:username')
  deleteUser(@Param('username') username: string) {
    return this.userService.remove(Number(username));
  }
}
