
import { Editor } from "@/components/editor/Editor"
import { Sidebar } from "@/components/sidebar/Sidebar"
import { RightSidebar } from "@/components/sidebar/RightSidebar" // Add import
import { UserProfile } from "@/components/UserProfile" // Import UserProfile
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-black dark:to-slate-900 overflow-hidden flex">
      {/* Background Glass Pane Effect (Global Overlay) */}
      <div className="absolute inset-0 pointer-events-none bg-white/30 dark:bg-black/20" />

      {/* Left Sidebar */}
      <div className="z-10 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area (Writer's Canvas) */}
      <main className="flex-1 relative overflow-y-auto scroll-smooth z-0">
        {/* Top Navigation / Toolbar (Floating) */}
        <div className="sticky top-0 z-20 px-8 py-4 flex items-center justify-end pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2">
            <UserProfile /> {/* New Auth Button */}
            <Button variant="ghost" className="rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md shadow-sm">
              <Users className="w-4 h-4 mr-2" />
              協作 (0)
            </Button>
            <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30">
              發布
            </Button>
          </div>
        </div>

        {/* The Editor (Paper) */}
        <div className="px-4 pb-20">
          <Editor />
        </div>
      </main>

      {/* Right Sidebar */}
      <div className="flex-shrink-0 z-10 transition-all duration-300">
        <RightSidebar />
      </div>
    </div>
  )
}
