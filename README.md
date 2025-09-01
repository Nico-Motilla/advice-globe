# Advice Globe Webapp

A full-stack web application that allows users to explore advice shared around the world through an interactive 3D globe and filterable wall view.

## 🌟 Features

- **Interactive 3D Globe**: Explore advice from around the world with Mapbox GL JS
- **Advice Wall**: Grid view with filterable and paginatable video cards
- **Admin Panel**: Secure content management with CRUD operations
- **Authentication**: JWT-based auth with password recovery via email
- **Multi-platform Support**: YouTube, TikTok, and Instagram video integration
- **Responsive Design**: Modern UI with TailwindCSS and Shadcn UI

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first styling
- **Shadcn UI** - Component library
- **Mapbox GL JS** - Interactive 3D globe
- **React Query** - Data fetching and state management

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma ORM** - Database management
- **PostgreSQL** - Primary database
- **JWT + bcrypt** - Authentication
- **Nodemailer** - Email functionality

### Deployment
- **Vercel** - Hosting platform
- **GitHub** - Version control and CI/CD

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Mapbox account (for globe functionality)
- Gmail account with App Password (for email features)

## 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd advice-globe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Copy `.env.example` to `.env.local` and fill in the required values:
   ```bash
   cp .env.example .env.local
   ```

   Required environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/advice_globe"
   
   # Authentication
   JWT_SECRET="your-super-secret-jwt-key-here"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Email Configuration
   GMAIL_USER="your-email@gmail.com"
   GMAIL_PASS="your-app-specific-password"
   
   # Mapbox
   NEXT_PUBLIC_MAPBOX_TOKEN="pk.your-mapbox-token-here"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── auth/         # Authentication endpoints
│   │   └── videos/       # Video CRUD endpoints
│   ├── admin/            # Admin panel
│   ├── auth/             # Authentication pages
│   ├── map/              # 3D Globe view
│   ├── wall/             # Advice Wall view
│   └── layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── ui/               # Shadcn UI components
│   ├── Globe.tsx         # 3D Globe component
│   ├── VideoCard.tsx     # Video card component
│   ├── VideoSidebar.tsx  # Video details sidebar
│   └── AdminForm.tsx     # Admin video form
├── lib/                  # Utility libraries
│   ├── auth.ts          # Authentication utilities
│   ├── mailer.ts        # Email functionality
│   └── prisma.ts        # Prisma client
└── prisma/              # Database schema
    └── schema.prisma
```

## 🎯 Usage

### Adding Videos
1. Go to `/admin` and log in with admin credentials
2. Click "Add New Video" to create content
3. Fill in video details including location coordinates
4. Videos will appear on both the globe and wall views

### Globe Navigation
- **Zoom**: Mouse wheel or touch gestures
- **Rotate**: Click and drag
- **Click pins**: View video details in sidebar

### Advice Wall Filtering
- Filter by platform (YouTube, TikTok, Instagram)
- Search by tags or location
- Pagination for large datasets

## 🔐 Security Features

- JWT-based authentication with HttpOnly cookies
- Password hashing with bcrypt
- Protected admin routes
- Email-based password recovery
- Input validation and sanitization

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy your app

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current user

### Video Endpoints
- `GET /api/videos` - List videos (with pagination/filtering)
- `POST /api/videos` - Create video (admin only)
- `PUT /api/videos/[id]` - Update video (admin only)
- `DELETE /api/videos/[id]` - Delete video (admin only)

## 🌐 Future Features

The project is designed to support future social media integration:
- Direct video uploads to platforms
- OAuth2 integration for YouTube, TikTok, Instagram
- Automated content publishing
- Upload status tracking

---

Built with ❤️ using Next.js, Prisma, and Mapbox GL JS
