import React from 'react'
import { BeatLoader, MoonLoader } from "react-spinners";


type LoadingPageProps = {
  isMoonLoader?: boolean;
};

function LoadingPage({ isMoonLoader = false }: LoadingPageProps) {
  return (
    <div className='flex flex-1 items-center justify-center min-h-full min-w-full'>
      {isMoonLoader ? <MoonLoader size={16} color="#4B5563" /> : <BeatLoader size={8} color="#4B5563" />}
    </div>
  );
}

export default LoadingPage
