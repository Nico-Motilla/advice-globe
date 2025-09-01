'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Globe from '@/components/Globe'
import VideoSidebar from '@/components/VideoSidebar'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Video {
  id: string
  title: string
  description: string
  platform: string
  url: string
  thumbnail?: string
  tags: string[]
  location: string
  lat: number
  lng: number
  createdAt: string
}

async function fetchVideos(): Promise<Video[]> {
  const response = await fetch('/api/videos')
  if (!response.ok) {
    throw new Error('Failed to fetch videos')
  }
  const data = await response.json()
  return data.videos
}

export default function MapPage() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  const { data: videos = [], isLoading, error } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos
  })

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video)
  }

  const handleCloseSidebar = () => {
    setSelectedVideo(null)
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading globe...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load videos</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center gap-4 p-4 bg-white border-b border-gray-200">
        <Link href="/">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Interactive Globe View</h1>
        <div className="ml-auto text-sm text-gray-500">
          {videos.length} videos worldwide
        </div>
      </div>

      <div className="flex-1 flex">
        <div className={`flex-1 transition-all duration-300 ${selectedVideo ? 'mr-0' : ''}`}>
          <Globe
            videos={videos}
            onVideoSelect={handleVideoSelect}
            selectedVideo={selectedVideo}
          />
        </div>
        
        {selectedVideo && (
          <VideoSidebar
            video={selectedVideo}
            onClose={handleCloseSidebar}
          />
        )}
      </div>
    </div>
  )
}