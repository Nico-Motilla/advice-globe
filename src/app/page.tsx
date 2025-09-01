'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from "@/components/ui/button"
import { Globe, Grid3X3 } from "lucide-react"
import GlobeComponent from '@/components/Globe'
import VideoSidebar from '@/components/VideoSidebar'
import VideoCard from '@/components/VideoCard'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'

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

interface VideosResponse {
  videos: Video[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

async function fetchVideos(
  page: number = 1,
  platform?: string,
  tags?: string,
  location?: string
): Promise<VideosResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: '12'
  })
  
  if (platform) params.append('platform', platform)
  if (tags) params.append('tags', tags)
  if (location) params.append('location', location)

  const response = await fetch(`/api/videos?${params}`)
  if (!response.ok) {
    throw new Error('Failed to fetch videos')
  }
  return response.json()
}

export default function Home() {
  const [activeView, setActiveView] = useState<'map' | 'wall'>('map')
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [platformFilter, setPlatformFilter] = useState<string>('')
  const [tagsFilter, setTagsFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['videos', currentPage, platformFilter, tagsFilter, locationFilter],
    queryFn: () => fetchVideos(
      currentPage,
      platformFilter || undefined,
      tagsFilter || undefined,
      locationFilter || undefined
    )
  })

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video)
  }

  const handleCloseSidebar = () => {
    setSelectedVideo(null)
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setPlatformFilter('')
    setTagsFilter('')
    setLocationFilter('')
    setCurrentPage(1)
  }

  const videos = data?.videos || []
  const pagination = data?.pagination

  if (isLoading && currentPage === 1) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="text-center py-8 px-8">
        <div className="space-y-4 mb-4">
          <p className="text-3xl font-bold text-gray-900 max-w-2xl mx-auto">
            Discover wisdom and insights shared by people across the globe.
          </p>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-2">
          <Button 
            size="lg" 
            onClick={() => setActiveView('map')}
            className={`h-12 px-8 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 min-w-[200px] ${
              activeView === 'map' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
            }`}
          >
            <Globe className="h-6 w-6" />
            Map Vlog
          </Button>
          
          <Button 
            size="lg"
            onClick={() => setActiveView('wall')}
            className={`h-12 px-8 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 min-w-[200px] ${
              activeView === 'wall' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
            }`}
          >
            <Grid3X3 className="h-6 w-6" />
            Wall-Advice
          </Button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 pb-8">
        {activeView === 'map' ? (
          /* Map View with 65/35 Split */
          <div className="flex gap-6 h-[calc(100vh-280px)] min-h-[600px]">
            {/* Left side - 65% - Globe */}
            <div className="w-[65%] bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center p-8">
              <div className="relative">
                <div 
                  className="w-[550px] h-[550px] rounded-full border-4 border-gray-200 shadow-xl overflow-hidden bg-white"
                  style={{ clipPath: 'circle(275px)' }}
                >
                  <GlobeComponent
                    videos={videos}
                    onVideoSelect={handleVideoSelect}
                    selectedVideo={selectedVideo}
                  />
                </div>
              </div>
            </div>
            
            {/* Right side - 35% - Video Details */}
            <div className="w-[35%]">
              {selectedVideo ? (
                <VideoSidebar
                  video={selectedVideo}
                  onClose={handleCloseSidebar}
                />
              ) : (
                <div className="bg-white rounded-xl shadow-lg h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <Globe className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Select a Video
                    </h3>
                    <p className="text-gray-600">
                      Click on any marker on the globe to view video details here.
                    </p>
                    <div className="mt-4 text-sm text-gray-500">
                      {videos.length} videos worldwide
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Wall View */
          <div className="bg-white rounded-xl shadow-lg">
            {/* Filters */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Advice Wall</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant={showFilters ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                  {pagination && (
                    <div className="text-sm text-gray-500">
                      {pagination.total} videos
                    </div>
                  )}
                </div>
              </div>

              {showFilters && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Platform</label>
                      <Select value={platformFilter} onValueChange={setPlatformFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All platforms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All platforms</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Tags</label>
                      <Input
                        placeholder="Enter tags (comma-separated)"
                        value={tagsFilter}
                        onChange={(e) => setTagsFilter(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <Input
                        placeholder="Search by location"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleFilterChange}
                      className="flex items-center gap-2"
                    >
                      <Search className="h-4 w-4" />
                      Apply Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Video Grid */}
            <div className="p-6">
              {videos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🌍</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No videos found</h3>
                  <p className="text-gray-600 mb-4">
                    {platformFilter || tagsFilter || locationFilter
                      ? 'Try adjusting your filters to see more results.'
                      : 'No advice has been shared yet. Check back soon!'}
                  </p>
                  {(platformFilter || tagsFilter || locationFilter) && (
                    <Button onClick={clearFilters} variant="outline">
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {videos.map((video) => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.pages > 1 && (
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1 || isLoading}
                      >
                        Previous
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                          let page: number
                          if (pagination.pages <= 5) {
                            page = i + 1
                          } else if (currentPage <= 3) {
                            page = i + 1
                          } else if (currentPage >= pagination.pages - 2) {
                            page = pagination.pages - 4 + i
                          } else {
                            page = currentPage - 2 + i
                          }

                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              disabled={isLoading}
                              className="w-8"
                            >
                              {page}
                            </Button>
                          )
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === pagination.pages || isLoading}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
