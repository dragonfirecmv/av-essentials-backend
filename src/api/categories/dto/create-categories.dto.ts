import { IsString, IsNotEmpty } from "class-validator";


export class CreateCategoryDTO {
  
  @IsString()
  @IsNotEmpty()
  readonly name: string

  @IsNotEmpty()
  @IsString()
  readonly slug: string

  @IsString()
  readonly parentId: string
  
}