import { CategoryEntity } from "../../categories/categories.entity";
import { IMedia } from '../../../shared/interfaces/media.interface'

export interface IProject {
  id: string,
  validation: IValidation
  slug?: string
  title: string
  category: ICategory
  creator: IUser
  media: IMedia[]

  content: string

  location: string
  locale: string

  funding: IFunding
  payment: IPayment

  benefit: IBenefit[]
  sponsors: ISponsor[]
  updates: IPost[]
  faq: IMessage[]
}

export interface IValidation {
  is_finalized: boolean
  passed: boolean
  verified: boolean
}

export interface ICategory {
  id: string,
  name: string
}

export interface IUser {
  id: string
  name: string
  picture: string
}

export interface IFunding {
  target: number
  funded: number
  currency: string
}

export interface IPayment {
  bank_name: string
  bank_code: number
  account_number: number
  account_name: string
}

export interface ISponsor {
  timestamp: string
  who: IUser
  selected_tier: {
    type: string
    name: string
    price: number
  }
}

export interface IMessage {
  title: string
  content: string
}

export interface IPost extends IMessage {
  timestamp: string
}

export interface IBenefit {
  type: string
  title: string
  content: string
  notes?: string
  limited: boolean
  max?: number
  taken: number
}