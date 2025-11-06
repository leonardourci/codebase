import { Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  CreateUserResponseDto,
} from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/users/users.service';
import { AppConfigService } from 'src/app-config/app-config.service';
import { JwtPayload } from './auth.interface';
import { User } from 'src/users/entities/user.entity';
import { INVALID_CREDENTIALS_ERROR } from 'src/common/errors';
import { AuthTokensDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async signUp(dto: CreateUserDto): Promise<CreateUserResponseDto> {
    const existingUser = await this.usersService.find({ email: dto.email });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const { password: _, ...user } = await this.usersService.create(dto);

    return user;
  }

  async signIn(payload: {
    email: string;
    password: string;
  }): Promise<AuthTokensDto> {
    const user = await this.usersService.find({ email: payload.email });

    if (!user) {
      throw new Error(INVALID_CREDENTIALS_ERROR);
    }

    const isPasswordCorrect = await bcrypt.compare(
      payload.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new Error(INVALID_CREDENTIALS_ERROR);
    }

    const tokens = await this.generateTokens({ user });
    await this.usersService.update({
      id: user.id,
      dto: { refreshToken: tokens.refreshToken },
    });

    return tokens;
  }

  async refreshToken(payload: {
    refreshToken: string;
  }): Promise<AuthTokensDto> {
    const token = this.jwtService.verify(payload.refreshToken, {
      secret: this.appConfigService.jwtSecret,
    });

    const user = await this.usersService.find({ id: token.sub });

    if (!user) {
      throw new Error(INVALID_CREDENTIALS_ERROR);
    }

    const doesRefreshTokenMatch = await bcrypt.compare(
      payload.refreshToken,
      user.refreshToken,
    );

    if (!doesRefreshTokenMatch) {
      throw new Error(INVALID_CREDENTIALS_ERROR);
    }

    const tokens = await this.generateTokens({ user });
    await this.usersService.update({
      id: user.id,
      dto: { refreshToken: tokens.refreshToken },
    });

    return tokens;
  }

  private async generateTokens(payload: {
    user: User;
  }): Promise<AuthTokensDto> {
    const refreshToken = this.jwtService.sign<JwtPayload>(
      {
        sub: payload.user.id,
        type: 'refresh',
        role: payload.user.role,
      },
      {
        secret: this.appConfigService.jwtSecret,
        expiresIn: '7d',
      },
    );

    return {
      accessToken: this.jwtService.sign<JwtPayload>(
        {
          sub: payload.user.id,
          type: 'access',
          role: payload.user.role,
        },
        {
          secret: this.appConfigService.jwtSecret,
          expiresIn: '15m',
        },
      ),
      refreshToken,
    };
  }
}
