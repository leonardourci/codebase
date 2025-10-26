import Joi from 'joi';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface Env {
  NODE_ENV: 'development' | 'production' | 'test';
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  JWT_SECRET: string;
  HASH_SALT: number;
}

export const envSchema: Joi.ObjectSchema<Env> = Joi.object({
  NODE_ENV: Joi.string()
    .lowercase()
    .valid('development', 'production', 'test')
    .required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().raw().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow().empty().required(),
  DB_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  HASH_SALT: Joi.number().required(),
});

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  get hashSalt(): number {
    return this.configService.get<number>('HASH_SALT');
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV');
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  get dbHost(): string {
    return this.configService.get<string>('DB_HOST');
  }

  get dbPort(): number {
    return this.configService.get<number>('DB_PORT');
  }

  get dbUsername(): string {
    return this.configService.get<string>('DB_USERNAME');
  }

  get dbPassword(): string {
    return this.configService.get<string>('DB_PASSWORD');
  }

  get dbName(): string {
    return this.configService.get<string>('DB_NAME');
  }
}
