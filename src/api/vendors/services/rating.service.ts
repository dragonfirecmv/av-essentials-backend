import { Injectable, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RatingEntity } from "../entities/rating.entity";
import { Repository } from "typeorm";
import { UserEntity } from "../../../api/users/users.entity";
import { CreateRatingDTO } from "../dtos/create-rating.dto";
import { VendorEntity } from "../entities/vendors.entity";

@Injectable()
export class RatingService {
    constructor(
        @InjectRepository(RatingEntity)
        private readonly ratingRepository: Repository<RatingEntity>,
        @InjectRepository(VendorEntity)
        private readonly vendorRepository: Repository<VendorEntity>
    ) {}

    async showAll() {
        const listRating = await this.ratingRepository.find({
            relations: ['user', 'vendor']
        })

        return listRating.map(rating => rating.toResponseObject())
    }

    async unAuthorizedOnlyAdmin() {
        throw new HttpException('Unauthorized!', HttpStatus.UNAUTHORIZED) 
    }

    async showMyRatings(user: UserEntity) {
        const myListOfRatings = await this.ratingRepository.find({
            where: {user: {id: user.id}},
            relations: ['user', 'vendor']
        })

        return myListOfRatings.map(rating => rating.toResponseObject())
    }

    async showMyRatingTo(user: UserEntity, vendorId: String) {
        const myRatingTo = await this.showUserRatingTo(user, vendorId)
        if (!myRatingTo) {
            return this.handleRatingNotFound()
        }
        
        return myRatingTo.toResponseObject()
    }

    async addMyRatingTo(user: UserEntity, payload: CreateRatingDTO) {
        const checkDoesRatingExist = await this.showUserRatingTo(user, payload.vendor.id)

        if (checkDoesRatingExist) {
            throw new HttpException('Rating already exists!', HttpStatus.BAD_REQUEST) 
        }

        const newRating = await this.ratingRepository.create({
            ...payload,
            user: user
        })
        await this.ratingRepository.save(newRating)

        const ratingCreated = await this.showUserRatingTo(user, payload.vendor.id)
        return ratingCreated.toResponseObject()
    }

    async updateMyRatingTo(user: UserEntity, payload: CreateRatingDTO) {
        const checkDoesRatingExist = await this.showUserRatingTo(user, payload.vendor.id)
        if (!checkDoesRatingExist) {
            return this.handleRatingNotFound()
        }
        await this.ratingRepository.update({id: checkDoesRatingExist.id}, payload)

        const newRating = await this.showUserRatingTo(user, payload.vendor.id)

        return newRating.toResponseObject()
    }


    async showUserRatingTo(user: UserEntity, vendorId: String) {
        const userRating = await this.ratingRepository.findOne({
            where: {user: {id: user.id}, vendor: {id: vendorId}},
            relations: ['user', 'vendor']
        })
        return userRating
    }

    async handleRatingNotFound() {
        throw new HttpException('Rating not found!', HttpStatus.NOT_FOUND)
    }

    async listOfRating(user: UserEntity, vendorId: String) {
        const ownedVendor = await this.isVendorOwnerOf(user, vendorId)
    
        return ownedVendor.ratings.map(rating => rating.toResponseObjectForVendor())
    }

    async isVendorOwnerOf(user: UserEntity, vendorId: String) {
        const ownedVendor = await this.vendorRepository.findOne({
            where: {owned_by_who: {id: user.id}, id: vendorId},
            relations: ['ratings', 'ratings.user']
        })
        if (!ownedVendor) {
            throw new HttpException('User is not an owner of this vendor!', HttpStatus.NOT_FOUND)
        }
        return ownedVendor
    }
}
