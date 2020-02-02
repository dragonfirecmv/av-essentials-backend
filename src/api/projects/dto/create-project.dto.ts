import { ICategory, IUser, IFunding, IPayment, IBenefit, ISponsor, IPost, IMessage } from '../interfaces/projects.interface'
import { IsString, IsJSON } from 'class-validator';
import { isObject } from 'util';
import { CategoryEntity } from '../../categories/categories.entity';
import { IMedia } from '../../../shared/interfaces/media.interface';

export class CreateProjectDTO {

  @IsString() readonly title: string

  @IsJSON() readonly category: CategoryEntity
  @IsJSON() readonly creator: IUser

  @IsString() readonly content: string
  readonly media: IMedia[]

  @IsString() readonly location: string
  @IsString() readonly locale: string

  @IsJSON() readonly funding: IFunding
  @IsJSON() readonly payment: IPayment

  @IsJSON() readonly benefit: IBenefit[]
  @IsJSON() readonly sponsors: ISponsor[]
  @IsJSON() readonly updates: IPost[]
  @IsJSON() readonly faq: IMessage[]

}