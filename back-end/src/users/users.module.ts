import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { CurrentUserGuard } from '../auth/current-user-guard.service';

@Module({
  imports: [AppConfigModule, TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, CurrentUserGuard],
  exports: [UsersService],
})
export class UsersModule {}
