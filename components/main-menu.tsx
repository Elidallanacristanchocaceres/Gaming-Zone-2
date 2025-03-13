"use client"

import type React from "react"
import Link from "next/link"
import { motion } from "framer-motion"

const MainMenu: React.FC = () => {
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-8 rounded-xl bg-card shadow-lg"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-4xl font-bold mb-8 text-primary"
      >
        Variety Games
      </motion.h1>

      <div className="flex flex-col gap-4 w-full max-w-md">
        {[
          { href: "/memory-game", text: "Juego de Memoria" },
          { href: "/sliding-puzzle", text: "Juego de Puzzle" },
          { href: "/word-search", text: "Sopa de Letras" },
        ].map((game, index) => (
          <motion.div key={game.href} variants={buttonVariants} initial="hidden" animate="visible" custom={index}>
            <Link href={game.href} className="w-full block">
              <button className="w-full py-6 text-lg bg-secondary hover:bg-secondary/90 text-white font-bold rounded-lg transition-colors duration-300">
                {game.text}
              </button>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default MainMenu

