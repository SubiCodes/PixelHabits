import React from 'react'
import { Button } from './ui/button';

interface ErrorPageProps {
    errorMessage?: string;
    retryAction?: () => void;
}

function ErrorPage({ errorMessage, retryAction }: ErrorPageProps) {
  return (
    <div className='flex flex-1 flex-col gap-2 items-center justify-center'>
      <h1 className='text-primary'>{errorMessage ?? "An unexpected error occurred. Please try again."}</h1>
      <Button onClick={retryAction}>Retry</Button>
    </div>
  )
}

export default ErrorPage
