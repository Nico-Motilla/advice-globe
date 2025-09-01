'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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

interface VideoModalProps {
  video: Video | null
  open: boolean
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
      return url
    case 'instagram':
      return url
    default:
      return url
  }
}

export default function VideoModal({ video, open, onClose }: VideoModalProps) {
  if (!video) return null

  const embedUrl = getEmbedUrl(video.url, video.platform)
  const formattedDate = new Date(video.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[750px] w-[750px] h-[550px] p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Video Section - 75% */}
          <div className="flex-1 flex flex-col">
            {/* Video Embed */}
            <div className="flex-1">
              {video.platform.toLowerCase() === 'youtube' ? (
                <iframe
                  src={embedUrl}
                  title={video.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
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
            </div>
          </div>

          {/* Sidebar - 25% */}
          <div className="w-[25%] bg-white border-l border-gray-200 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <Badge className={`${getPlatformColor(video.platform)} text-white text-xs`}>
                {video.platform.toUpperCase()}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-2">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {video.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{video.location}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <CalendarDays className="h-3 w-3" />
                  {formattedDate}
                </div>
              </div>

              {video.tags.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-700">Tags</div>
                  <div className="flex flex-wrap gap-1">
                    {video.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Open Video
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}