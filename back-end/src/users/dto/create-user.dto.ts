import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLowercase: 4,
    minLength: 7,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}

export class CreateUserResponseDto extends OmitType(User, ['password']) {}
