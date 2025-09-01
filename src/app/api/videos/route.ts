import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // Return static sample data for now
    const sampleVideos = [
      {
        id: "1",
        title: "Life Advice from Tokyo",
        description: "A heartwarming message about finding balance in life, shared from the bustling streets of Tokyo. This video explores the Japanese concept of Ikigai and how to find your life's purpose.",
        platform: "youtube",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        tags: ["life-advice", "balance", "ikigai", "japan"],
        location: "Tokyo, Japan",
        lat: 35.6762,
        lng: 139.6503,
        createdAt: "2024-01-15T10:30:00Z"
      },
      {
        id: "2",
        title: "Wisdom from New York",
        description: "Street wisdom from the Big Apple about pursuing your dreams and never giving up. A motivational message from someone who made it in the city that never sleeps.",
        platform: "tiktok",
        url: "https://www.tiktok.com/@example/video/1234567890",
        thumbnail: null,
        tags: ["motivation", "dreams", "nyc", "success"],
        location: "New York, USA",
        lat: 40.7128,
        lng: -74.0060,
        createdAt: "2024-01-14T15:45:00Z"
      },
      {
        id: "3",
        title: "Mindfulness from Bali",
        description: "Peaceful advice about living in the moment and appreciating nature, shared from the beautiful beaches of Bali. Learn about mindfulness practices and meditation.",
        platform: "instagram",
        url: "https://www.instagram.com/p/example123/",
        thumbnail: null,
        tags: ["mindfulness", "nature", "meditation", "bali"],
        location: "Bali, Indonesia",
        lat: -8.4095,
        lng: 115.1889,
        createdAt: "2024-01-13T09:20:00Z"
      },
      {
        id: "4",
        title: "Startup Advice from London",
        description: "Entrepreneurial wisdom from London's tech scene. Tips on building a startup, managing team, and staying resilient through challenges.",
        platform: "youtube",
        url: "https://www.youtube.com/watch?v=example456",
        thumbnail: null,
        tags: ["entrepreneurship", "startup", "business", "london"],
        location: "London, UK",
        lat: 51.5074,
        lng: -0.1278,
        createdAt: "2024-01-12T14:10:00Z"
      },
      {
        id: "5",
        title: "Family Values from Mumbai",
        description: "Touching advice about family relationships and cultural values, shared from the vibrant city of Mumbai. How to balance tradition with modern life.",
        platform: "youtube",
        url: "https://www.youtube.com/watch?v=example789",
        thumbnail: null,
        tags: ["family", "values", "culture", "mumbai"],
        location: "Mumbai, India",
        lat: 19.0760,
        lng: 72.8777,
        createdAt: "2024-01-11T11:30:00Z"
      }
    ]

    // Apply filters
    const platform = searchParams.get('platform')
    const tags = searchParams.get('tags')?.split(',')
    const location = searchParams.get('location')

    let filteredVideos = sampleVideos

    if (platform) {
      filteredVideos = filteredVideos.filter(video => video.platform === platform)
    }

    if (tags && tags.length > 0) {
      filteredVideos = filteredVideos.filter(video => 
        tags.some(tag => video.tags.includes(tag))
      )
    }

    if (location) {
      filteredVideos = filteredVideos.filter(video => 
        video.location.toLowerCase().includes(location.toLowerCase())
      )
    }

    // Pagination
    const skip = (page - 1) * limit
    const paginatedVideos = filteredVideos.slice(skip, skip + limit)
    const total = filteredVideos.length

    return NextResponse.json({
      videos: paginatedVideos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Videos GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const {
      title,
      description,
      platform,
      url,
      thumbnail,
      tags,
      location,
      lat,
      lng
    } = await request.json()

    if (!title || !description || !platform || !url || !location || lat === undefined || lng === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        platform,
        url,
        thumbnail,
        tags: tags || [],
        location,
        lat,
        lng
      }
    })

    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error('Videos POST error:', error)
    if (error instanceof Error && error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Invalid authorization token' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}