import React from 'react'

export default function Home() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">Home</h1>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-border">
          <button className="flex-1 px-4 py-4 text-sm font-semibold hover:bg-accent transition-colors border-b-2 border-primary">
            For you
          </button>
          <button className="flex-1 px-4 py-4 text-sm font-semibold hover:bg-accent transition-colors text-muted-foreground">
            Following
          </button>
        </div>
      </div>

      {/* Feed Content */}
      <div className="divide-y divide-border">
        {/* Placeholder for activity posts */}
        <div className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
          <p className="text-muted-foreground text-center py-8">
            Activities shared by others will appear here
          </p>
        </div>
      </div>
    </div>
  )
}

