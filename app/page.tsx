"use client"

import { useState, useEffect } from "react"
import MainMenu from "@/components/main-menu"
import SplashScreen from "@/components/splash-screen"

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2500) // Muestra el splash screen por 2.5 segundos

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="bg-purple-200 min-h-screen flex items-center justify-center">
      {showSplash ? <SplashScreen /> : <MainMenu />}
    </main>
  )
}

