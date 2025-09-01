import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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

    const video = await prisma.video.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(platform && { platform }),
        ...(url && { url }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(tags && { tags }),
        ...(location && { location }),
        ...(lat !== undefined && { lat }),
        ...(lng !== undefined && { lng })
      }
    })

    return NextResponse.json(video)
  } catch (error) {
    console.error('Videos PUT error:', error)
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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

    await prisma.video.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Video deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Videos DELETE error:', error)
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