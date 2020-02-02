import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { UsersService } from '../api/users/users.service';
import { IUserModel } from '../api/users/interface/user-model.interface';
import { LoginUserDTO } from './dto/login-user.dto';
import { UserEntity } from '../api/users/users.entity';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService
  ) {}

  async signWithJWT(payload: Partial<IUserModel>) {
    console.log('signing jwt...', payload)
    return jwt.sign({
      ...payload
    },
    process.env.SECRET_KEY,
    {
      expiresIn: '24h'
    })
  }


  async loginUser(payload: LoginUserDTO): Promise<Partial<IUserModel>> {

    console.log('logging in...', payload)

    const { email, password } = payload
    const user = await this.usersService.getUserByEmail(email)

    if (!user || !(await this.usersService.compareHash(password, user.password_hash))) {
      throw new HttpException(
        'Invalid username/password!',
        HttpStatus.FORBIDDEN
      )
    }

    console.log('ok user exists:', user)

    const { id, givenname, verified, staff, admin  } = user
    const token = await this.signWithJWT({
      id, givenname, email, verified, staff, admin
    })

    console.log('token received:', token)

    return { 
      token,
      id,
      email,
      givenname,
      verified, 
      staff, 
      admin
    }
  }


  async validateUser(user: UserEntity): Promise<Boolean> {
    console.log('validating user existence...', user)
    if (user && user.email) 
      return Boolean(this.usersService.getUserByEmail(user.email))
    else
      return false
  }

}
