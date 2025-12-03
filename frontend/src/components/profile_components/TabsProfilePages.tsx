import React from 'react'

function TabsProfilePages() {

    const pages = ["Activities", "Habits", "Likes"];

    return (
        <div className='w-full flex flex-row border-b'>
            {pages.map((page, index) => (
                <div key={index} className='flex-1 text-center py-3 border-b-2 border-transparent hover:border-gray-300 cursor-pointer transition-colors'>
                    <span className='text-md font-medium'>{page}</span>
                </div>
            ))}
        </div>
    )
}

export default TabsProfilePages
