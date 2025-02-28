import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'

import { GetUser } from '../auth/decorator'
import { JwtGuard } from '../auth/guard'
import { CreateReviewDto, EditReviewDto } from './dto'
import { ReviewService } from './review.service'

@UseGuards(JwtGuard)
@Controller('reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  /**
   * Get all reviews for a specific movie
   */
  @Get('movie/:movieId')
  getMovieReviews(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.reviewService.getMovieReviews(movieId)
  }

  /**
   * Get average rating for a movie
   */
  @Get('movie/:movieId/rating')
  getMovieAverageRating(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.reviewService.getMovieAverageRating(movieId)
  }

  /**
   * Get all reviews created by the authenticated user
   */
  @Get('user/me')
  getUserReviews(@GetUser('id') userId: number) {
    return this.reviewService.getUserReviews(userId)
  }

  /**
   * Get a specific review by ID
   */
  @Get(':id')
  getReviewById(@Param('id', ParseIntPipe) reviewId: number) {
    return this.reviewService.getReviewById(reviewId)
  }

  /**
   * Create a new review for a movie
   */
  @Post('movie/:movieId')
  createReview(
    @GetUser('id') userId: number,
    @Param('movieId', ParseIntPipe) movieId: number,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewService.createReview(userId, movieId, dto)
  }

  /**
   * Edit an existing review
   */
  @Patch(':id')
  editReview(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) reviewId: number,
    @Body() dto: EditReviewDto,
  ) {
    return this.reviewService.editReview(userId, reviewId, dto)
  }

  /**
   * Delete a review
   */
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteReview(@GetUser('id') userId: number, @Param('id', ParseIntPipe) reviewId: number) {
    return this.reviewService.deleteReview(userId, reviewId)
  }
}
