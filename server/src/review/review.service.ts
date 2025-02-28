import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateReviewDto, EditReviewDto } from './dto'

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all reviews for a specific movie
   */
  async getMovieReviews(movieId: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    })

    if (!movie) {
      throw new NotFoundException('Movie not found')
    }

    return this.prisma.review.findMany({
      where: {
        movieId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })
  }

  /**
   * Get a specific review by ID
   */
  async getReviewById(reviewId: number) {
    const review = await this.prisma.review.findUnique({
      where: {
        id: reviewId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        movie: true,
      },
    })

    if (!review) {
      throw new NotFoundException('Review not found')
    }

    return review
  }

  /**
   * Get all reviews created by a specific user
   */
  async getUserReviews(userId: number) {
    return this.prisma.review.findMany({
      where: {
        userId,
      },
      include: {
        movie: true,
      },
    })
  }

  /**
   * Create a new review for a movie
   */
  async createReview(userId: number, movieId: number, dto: CreateReviewDto) {
    // Check if movie exists
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    })

    if (!movie) {
      throw new NotFoundException('Movie not found')
    }

    // Create new review (and let the unique constraint handle duplicates)
    try {
      return await this.prisma.review.create({
        data: {
          ...dto,
          userId,
          movieId,
        },
      })
    } catch (error) {
      if (error.code === 'P2002') { // Prisma unique constraint violation
        throw new ForbiddenException('User already has a review for this movie')
      }
      throw error
    }
  }

  /**
   * Edit an existing review
   */
  async editReview(userId: number, reviewId: number, dto: EditReviewDto) {
    // Check if review exists and belongs to user
    const review = await this.prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    })

    if (!review) {
      throw new NotFoundException('Review not found')
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('Access to resources denied')
    }

    // Update review
    return this.prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        ...dto,
      },
    })
  }

  /**
   * Delete a review
   */
  async deleteReview(userId: number, reviewId: number) {
    // Check if review exists and belongs to user
    const review = await this.prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    })

    if (!review) {
      throw new NotFoundException('Review not found')
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('Access to resources denied')
    }

    // Delete review
    return this.prisma.review.delete({
      where: {
        id: reviewId,
      },
    })
  }

  /**
   * Calculate average rating for a movie
   */
  async getMovieAverageRating(movieId: number) {
    const result = await this.prisma.review.aggregate({
      where: {
        movieId,
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    })

    return {
      averageRating: result._avg.rating || 0,
      reviewCount: result._count.rating || 0,
    }
  }
}
