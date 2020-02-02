
import * as bcrypt from 'bcryptjs'

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { Repository } from 'typeorm';
import { IUserModel } from './interface/user-model.interface';
import { LoginUserDTO } from '../../auth/dto/login-user.dto';
import { CreateUserDTO } from '../../auth/dto/create-user.dto';
import { UpdateUserDTO } from 'src/auth/dto/update-user.dto';
import { UpdatePasswordDTO } from 'src/auth/dto/update-password.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) { }


  async showAll(): Promise<Partial<IUserModel>[]> {
    const listUsers = await this.userRepository.find()
    return listUsers.map((user: UserEntity) => user.toLiteResponseObject())
  }


  async listAllDetailed(user: UserEntity): Promise<Partial<IUserModel>[]> {
    const listUsers = await this.userRepository.find()

    const findUserByCredential = await this.userRepository.findOneOrFail({
      where: { id: user.id }
    })

    console.log({ findUserByCredential })
    if (!findUserByCredential.staff) throw new HttpException('Unauthorized!', HttpStatus.UNAUTHORIZED)

    return listUsers.map((user: UserEntity) => user.toFullResponseObject())
  }


  /**
   * Check whether the user exists by its id.
   * 
   * Returns the UserEntity Model.
   * 
   * @param id The associated's id
   */
  async getUserById(id: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { id } })
  }


  /**
   * Check whether the user exists by its email.
   * 
   * Returns the UserEntity Model.
   * 
   * @param email The associated's email.
   */
  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { email } })
  }


  /**
   * Register user to the database.
   * 
   * Returns JSON { id, email, verified, givenname } to the sender if succeed.
   * 
   * @param newUserPayload Contains JSON { email, givenname, password }.
   */
  async createUser(newUserPayload: CreateUserDTO): Promise<Partial<IUserModel>> {
    console.log(newUserPayload)
    const { email, givenname, password } = newUserPayload

    // check if user already exists
    let user = await this.userRepository.findOne({ where: { email } })

    // User already exists in the database, throw error.
    if (user) {
      throw new HttpException(
        'User already exists.',
        HttpStatus.BAD_REQUEST
      )
    }

    // Hash your password
    const hashedPassword: string = await this.hashPassword(password, process.env.AUTH_SALT)

    // User hasn't existed yet, creating...
    user = await this.userRepository.create({
      email,
      givenname,
      password_hash: hashedPassword,
      verified: false,
      staff: false,
      admin: false
    })

    console.log("packet", user)

    // Saving to database...
    await this.userRepository.save(user)
    return user.toEssentialResponseObject()
  }


  async updateUser(id: string, updateUserPayload: Partial<UpdateUserDTO>, adminMode: boolean, authUser?: UserEntity) {

    if (adminMode && !authUser.staff)
      throw new HttpException(
        'Unauthorized admin access!',
        HttpStatus.UNAUTHORIZED
      )

    let user = await this.checkIfUserExistsBy('id', id, 'no-user')

    await this.userRepository.update({ id }, updateUserPayload)

    user = await this.userRepository.findOne({ where: { id } })

    return user.toFullResponseObject()

  }



  async updateUserPassword(id: string, passwordPayload: UpdatePasswordDTO, adminMode: boolean, authUser?: UserEntity) {
    const { oldPassword, newPassword, newPassword2 } = passwordPayload

    if (adminMode && !authUser.staff)
      throw new HttpException(
        'Unauthorized admin access!',
        HttpStatus.UNAUTHORIZED
      )

    let user = await this.checkIfUserExistsBy('id', id, 'no-user')

    // Hash your password
    const hashedOldPassword: string = await this.hashPassword(oldPassword, process.env.AUTH_SALT)
    if (user.password_hash !== hashedOldPassword)
      throw new HttpException(
        'Wrong password entered!',
        HttpStatus.UNAUTHORIZED
      )

    if (newPassword !== newPassword2)
      throw new HttpException(
        "New passsword doesn't match!",
        HttpStatus.BAD_REQUEST
      )

    // Hash your new password
    const hashNewPassword: string = await this.hashPassword(newPassword, process.env.AUTH_SALT)

    await this.userRepository.update({ id }, { password_hash: hashNewPassword })

    user = await this.userRepository.findOne({ where: { id } })

    return user.toFullResponseObject()

  }


  async checkIfUserExistsBy(type: 'email' | 'id', value, throwErrWhen: 'user-exists' | 'no-user') {

    const byWhat = type === 'email' ? { email: value } : { id: value }
    let user = await this.userRepository.findOne({ where: { ...byWhat } })

    if (throwErrWhen === 'user-exists' && user)
      throw new HttpException(
        "User already exists.",
        HttpStatus.BAD_REQUEST
      )

    else if (throwErrWhen === 'no-user' && !user)
      throw new HttpException(
        "User doesn't exists.",
        HttpStatus.BAD_REQUEST
      )

    return user
  }


  // async updateUser(id: string, payload: )

  /**
   * Saving password in plain text is dangerous. 
   * We'll hash it for you using your secret SALT.
   * 
   * @param password Your naked password.
   * @param hash Make your password SALTY.
   */
  async hashPassword(password: string, hash: string): Promise<string | undefined> {
    return await bcrypt.hash(password, hash)
  }

  /**
   * Vigorously try to compare whether the typed password
   * matched with the registered password.
   * 
   * @param attempt This is your attempted password. 
   * @param hashedPassword This is the registered password.
   */
  async compareHash(attempt: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(attempt, hashedPassword)
  }

  /**
   * Return the user data without the hashed password value.
   * 
   * @param user The user to be sanitized.
   */
  sanitizeUser(user: UserEntity): Partial<IUserModel> {
    const sanitized = user;
    if (sanitized.password_hash) delete sanitized['password_hash']
    return sanitized
  }
}
