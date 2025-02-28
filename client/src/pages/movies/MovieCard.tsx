import { useState } from 'react'
import type { Params } from 'react-router-dom'
import { Link, useLoaderData, useLocation } from 'react-router-dom'

import { getMovieById } from '../../api'
import ReviewForm from '../../components/ReviewForm'
import ReviewList from '../../components/ReviewList'
import StarRating from '../../components/StarRating'
import noImage from '../../img/no_image.png'
import type { MovieData } from '../../interfaces'
import { requireAuth } from '../../utils'

export async function loader({ request, params }: { request: Request; params: Params }) {
  await requireAuth(request)
  const id = parseInt(params.id ?? '')
  return getMovieById(id)
}

export default function MovieCard() {
  const { pathname, search = '', genre_type } = useLocation().state || {}
  const [showReviewForm, setShowReviewForm] = useState(false)

  const movie = useLoaderData() as MovieData
  const { title, overview, homepage = null, imgUrl, genre, averageRating } = movie
  const imgSrc = imgUrl.length > 0 ? imgUrl : noImage

  const handleReviewSubmitted = () => {
    setShowReviewForm(false)
    // Force a refresh of the reviews list
    window.location.reload()
  }

  return (
    <div className='flow container'>
      <div className='flex flex-space-between'>
        <Link to={`${pathname + search}`} relative='path'>
          &larr; Back to <span className='capitalize text-blue'>{genre_type} </span>
          movies
        </Link>
        <div className='flex'>
          <Link className='text-green' to='edit' state={{ pathname, search, genre_type }}>
            Edit
          </Link>
          <Link className='text-red' to='delete' state={{ pathname, search, genre_type }}>
            Delete
          </Link>
        </div>
      </div>
      <div className='movie-card-container flex'>
        <div>
          <img className='width-300' src={imgSrc} alt='movie' />
        </div>
        <div className='grid'>
          <h3 className={`movie-genre ${genre} selected ff-sans-normal`}>
            Genre: <span className='uppercase'>{genre}</span>
          </h3>
          <h2>{title}</h2>
          {averageRating ? (
            <div className="movie-rating">
              <StarRating initialRating={averageRating} readonly size="small" />
              <span className="rating-text">({averageRating.toFixed(1)})</span>
            </div>
          ) : null}
          <p>{overview}</p>
          {homepage && (
            <a className='text-blue ff-sans-normal' href={homepage} target='_blank' rel='noopener noreferrer'>
              Link To Homepage
            </a>
          )}
        </div>
      </div>

      <div className="movie-reviews-section">
        <div className="review-section-header">
          <h2>Reviews</h2>
          {!showReviewForm && (
            <button 
              className="button button--primary" 
              onClick={() => setShowReviewForm(true)}
            >
              Write a Review
            </button>
          )}
        </div>
        
        {showReviewForm ? (
          <ReviewForm 
            onSuccess={handleReviewSubmitted} 
            onCancel={() => setShowReviewForm(false)} 
          />
        ) : null}
        
        <ReviewList />
      </div>
    </div>
  )
}
