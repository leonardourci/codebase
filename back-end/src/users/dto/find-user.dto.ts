import { User } from '../entities/user.entity';
import { OmitType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { CurrentUserDto } from '../../auth/dto/current-user.dto';

export class FindUserDto extends PickType(CurrentUserDto, ['id']) {}

export class FindUserResponseDto extends OmitType(CreateUserDto, ['password']) {
  createdAt: User['createdAt'];
  updatedAt: User['updatedAt'];
}
