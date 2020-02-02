import { Controller, Get, UseGuards, Post, Param, Body, Put } from "@nestjs/common";
import { RatingService } from "../services/rating.service";
import { AuthGuard } from "@nestjs/passport";
import { User } from "../../../api/users/decorator/users.decorator";
import { UserEntity } from "../../../api/users/users.entity";
import { CreateRatingDTO } from "../dtos/create-rating.dto";

@Controller('api/vendorapi-rating')
export class RatingController {

    constructor(
        private readonly ratingService: RatingService
    ) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    showAllRatings(
        @User() user: UserEntity,
    ) {
        if (user.admin) {
            return this.ratingService.showAll()
        }
        return this.ratingService.unAuthorizedOnlyAdmin()
    }

    @Get('user-rating')
    @UseGuards(AuthGuard('jwt'))
    getMyRatings(
        @User() user: UserEntity
    ) {
        return this.ratingService.showMyRatings(user)
    }

    @Get('user-rating/:vendorId')
    @UseGuards(AuthGuard('jwt'))
    getMyRatingTo(
        @User() user: UserEntity,
        @Param('vendorId') vendorId: string
    ) {
        return this.ratingService.showMyRatingTo(user, vendorId)
    }

    @Post('user-rating')
    @UseGuards(AuthGuard('jwt'))
    addMyRatingTo(
        @User() user: UserEntity,
        @Body() payload: CreateRatingDTO
    ) {
        return this.ratingService.addMyRatingTo(user, payload)
    }

    @Put('user-rating')
    @UseGuards(AuthGuard('jwt'))
    updateMyRatingTo(
        @User() user: UserEntity,
        @Body() payload: CreateRatingDTO
    ) {
        return this.ratingService.updateMyRatingTo(user, payload)
    }

    @Get('vendor-rating/:vendorId')
    @UseGuards(AuthGuard('jwt'))
    getVendorRating(
        @User() user: UserEntity,
        @Param('vendorId') vendorId: String
    ) {
        return this.ratingService.listOfRating(user, vendorId)
    }

}