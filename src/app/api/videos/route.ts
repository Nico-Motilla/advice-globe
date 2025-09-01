import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const platform = searchParams.get('platform')
    const tags = searchParams.get('tags')?.split(',')
    const location = searchParams.get('location')

    const skip = (page - 1) * limit

    const where: Record<string, string | { hasSome: string[] } | { contains: string; mode: string }> = {}
    if (platform) where.platform = platform
    if (tags && tags.length > 0) where.tags = { hasSome: tags }
    if (location) where.location = { contains: location, mode: 'insensitive' }

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.video.count({ where })
    ])

    return NextResponse.json({
      videos,
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