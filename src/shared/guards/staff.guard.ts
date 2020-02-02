
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class StaffOnlyGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.staff) {
      return true;
    }

    throw new HttpException("Only staff(s) can access this API.", HttpStatus.UNAUTHORIZED);
  }
}