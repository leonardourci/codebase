import { Module } from '@nestjs/common';
import { AppConfigService, envSchema } from './app-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (raw: Record<string, any>) => {
        const { value, error } = envSchema.validate(raw, {
          stripUnknown: true,
          abortEarly: false,
        });

        if (error) {
          const msg = error.details
            .map(
              (detail: Joi.ValidationErrorItem) =>
                `${detail.path.join('.')}: ${detail.message}`,
            )
            .join(', ');
          throw new Error(`Environment variables validation error: ${msg}`);
        }

        return value;
      },
    }),

    /**
     * Use this configuration for a local development database
     * Make sure to uninstall sqlite3 if switching to postgres or another database
     */
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [join(__dirname, '..', '**/*.entity{.ts,.js}')],

      // Use synchronize: true only in development environment for automatic schema sync
      // In production, use migrations to manage database schema changeu
      synchronize: true,
    }),

    /**
     * Use this configuration for a production database
     * Make sure to set the environment variables in .env file
     */
    // TypeOrmModule.forRootAsync({
    //   inject: [AppConfig],
    //   useFactory: (config: AppConfig) => ({
    //     type: 'postgres', // or database of your choice
    //     host: config.dbHost,
    //     port: config.dbPort,
    //     username: config.dbUsername,
    //     password: config.dbPassword,
    //     database: config.dbName,
    //     entities: [join(__dirname, '..', '**/*.entity{.ts,.js}')],
    //   }),
    // })
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
