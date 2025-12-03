import React from 'react'

interface TabsProfilePagesProps {
    pages: string[];
    activeTab?: string;
    onChangeTab: (tab: string) => void;
}

function TabsProfilePages({ pages, activeTab = pages[0], onChangeTab }: TabsProfilePagesProps) {
    return (
        <div className='w-full flex flex-row border-b'>
            {pages.map((page, index) => (
                <div 
                    key={index} 
                    className={`flex-1 text-center py-3 border-b-2 cursor-pointer transition-colors ${
                        activeTab === page 
                            ? 'border-primary text-primary' 
                            : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => onChangeTab(page)}
                >
                    <span className='text-md font-medium'>{page}</span>
                </div>
            ))}
        </div>
    )
}

export default TabsProfilePages
