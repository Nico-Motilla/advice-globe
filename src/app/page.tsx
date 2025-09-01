import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe, Grid3X3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
            Explore Advice From Around The World
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover wisdom and insights shared by people across the globe. 
            Choose your way to explore the world of advice.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/map">
            <Button 
              size="lg" 
              className="h-16 px-8 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 min-w-[200px]"
            >
              <Globe className="h-8 w-8" />
              MapVlog
            </Button>
          </Link>
          
          <Link href="/wall">
            <Button 
              size="lg"
              variant="outline" 
              className="h-16 px-8 text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 min-w-[200px]"
            >
              <Grid3X3 className="h-8 w-8" />
              Wall-Advice
            </Button>
          </Link>
        </div>
        
        <div className="text-sm text-gray-500 mt-8">
          <p>🌍 Interactive 3D Globe • 🧱 Filterable Advice Wall</p>
        </div>
      </div>
    </div>
  );
}
