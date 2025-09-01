'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { CalendarDays, MapPin, ExternalLink } from 'lucide-react'

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

interface VideoCardProps {
  video: Video
}

const getPlatformColor = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'youtube':
      return 'bg-red-500'
    case 'tiktok':
      return 'bg-black'
    case 'instagram':
      return 'bg-gradient-to-r from-purple-500 to-pink-500'
    default:
      return 'bg-blue-500'
  }
}

const getThumbnailUrl = (video: Video) => {
  if (video.thumbnail) return video.thumbnail
  
  // Generate YouTube thumbnail if it's a YouTube video
  if (video.platform.toLowerCase() === 'youtube') {
    const youtubeId = video.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    if (youtubeId) {
      return `https://img.youtube.com/vi/${youtubeId[1]}/maxresdefault.jpg`
    }
  }
  
  return null
}

export default function VideoCard({ video }: VideoCardProps) {
  const thumbnailUrl = getThumbnailUrl(video)
  const formattedDate = new Date(video.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  const truncatedDescription = video.description.length > 120 
    ? video.description.substring(0, 120) + '...' 
    : video.description

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="p-0">
        <div className="relative">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={video.title}
              className="w-full h-48 object-cover rounded-t-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const fallback = target.nextElementSibling as HTMLElement
                if (fallback) fallback.style.display = 'flex'
              }}
            />
          ) : null}
          <div 
            className={`w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center ${thumbnailUrl ? 'hidden' : 'flex'}`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">
                {video.platform.toLowerCase() === 'youtube' && '📹'}
                {video.platform.toLowerCase() === 'tiktok' && '🎵'}
                {video.platform.toLowerCase() === 'instagram' && '📸'}
                {!['youtube', 'tiktok', 'instagram'].includes(video.platform.toLowerCase()) && '🎬'}
              </div>
              <p className="text-gray-500 text-sm">Video Preview</p>
            </div>
          </div>
          
          <div className="absolute top-3 left-3">
            <Badge className={`${getPlatformColor(video.platform)} text-white text-xs`}>
              {video.platform.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {video.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-3 leading-relaxed">
          {truncatedDescription}
        </p>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{video.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <CalendarDays className="h-3 w-3 flex-shrink-0" />
            {formattedDate}
          </div>
        </div>

        {video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {video.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {video.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{video.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          asChild
          className="w-full"
          size="sm"
        >
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-3 w-3" />
            Watch on {video.platform}
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}