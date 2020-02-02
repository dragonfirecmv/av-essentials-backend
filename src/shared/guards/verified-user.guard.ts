
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class VerifiedUserGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.verified) {
      return true;
    }

    throw new HttpException("You're not verified!", HttpStatus.UNAUTHORIZED);
  }
}