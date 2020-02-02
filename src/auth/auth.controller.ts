import { Controller, Get, Post, UsePipes, Body, HttpStatus, HttpCode, UseGuards, Put, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../api/users/users.service';
import { IUserModel } from '../api/users/interface/user-model.interface';
import { ValidationPipe } from '../shared/validation.pipe';
import { LoginUserDTO } from './dto/login-user.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../api/users/decorator/users.decorator';
import { UserEntity } from '../api/users/users.entity';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdatePasswordDTO } from './dto/update-password.dto';

@Controller()
export class AuthController {

  constructor( 
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}
 
  /**
   * List every registered users
   */
  @Get('api/users')
  showAllUsers() {
    return this.usersService.showAll()
  }
 
  /**
   * List every registered users
   */
  @Get('api/users-details')
  @UseGuards(AuthGuard('jwt'))
  listAllUsersDetailed(
    @User()
      user: UserEntity) {
    return this.usersService.listAllDetailed(user)
  }

  /**
   * Main login endpoint
   * @param data JSON { email, password }
   */
  @Post('auth/login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async LoginUserDTO(@Body() payload: LoginUserDTO) {
    const loggingIn = await this.authService.loginUser(payload)
    return loggingIn
  }

  /**
   * Update endpoint
   * @param data JSON { email, givenname, password }
   */
  @Put('auth/me/update')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  updateSelf(
    @User('id') userId: string,
    @Body() payload: Partial<UpdateUserDTO>
  ) {
    return this.usersService.updateUser(userId, payload, false)
  }

  /**
   * Update someone's endpoint
   * @param data JSON { email, givenname, password }
   */
  @Put('auth/:id/update')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  updateSomeone(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Body() payload: Partial<UpdateUserDTO>
  ) {
    return this.usersService.updateUser(id, payload, true, user)
  }


  /**
   * Update password endpoint
   * @param data JSON { email, givenname, password }
   */
  @Put('auth/me/update-password')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  updatePassword(
    @User('id') userId: string,
    @Body() passwordPayload: UpdatePasswordDTO
  ) {
    return this.usersService.updateUserPassword(userId, passwordPayload, false)
  }


  /**
   * Update someone's password endpoint
   * @param data JSON { email, givenname, password }
   */
  @Put('auth/:id/update-password')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  updateSomeonesPassword(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Body() passwordPayload: UpdatePasswordDTO
  ) {
    return this.usersService.updateUserPassword(id, passwordPayload, true, user)
  }

  /**
   * Register endpoint
   * @param data JSON { email, givenname, password }
   */
  @Post('auth/register')
  @UsePipes(new ValidationPipe())
  register(@Body() payload: CreateUserDTO) {
    return this.usersService.createUser(payload)
  }
}
