import { CategoryEntity } from "../categories.entity";
import { IMedia } from "../../../shared/interfaces/media.interface";

export interface ICategory {
  id: string,
  name: string,
  media: IMedia[]
  children: CategoryEntity[],
  parent: CategoryEntity
}