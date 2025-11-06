import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindUserDto, FindUserResponseDto } from './dto/find-user.dto';
import { USER_NOT_FOUND_ERROR } from '../common/errors';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param() param: FindUserDto): Promise<FindUserResponseDto> {
    const user = await this.usersService.findOne({ id: param.id });

    if (user === null) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }

    return user;
  }

  @Patch(':id')
  @HttpCode(204)
  async update(
    @Param() dto: FindUserDto,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    const updatedUser = await this.usersService.update({
      id: dto.id,
      dto: updateUserDto,
    });

    if (updatedUser === null) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param() dto: FindUserDto): Promise<void> {
    const deletedUser = await this.usersService.remove({ id: dto.id });

    if (deletedUser === null) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }
  }
}
