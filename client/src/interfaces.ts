export interface ServerErrorResponse {
  response: {
    data: {
      statusCode: number | string
      message: string[] | string
    }
  }
}

export interface DbServerErrorResponse {
  response: {
    status: number | string
    data: {
      status_message: string
    }
  }
}

export interface LoginData {
  email: string
  password: string
}

export interface UserData extends LoginData {
  firstName: string
  lastName: string
}

export interface ApiMovieData {
  title: string
  overview: string
  homepage: string
  imgUrl: string
  genre: string
}

export interface MovieData extends ApiMovieData {
  id: number
  averageRating?: number
}

export interface LoginResponse {
  acces_token: string
}

export interface DbMovieLoaderData {
  id: number
  original_title: string
  release_date: string
  vote_average: number
}

export interface DbMovieCardLoaderData {
  title: string
  overview: string
  homepage: string
  poster_path: string
  genres: {
    name: string
  }[]
}

export interface Review {
  id: number
  rating: number
  comment?: string
  createdAt: string
  updatedAt: string
  userId: number
  movieId: number
}

export interface ReviewSubmission {
  rating: number
  comment?: string
}
