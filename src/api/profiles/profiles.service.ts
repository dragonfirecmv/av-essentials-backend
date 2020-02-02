import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from './profiles.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/users.entity';
import { CreateProfileDTO } from './dto/create-profile.dto';

@Injectable()
export class ProfilesService {

  constructor(
    @InjectRepository(ProfileEntity)
      private readonly profileRepository: Repository<ProfileEntity>
  ) {}

  async showAll() {
    const listProfile = await this.profileRepository.find({
      relations: ['connected_user']
    })

    return listProfile.map(profile => profile.toResponseObject())
  }

  
  async getOfCurrentUser(user: UserEntity) {
    const profile = await this.profileRepository.findOneOrFail({
      where: { connected_user: { id: user.id } },
      relations: ['connected_user']
    })

    return profile.toResponseObject()
  }


  // async getByUserId(id: string, user: UserEntity) {
  //   const 
  // }


  async create(user: UserEntity, payload: CreateProfileDTO) {

    let profile = await this.profileRepository.findOne({ 
      where: { connected_user: { id: user.id } } 
    })

    if (profile) {
      throw new HttpException(
        'Profile for this user already exists!',
        HttpStatus.BAD_REQUEST
      )
    }

    profile = await this.profileRepository.create({
      ...payload,
      connected_user: user
    })
    await this.profileRepository.save(profile)

    return profile.toResponseObject()
  }


  async update(user: UserEntity, payload: CreateProfileDTO) {

    let profile = await this.profileRepository.findOne({ 
      where: { connected_user: { id: user.id } } 
    })

    if (!profile) {
      throw new HttpException(
        'Profile for this user does not exists!',
        HttpStatus.BAD_REQUEST
      )
    }

    await this.profileRepository.update(
      { id: profile.id },
      payload
    )

    profile = await this.profileRepository.findOne({ 
      where: { connected_user: { id: user.id } } 
    })

    return profile.toResponseObject()

  }
  

  async delete(user: UserEntity) {
    let profile = await this.profileRepository.findOne({
      where: { connected_user: { id: user.id } } 
    })

    if (!profile) {
      throw new HttpException(
        'Profile for this user does not exists!',
        HttpStatus.BAD_REQUEST
      )
    }

    const result = await this.profileRepository.delete({ id: profile.id })

    if (result.affected < 1) return { deleted: false }
    return { id: profile.id , deleted: true }

  }

}
