import React from 'react'
import { BeatLoader } from "react-spinners";

function LoadingPage() {
  return (
    <div className='flex flex-1 items-center justify-center min-h-full min-w-full'>
      <BeatLoader size={8} color="#4B5563" />
    </div>
  )
}

export default LoadingPage
