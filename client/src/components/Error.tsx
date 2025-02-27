import { useRouteError } from 'react-router-dom'

import type { ServerErrorResponse } from '../interfaces'

export default function Error() {
  const error = useRouteError() as ServerErrorResponse
  const data = error?.response?.data

  if (!data) {
    return null
  }

  const { statusCode, message } = data

  return (
    <div className='flow container grid'>
      {error && (
        <>
          <h2>Status - {statusCode}</h2>
          <pre>Error: {message}</pre>
        </>
      )}
    </div>
  )
}
