import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  CreateUserResponseDto,
} from 'src/users/dto/create-user.dto';
import { AuthTokensDto, RefreshTokenDto, SignInDto } from './dto/auth.dto';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({ security: [] })
  signUp(@Body() body: CreateUserDto): Promise<CreateUserResponseDto> {
    try {
      return this.authService.signUp(body);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('sign-in')
  @ApiOperation({ security: [] })
  signIn(@Body() body: SignInDto): Promise<AuthTokensDto> {
    try {
      return this.authService.signIn({
        email: body.email,
        password: body.password,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  refreshToken(@Body() body: RefreshTokenDto): Promise<AuthTokensDto> {
    console.log({ body });
    try {
      return this.authService.refreshToken({ refreshToken: body.refreshToken });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
