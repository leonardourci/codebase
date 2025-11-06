import { IsString } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class SignInDto extends PickType(CreateUserDto, ['email']) {
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

export class AuthTokensDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
