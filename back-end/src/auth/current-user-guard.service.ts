import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CurrentUserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const paramUserId = request.params?.id;

    if (user && paramUserId && user.id === paramUserId) {
      return true;
    }

    throw new UnauthorizedException('Unauthorized');
  }
}
