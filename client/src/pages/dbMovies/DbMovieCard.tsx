import type { Params } from 'react-router-dom'
import { Link, useLoaderData, useLocation } from 'react-router-dom'

import { DB_API_IMG, getDbMovieById } from '../../api'
import StarRating from '../../components/StarRating'
import noImage from '../../img/no_image.png'
import type { DbMovieCardLoaderData } from '../../interfaces'
import { requireAuth } from '../../utils'

export async function loader({ request, params }: { request: Request; params: Params }) {
  await requireAuth(request)
  const id = parseInt(params.id || '')
  const movie = await getDbMovieById(id)
  return movie
}

export default function DbMovieCard() {
  const { state, pathname, search: searchValue } = useLocation()
  const search = state?.search || searchValue
  const movie = useLoaderData() as DbMovieCardLoaderData
  const { title = '-', overview = '-', homepage = null, poster_path = '-', genres = [] } = movie

  const imgUrl = poster_path ? DB_API_IMG + poster_path : '-'
  const genre = genres[0]?.name ?? '-'
  const validGenre = ['action', 'comedy', 'drama', 'animation'].includes(genre.toLowerCase()) || ''

  const data = {
    title,
    overview,
    homepage,
    imgUrl,
    genre: validGenre,
  }

  const imgSrc = poster_path ? DB_API_IMG + poster_path : noImage
  // TMDB movies have vote_average field which is on a 0-10 scale
  // We convert it to our 1-5 scale for consistency
  const averageRating = movie.vote_average ? movie.vote_average / 2 : undefined

  return (
    <div className='flow container'>
      <div className='flex flex-space-between'>
        <Link to={`..${search}`} relative='path'>
          &larr; <span>Back</span>
        </Link>
        <Link
          to='../../movies/create'
          className='text-green'
          state={{
            pathname,
            search,
            data,
          }}
        >
          Add this movie to favorite
        </Link>
      </div>
      <div className='movie-card-container flex'>
        <img className='width-300' src={imgSrc} alt='movie' />
        <div className='grid'>
          <h2>{title}</h2>
          {averageRating ? (
            <div className="movie-rating">
              <StarRating initialRating={averageRating} readonly size="small" />
              <span className="rating-text">({averageRating.toFixed(1)})</span>
            </div>
          ) : null}
          <h3>
            <span className='ff-sans-normal '>Genre: </span>
            {genre}
          </h3>
          <p>
            <span className='ff-sans-normal '>Overwiew: </span>
            {overview}
          </p>
          {homepage && (
            <a className='text-blue ff-sans-normal' href={homepage} target='_blank' rel='noopener noreferrer'>
              Link To Homepage
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
