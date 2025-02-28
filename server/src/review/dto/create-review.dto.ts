import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator'

export class CreateReviewDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number

  @IsString()
  @IsOptional()
  comment?: string
}
