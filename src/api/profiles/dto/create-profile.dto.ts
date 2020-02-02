import { IsNotEmpty, IsString, IsUrl } from "class-validator";
// import { UserEntity } from "~/src/api/users/users.entity";


export class CreateProfileDTO {

  @IsUrl()
  readonly display_picture_url: string

  @IsString()
  readonly about_me: string

  @IsString()
  readonly location: string

  @IsString()
  readonly website: string
}