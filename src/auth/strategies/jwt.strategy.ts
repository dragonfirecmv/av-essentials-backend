import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY
    });

    console.log('entering verification')
  }

  async validate(payload: any) {
    console.log('verifying user....', payload)
    const user = await this.authService.validateUser(payload)

    if (!user) {
      throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED)
    }

    console.log('user found!', user)

    // const doneyet = 
    // console.log('doneyet', typeof doneyet, doneyet)

    return { ...payload }
  }
}
