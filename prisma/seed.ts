import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  const adminEmail = 'admin@adviceglobe.com'
  const adminPassword = 'admin123' // Change this password!

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (existingAdmin) {
    console.log('👤 Admin user already exists:', adminEmail)
  } else {
    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hashedPassword,
        role: 'admin'
      }
    })

    console.log('✅ Created admin user:', {
      id: admin.id,
      email: admin.email,
      role: admin.role
    })
  }

  // Create sample videos
  const sampleVideos = [
    {
      title: "Life Advice from Tokyo",
      description: "A heartwarming message about finding balance in life, shared from the bustling streets of Tokyo. This video explores the Japanese concept of Ikigai and how to find your life's purpose.",
      platform: "youtube",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      tags: ["life-advice", "balance", "ikigai", "japan"],
      location: "Tokyo, Japan",
      lat: 35.6762,
      lng: 139.6503
    },
    {
      title: "Wisdom from New York",
      description: "Street wisdom from the Big Apple about pursuing your dreams and never giving up. A motivational message from someone who made it in the city that never sleeps.",
      platform: "tiktok",
      url: "https://www.tiktok.com/@example/video/1234567890",
      tags: ["motivation", "dreams", "nyc", "success"],
      location: "New York, USA",
      lat: 40.7128,
      lng: -74.0060
    },
    {
      title: "Mindfulness from Bali",
      description: "Peaceful advice about living in the moment and appreciating nature, shared from the beautiful beaches of Bali. Learn about mindfulness practices and meditation.",
      platform: "instagram",
      url: "https://www.instagram.com/p/example123/",
      tags: ["mindfulness", "nature", "meditation", "bali"],
      location: "Bali, Indonesia",
      lat: -8.4095,
      lng: 115.1889
    },
    {
      title: "Startup Advice from London",
      description: "Entrepreneurial wisdom from London's tech scene. Tips on building a startup, managing team, and staying resilient through challenges.",
      platform: "youtube",
      url: "https://www.youtube.com/watch?v=example456",
      tags: ["entrepreneurship", "startup", "business", "london"],
      location: "London, UK",
      lat: 51.5074,
      lng: -0.1278
    },
    {
      title: "Family Values from Mumbai",
      description: "Touching advice about family relationships and cultural values, shared from the vibrant city of Mumbai. How to balance tradition with modern life.",
      platform: "youtube",
      url: "https://www.youtube.com/watch?v=example789",
      tags: ["family", "values", "culture", "mumbai"],
      location: "Mumbai, India",
      lat: 19.0760,
      lng: 72.8777
    }
  ]

  // Create sample videos if they don't exist
  for (const videoData of sampleVideos) {
    const existingVideo = await prisma.video.findFirst({
      where: { title: videoData.title }
    })

    if (!existingVideo) {
      const video = await prisma.video.create({
        data: videoData
      })
      console.log('📹 Created sample video:', video.title)
    } else {
      console.log('📹 Video already exists:', videoData.title)
    }
  }

  console.log('\n🎉 Seed completed successfully!')
  console.log('\n📋 Login credentials:')
  console.log('Email: admin@adviceglobe.com')
  console.log('Password: admin123')
  console.log('\n🚀 Start the app with: npm run dev')
  console.log('🔐 Login at: http://localhost:3000/admin')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })