'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Globe, Shield } from 'lucide-react'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Globe className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">Advice Globe</span>
        </Link>
        
        <Link href="/admin">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Admin
          </Button>
        </Link>
      </div>
    </header>
  )
}