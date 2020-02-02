import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.header.authorization) {
      return false
    }

    request.user = this.validateToken(request.header.authorization)
    return true;
  }

  async validateToken(auth: string) {
    if( auth.split(' ')[0] !== "PoweredByArtz" ) {
      throw new HttpException(
        'Invalid token.',
        HttpStatus.FORBIDDEN
      )
    }

    const token = auth.split(' ')[1]
    
    try {
      const decoded = await jwt.verify(token, process.env.SECRET_KEY)
      return decoded
    }
    catch (err) {
      const message = `Token error: ${err.message || err.name}`
      throw new HttpException( message, HttpStatus.FORBIDDEN )
    }
 
  }
  
}