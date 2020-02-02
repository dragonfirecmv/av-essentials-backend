import { Controller, Get, UseGuards, Body, Post, Delete, Put } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/decorator/users.decorator';
import { UserEntity } from '../users/users.entity';
import { CreateProfileDTO } from './dto/create-profile.dto';

@Controller('api/profiles')
export class ProfilesController {
  
  constructor(
    private readonly profilesService: ProfilesService
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  showAllProfiles() {
    return this.profilesService.showAll()
  }

  
  // Get profile by Token
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  showMyProfile(
    @User() user: UserEntity
  ) {
    return this.profilesService.getOfCurrentUser(user)
  }


  // @Get('by-user-id')
  // @UseGuards(AuthGuard('jwt'))
  // showProfileFromUserId(
  //   @User() user: UserEntity) {
  //   return this.profilesService.getByUserId()
  // }



  @Post()
  @UseGuards(AuthGuard('jwt'))
  createNewProfile(
    @User() user: UserEntity,
    @Body() profileData: CreateProfileDTO
  ) {
    return this.profilesService.create(user, profileData)
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  updateProfile(
    @User() user: UserEntity,
    @Body() newProfileData: CreateProfileDTO
  ) {
    return this.profilesService.update(user, newProfileData)
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  deleteProfile(
    @User() user: UserEntity
  ) {
    return this.profilesService.delete(user)
  }
}
