import { useState } from 'react'

interface StarRatingProps {
  initialRating?: number
  onChange?: (rating: number) => void
  readonly?: boolean
  size?: 'small' | 'medium' | 'large'
  className?: string
}

/**
 * A reusable star rating component that can be used for both display and input.
 * 
 * @param initialRating - Initial rating value (1-5)
 * @param onChange - Callback function when rating changes
 * @param readonly - Whether the rating can be changed by user
 * @param size - Size variant of the stars
 * @param className - Additional CSS classes
 */
export default function StarRating({
  initialRating = 0,
  onChange,
  readonly = false,
  size = 'medium',
  className = '',
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClass = {
    small: 'star-rating--small',
    medium: 'star-rating--medium',
    large: 'star-rating--large',
  }

  // Updates the rating when a star is clicked
  const handleClick = (value: number) => {
    if (readonly) return
    
    setRating(value)
    if (onChange) {
      onChange(value)
    }
  }

  // Shows preview of rating when hovering over stars
  const handleMouseEnter = (value: number) => {
    if (readonly) return
    setHoverRating(value)
  }

  // Resets hover state when mouse leaves the component
  const handleMouseLeave = () => {
    if (readonly) return
    setHoverRating(0)
  }

  return (
    <div className={`star-rating ${sizeClass[size]} ${className}`}>
      {[1, 2, 3, 4, 5].map((value) => {
        // Use hover rating if available, otherwise use the actual rating
        const starValue = hoverRating || rating
        
        return (
          <span
            key={value}
            className={`star ${value <= starValue ? 'star--active' : ''} ${readonly ? 'star--readonly' : ''}`}
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            role={readonly ? 'presentation' : 'button'}
            tabIndex={readonly ? -1 : 0}
            aria-label={`Rate ${value} out of 5 stars`}
          >
            ★
          </span>
        )
      })}
      {!readonly && <span className="star-rating__value">{hoverRating || rating || ''}</span>}
    </div>
  )
}
