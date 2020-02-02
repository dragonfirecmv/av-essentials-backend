import { IsNotEmpty, IsEmail } from 'class-validator'

export class CreateUserDTO {

  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @IsNotEmpty()
  readonly givenname: string
  
  @IsNotEmpty()
  readonly password: string
}