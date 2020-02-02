import { IsNotEmpty } from 'class-validator'

export class UpdatePasswordDTO {

  @IsNotEmpty()
  readonly oldPassword: string

  @IsNotEmpty()
  readonly newPassword: string

  @IsNotEmpty()
  readonly newPassword2: string
}