import { User } from 'src/users/entities/user.entity';

export interface JwtPayload {
  sub: User['id'];
  type: 'access' | 'refresh';
}
