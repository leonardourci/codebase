import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AppConfigService } from 'src/app-config/app-config.service';
import { FindUserDto, FindUserResponseDto } from './dto/find-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly appConfigService: AppConfigService,
  ) {}

  async create(dto: CreateUserDto) {
    const user = this.repository.create(dto);

    user.password = await bcrypt.hash(
      dto.password,
      this.appConfigService.hashSalt,
    );

    return this.repository.save(user);
  }

  find(payload: Partial<Pick<User, 'email' | 'id'>>) {
    return this.repository.findOneBy(payload);
  }

  async findOne({
    id,
  }: {
    id: User['id'];
  }): Promise<FindUserResponseDto| null> {
    const user = await this.repository.findOneBy({ id });

    if (!user) {
      return null;
    }

    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async update({
    id,
    dto,
  }: {
    id: FindUserDto['id'];
    dto: UpdateUserDto;
  }): Promise<null | void> {
    const user = await this.repository.findOneBy({ id });

    if (dto.refreshToken != null) {
      dto.refreshToken = await bcrypt.hash(
        dto.refreshToken,
        this.appConfigService.hashSalt,
      );
    }

    if (!user) {
      return null;
    }

    this.repository.merge(user, dto);
    await this.repository.save(user);
  }

  async remove({ id }: { id: FindUserDto['id'] }): Promise<null | void> {
    const user = await this.repository.findOneBy({ id });

    if (!user) {
      return null;
    }

    await this.repository.remove(user);
  }
}
