import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm'
import { IBenefit, ISponsor, IPost, IMessage, IProject } from './interfaces/projects.interface'
import { UserEntity } from '../users/users.entity';
import { CategoryEntity } from '../categories/categories.entity';
import { IMedia } from '../../shared/interfaces/media.interface';

@Entity('projects')
export class ProjectEntity {
  @PrimaryGeneratedColumn('uuid') id: string

  @CreateDateColumn()
    time_created: string

  @UpdateDateColumn()
    time_last_edited: string

  @ManyToOne(
    () => UserEntity, 
    creator => creator.projects,
    { cascade: true, eager: true }
  ) 
    creator: UserEntity

  @ManyToOne(
    () => CategoryEntity,
    category => category.projects
  )
    category: CategoryEntity;

  @Column('boolean') is_finalized: boolean
  @Column('boolean') passed: boolean
  @Column('boolean') verified: boolean

  @Column({ type: 'text', unique: true }) 
  slug: string

  @Column('text') title: string
  @Column('text') content: string
  @Column('json', { nullable: true }) media: IMedia[]

  @Column('text') location: string
  @Column('text') locale: string

  @Column('bigint') funding_target: number
  @Column('bigint') funding_funded: number
  @Column('text') funding_currency: string

  @Column('text') payment_bank_name: string
  @Column('text') payment_account_name: string
  @Column('bigint') payment_bank_code: number
  @Column('bigint') payment_account_no: number

  @Column('jsonb') benefit: IBenefit[]
  @Column('jsonb') sponsors: ISponsor[]
  @Column('jsonb') updates: IPost[]
  @Column('jsonb') faq: IMessage[]


  
  toResponseObject(): IProject {
    return {
      id: this.id,
      validation: {
        is_finalized: this.is_finalized,
        passed: this.passed,
        verified: this.verified
      },
      slug: this.slug,
      title: this.title,
      category: this.category,
      creator: {
        id: this.creator.id,
        name: this.creator.givenname,
        picture: this.creator.profile.display_picture_url
      },
      media: this.media,
  
      content: this.content,
  
      location: this.location,
      locale: this.locale,
  
      funding: {
        currency: this.funding_currency,
        funded: this.funding_funded,
        target: this.funding_target
      },
      payment: {
        bank_code: this.payment_bank_code,
        bank_name: this.payment_bank_name,
        account_name: this.payment_account_name,
        account_number: this.payment_account_no
      },
  
      benefit: this.benefit,
      sponsors: this.sponsors,
      updates: this.updates,
      faq: this.faq
    }
  }
}