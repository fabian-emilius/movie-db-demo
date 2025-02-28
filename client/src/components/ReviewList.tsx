import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getMovieReviews } from '../api'
import type { Review, ServerErrorResponse } from '../interfaces'
import StarRating from './StarRating'

/**
 * Component that fetches and displays a list of reviews for a movie.
 * Handles loading states, error handling, and empty states.
 */
export default function ReviewList() {
  const { id } = useParams()
  const movieId = parseInt(id || '0')
  
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Skip if no valid movieId is available
    if (!movieId) return
    
    /**
     * Fetches reviews for the current movie
     * Handles loading states and error handling
     */
    const fetchReviews = async () => {
      setLoading(true)
      setError('')
      
      try {
        const data = await getMovieReviews(movieId)
        setReviews(data)
      } catch (err) {
        // Format error message based on server response structure
        const serverError = err as ServerErrorResponse
        let errorMessage = 'Failed to load reviews'
        
        if (serverError.response?.data?.message) {
          if (typeof serverError.response.data.message === 'string') {
            errorMessage = serverError.response.data.message
          } else if (Array.isArray(serverError.response.data.message)) {
            errorMessage = serverError.response.data.message[0]
          }
        }
        
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [movieId])

  // Show appropriate UI based on data loading state
  if (loading) {
    return <div className="reviews-loading">Loading reviews...</div>
  }

  if (error) {
    return <div className="reviews-error">Error: {error}</div>
  }

  if (reviews.length === 0) {
    return <div className="reviews-empty">No reviews yet. Be the first to review!</div>
  }

  return (
    <div className="reviews-list">
      <h3>Reviews ({reviews.length})</h3>
      
      {reviews.map((review) => {
        // Format date for better readability
        const date = new Date(review.createdAt)
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
        
        return (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <StarRating initialRating={review.rating} readonly size="small" />
              <span className="review-date">{formattedDate}</span>
            </div>
            
            {review.comment && (
              <div className="review-comment">{review.comment}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
