import { IsNotEmpty, IsEmail } from 'class-validator'

export class UpdateUserDTO {

  @IsEmail()
  readonly email: string

  readonly givenname: string

}