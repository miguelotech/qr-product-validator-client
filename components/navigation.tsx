"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/")

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <img src="/logo.png" alt="Molino el Cholo logo" className=" w-6 h-6"/>
              <span>Molino el Cholo</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
