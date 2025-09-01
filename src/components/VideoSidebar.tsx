'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, MapPin, ExternalLink, X } from 'lucide-react'

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

interface VideoSidebarProps {
  video: Video | null
  onClose: () => void
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

const getEmbedUrl = (url: string, platform: string) => {
  switch (platform.toLowerCase()) {
    case 'youtube':
      const youtubeId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
      return youtubeId ? `https://www.youtube.com/embed/${youtubeId[1]}` : url
    case 'tiktok':
      // TikTok embed would need special handling
      return url
    case 'instagram':
      // Instagram embed would need special handling
      return url
    default:
      return url
  }
}

export default function VideoSidebar({ video, onClose }: VideoSidebarProps) {
  if (!video) return null

  const embedUrl = getEmbedUrl(video.url, video.platform)
  const formattedDate = new Date(video.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="w-96 h-full bg-white border-l border-gray-200 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Video Details</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Badge className={`${getPlatformColor(video.platform)} text-white`}>
                {video.platform.toUpperCase()}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-3 w-3" />
                  Open
                </a>
              </Button>
            </div>
            <CardTitle className="text-lg leading-6">{video.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 leading-relaxed">
              {video.description}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                {video.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CalendarDays className="h-4 w-4" />
                {formattedDate}
              </div>
            </div>

            {video.tags.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">Tags</div>
                <div className="flex flex-wrap gap-1">
                  {video.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Video Embed */}
        <Card>
          <CardContent className="p-0">
            {video.platform.toLowerCase() === 'youtube' ? (
              <div className="aspect-video">
                <iframe
                  src={embedUrl}
                  title={video.title}
                  className="w-full h-full rounded-lg"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 flex items-center justify-center rounded-lg">
                <div className="text-center p-4">
                  <p className="text-gray-600 mb-2">
                    {video.platform.charAt(0).toUpperCase() + video.platform.slice(1)} Video
                  </p>
                  <Button asChild variant="outline">
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View on {video.platform}
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}