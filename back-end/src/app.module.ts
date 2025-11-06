import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AppConfigModule } from './app-config/app-config.module';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [AppConfigModule, UsersModule, AuthModule],
  controllers: [AuthController],
  exports: [JwtStrategy],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
