"use client"

import { motion } from "framer-motion"
import { useEffect, useState, useMemo, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { clearAuthToken } from "@/lib/auth"
import {
  Board24Regular,
  Add24Regular,
  Box24Regular,
  SignOut24Regular,
  WeatherMoon24Regular,
  WeatherSunny24Regular,
  History24Regular,
  FolderAdd24Regular,
  Folder24Regular,
} from "@fluentui/react-icons"

type PageType = "dashboard" | "add-product" | "add-category" | "categories" | "products" | "history"

interface MenuItem {
  label: string
  icon: React.ComponentType<{ className?: string }>
  page: PageType
  path: string
}

function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const prefersDark = document.documentElement.classList.contains("dark")
    setIsDark(prefersDark)
  }, [])

  // Determine current page from pathname
  const currentPage = useMemo<PageType>(() => {
    if (pathname?.startsWith("/dashboard")) return "dashboard"
    if (pathname?.startsWith("/add-product")) return "add-product"
    if (pathname?.startsWith("/add-category")) return "add-category"
    if (pathname?.startsWith("/categories")) return "categories"
    if (pathname?.startsWith("/products")) return "products"
    if (pathname?.startsWith("/history")) return "history"
    return "dashboard"
  }, [pathname])

  const toggleTheme = useCallback(() => {
    const html = document.documentElement
    const newIsDark = !html.classList.contains("dark")

    if (newIsDark) {
      html.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      html.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }

    setIsDark(newIsDark)
  }, [])

  const handleLogout = useCallback(() => {
    clearAuthToken()
    window.location.reload()
  }, [])

  const handlePageChange = useCallback(
    (path: string) => {
      router.push(path)
    },
    [router],
  )

  const menuItems = useMemo<MenuItem[]>(
    () => [
      { label: "Dashboard", icon: Board24Regular, page: "dashboard", path: "/dashboard" },
      { label: "Add Product", icon: Add24Regular, page: "add-product", path: "/add-product" },
      { label: "Add Category", icon: FolderAdd24Regular, page: "add-category", path: "/add-category" },
      { label: "Categories", icon: Folder24Regular, page: "categories", path: "/categories" },
      { label: "Products", icon: Box24Regular, page: "products", path: "/products" },
      { label: "History", icon: History24Regular, page: "history", path: "/history" },
    ],
    [],
  )

  if (!mounted) {
    return (
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen fixed left-0 top-0 z-30">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold text-sidebar-primary">Guevara</h1>
          <p className="text-xs text-sidebar-foreground/60">Admin Dashboard</p>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen fixed left-0 top-0 z-30">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-primary">Guevara</h1>
        <p className="text-xs text-sidebar-foreground/60">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <motion.button
            key={item.page}
            onClick={() => handlePageChange(item.path)}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentPage === item.page
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </motion.button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-all"
        >
          {isDark ? (
            <>
              <WeatherSunny24Regular className="w-5 h-5" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <WeatherMoon24Regular className="w-5 h-5" />
              <span>Dark Mode</span>
            </>
          )}
        </motion.button>

        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-all"
        >
          <SignOut24Regular className="w-5 h-5" />
          <span>Logout</span>
        </motion.button>
      </div>
    </aside>
  )
}

export default Sidebar
