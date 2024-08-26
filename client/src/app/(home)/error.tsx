'use client' // Error components must be Client Components

import { useEffect } from 'react'

export default function Error({
                                error,
                                reset,
                              }: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service

      console.error('errorPage', error.message);
  }, [error])

  return (
    <div>
      <h2>Something went wrong! {error.message}</h2>
        <h2>  서비스에 접속할 수 없습니다.
            새로고침을 하거나 잠시 후 다시 접속해 주시기 바랍니다.</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
      새로고침

      </button>
    </div>
  )
}