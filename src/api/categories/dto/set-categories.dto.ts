import { IsNotEmpty } from "class-validator";


export class SetCategory {

  @IsNotEmpty()
  id: string
  
}