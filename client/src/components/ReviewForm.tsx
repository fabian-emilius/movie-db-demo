import { useState } from 'react'
import { Form, useNavigate, useParams } from 'react-router-dom'

import { createMovieReview } from '../api'
import type { ReviewSubmission, ServerErrorResponse } from '../interfaces'
import StarRating from './StarRating'

interface ReviewFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

/**
 * Form component for submitting movie reviews.
 * Handles validation, submission, and error states.
 * 
 * @param onSuccess - Callback function when review is successfully submitted
 * @param onCancel - Callback function when form submission is canceled
 */
export default function ReviewForm({ onSuccess, onCancel }: ReviewFormProps) {
  const { id } = useParams()
  const movieId = parseInt(id || '0')
  const navigate = useNavigate()
  
  // Form state
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState({ rating: '' })

  /**
   * Validates form input before submission
   * @returns boolean indicating if form is valid
   */
  const validateForm = () => {
    const errors = { rating: '' }
    let isValid = true

    if (rating === 0) {
      errors.rating = 'Please select a rating (1-5 stars)'
      isValid = false
    }

    setValidationErrors(errors)
    return isValid
  }

  /**
   * Handles form submission
   * Validates input, calls API, and handles success/error states
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    setError('')
    
    try {
      // Prepare review data - omit comment if it's empty
      const reviewData: ReviewSubmission = {
        rating,
        comment: comment.trim() || undefined
      }
      
      await createMovieReview(movieId, reviewData)
      
      // Reset form after successful submission
      setRating(0)
      setComment('')
      
      // Notify parent component of success
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      // Extract and format error message from server response
      const serverError = err as ServerErrorResponse
      const errorMessage = typeof serverError.response?.data?.message === 'string'
        ? serverError.response.data.message
        : Array.isArray(serverError.response?.data?.message)
          ? serverError.response.data.message[0]
          : 'An error occurred while submitting your review'
      
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="review-form">
      <h3>Write a Review</h3>
      <Form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Rating</label>
          <StarRating 
            initialRating={rating} 
            onChange={setRating} 
            className={validationErrors.rating ? 'has-error' : ''}
          />
          {validationErrors.rating && (
            <p className="error-message">{validationErrors.rating}</p>
          )}
        </div>
        
        <div className="form-field">
          <label htmlFor="comment">Comment (optional)</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Share your thoughts about this movie..."
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-actions">
          <button 
            type="button" 
            className="button button--secondary" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="button button--primary" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </Form>
    </div>
  )
}
