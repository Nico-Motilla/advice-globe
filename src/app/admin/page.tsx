'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AdminForm from '@/components/AdminForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Globe, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  MapPin, 
  Calendar,
  ExternalLink,
  AlertCircle
} from 'lucide-react'

interface User {
  id: string
  email: string
  role: string
}

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

async function fetchUser(): Promise<User> {
  const response = await fetch('/api/auth/me')
  if (!response.ok) {
    throw new Error('Not authenticated')
  }
  return response.json()
}

async function fetchVideos(): Promise<Video[]> {
  const response = await fetch('/api/videos?limit=100')
  if (!response.ok) {
    throw new Error('Failed to fetch videos')
  }
  const data = await response.json()
  return data.videos
}

async function deleteVideo(id: string): Promise<void> {
  const response = await fetch(`/api/videos/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) {
    throw new Error('Failed to delete video')
  }
}

async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' })
}

export default function AdminPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    retry: false
  })

  const { data: videos = [], isLoading: videosLoading, error: videosError } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos,
    enabled: !!user
  })

  const deleteMutation = useMutation({
    mutationFn: deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
      setDeletingId(null)
    },
    onError: (error) => {
      console.error('Delete error:', error)
      setDeletingId(null)
    }
  })

  useEffect(() => {
    if (userError) {
      router.push('/auth/login')
    }
  }, [userError, router])

  const handleLogout = async () => {
    await logout()
    router.push('/auth/login')
  }

  const handleEdit = (video: Video) => {
    setEditingVideo(video)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      setDeletingId(id)
      deleteMutation.mutate(id)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingVideo(null)
    queryClient.invalidateQueries({ queryKey: ['videos'] })
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingVideo(null)
  }

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <AdminForm
            video={editingVideo}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Globe className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-600">Manage Advice Globe content</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Videos</h2>
            <p className="text-sm text-gray-600 mt-1">
              {videos.length} videos in the database
            </p>
          </div>
          
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Video
          </Button>
        </div>

        {videosLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading videos...</p>
          </div>
        ) : videosError ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">Failed to load videos</p>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['videos'] })}>
              Retry
            </Button>
          </div>
        ) : videos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <CardTitle className="text-lg text-gray-600 mb-2">No videos yet</CardTitle>
              <CardDescription className="mb-4">
                Get started by adding your first video to the advice globe
              </CardDescription>
              <Button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add First Video
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card key={video.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge
                      className={`
                        ${video.platform === 'youtube' ? 'bg-red-500' : ''}
                        ${video.platform === 'tiktok' ? 'bg-black' : ''}
                        ${video.platform === 'instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}
                        text-white text-xs
                      `}
                    >
                      {video.platform.toUpperCase()}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(video)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(video.id)}
                        disabled={deletingId === video.id}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {deletingId === video.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight line-clamp-2">
                    {video.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {video.description}
                  </p>

                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{video.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      {new Date(video.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {video.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
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

                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Original
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}