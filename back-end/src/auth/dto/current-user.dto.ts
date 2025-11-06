import { User } from 'src/users/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Validate } from 'class-validator';
import { UserIdPrefixValidator } from '../../common/users.validator';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export class CurrentUserDto {
  /**
   * User id with prefix 'user_'
   * @example user_XYZ123abc
   */
  @Validate(UserIdPrefixValidator)
  id: User['id'];

  role?: User['role'];
}
