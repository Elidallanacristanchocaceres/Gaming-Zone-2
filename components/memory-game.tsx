"use client"

import React from "react"
import { Unlock, Lock } from "lucide-react"
import Link from "next/link"

const CARDS_BY_LEVEL = {
  1: ["🐶", "🐱", "🐭", "🦊"],
  2: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐴", "🦁"],
  3: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐵", "🐴", "🐸"],
  4: [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐯",
    "🦁",
    "🐮",
    "🐣",
    "🐥",
    "🐸",
    "🦜",
    "🐵",
    "🦉",
    "🐨",
    "🐴",
    "🐢",
    "🐨",
  ],
  5: [
    "💦",
    "🐠",
    "🐭",
    "🌞",
    "🐬",
    "🦊",
    "🐙",
    "🐞",
    "🐨",
    "🐯",
    "🦁",
    "🏝️",
    "🐣",
    "🐥",
    "🐸",
    "🦜",
    "🐵",
    "🦉",
    "🐱",
    "🐢",
    "🐶",
  ],
}

const MemoryGame: React.FC = () => {
  const [gameState, setGameState] = React.useState({
    level: 1,
    cards: [] as string[],
    flipped: [] as number[],
    solved: [] as number[],
    moves: 0,
    disabled: false,
    showMenu: true,
    unlockedLevels: 1,
  })

  React.useEffect(() => {
    loadUnlockedLevels()
  }, [])

  const loadUnlockedLevels = () => {
    const savedUnlockedLevels = localStorage.getItem("unlockedLevels")
    if (savedUnlockedLevels) {
      setGameState((prev) => ({ ...prev, unlockedLevels: Number(savedUnlockedLevels) }))
    }
  }

  const initializeGame = (level: number) => {
    const cards = CARDS_BY_LEVEL[level as keyof typeof CARDS_BY_LEVEL]
    const shuffledCards = [...cards, ...cards].sort(() => Math.random() - 0.5)

    setGameState((prev) => ({
      ...prev,
      level,
      cards: shuffledCards,
      flipped: [],
      solved: [],
      moves: 0,
      disabled: false,
      showMenu: false,
    }))
  }

  const handleCardClick = (index: number) => {
    if (gameState.disabled || gameState.solved.includes(index) || gameState.flipped.includes(index)) {
      return
    }

    setGameState((prev) => {
      const newFlipped = [...prev.flipped, index]
      const newState = { ...prev, flipped: newFlipped, moves: prev.moves + 1 }

      if (newFlipped.length === 2) {
        const [firstIndex, secondIndex] = newFlipped
        if (prev.cards[firstIndex] === prev.cards[secondIndex]) {
          newState.solved = [...prev.solved, firstIndex, secondIndex]
          newState.flipped = []
        } else {
          newState.disabled = true
          setTimeout(() => {
            setGameState((prevState) => ({ ...prevState, flipped: [], disabled: false }))
          }, 1000)
        }
      }

      return newState
    })
  }

  const handleNextLevel = () => {
    const nextLevel = gameState.level + 1
    if (nextLevel <= 5) {
      initializeGame(nextLevel)
      if (nextLevel > gameState.unlockedLevels) {
        setGameState((prev) => ({ ...prev, unlockedLevels: nextLevel }))
        localStorage.setItem("unlockedLevels", nextLevel.toString())
      }
    } else {
      setGameState((prev) => ({ ...prev, showMenu: true }))
    }
  }

  const LockIcon = ({ isLocked }: { isLocked: boolean }) => {
    return isLocked ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />
  }

  if (gameState.showMenu) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-card p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-primary mb-8">Juego de Memoria</h1>
        <div className="space-y-4 w-full">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => initializeGame(level)}
              className={`w-full flex justify-between items-center p-4 rounded-lg text-white font-bold ${
                level > gameState.unlockedLevels
                  ? "bg-secondary/50 cursor-not-allowed"
                  : "bg-secondary hover:bg-secondary/90"
              }`}
              disabled={level > gameState.unlockedLevels}
            >
              <span>
                Nivel {level} {level === 1 ? "(Fácil)" : level === 2 ? "(Medio)" : "(Difícil)"}
              </span>
              <LockIcon isLocked={level > gameState.unlockedLevels} />
            </button>
          ))}
        </div>
      </div>
    )
  }

  const isLevelCompleted = gameState.solved.length === gameState.cards.length
  const gridCols = gameState.level === 1 ? "grid-cols-4" : gameState.level === 2 ? "grid-cols-5" : "grid-cols-6"

  return (
    <div className="w-full max-w-4xl mx-auto bg-card p-6 rounded-xl shadow-lg">
      <div className="flex flex-col items-center">
        <div className={`grid ${gridCols} gap-3 mb-6 mx-auto`}>
          {gameState.cards.map((card, index) => (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-lg text-2xl md:text-3xl transition-all duration-300 ${
                gameState.flipped.includes(index) || gameState.solved.includes(index)
                  ? "bg-muted rotate-y-180"
                  : "bg-accent text-accent-foreground"
              } ${gameState.solved.includes(index) ? "opacity-60" : ""}`}
              disabled={gameState.disabled}
            >
              {gameState.flipped.includes(index) || gameState.solved.includes(index) ? card : ""}
            </button>
          ))}
        </div>

        <p className="text-lg mb-6 text-primary">Movimientos: {gameState.moves}</p>

        <div className="space-y-3 w-full max-w-md">
          {isLevelCompleted ? (
            <button
              onClick={handleNextLevel}
              className="w-full py-4 bg-accent hover:bg-accent/90 text-white font-bold rounded-lg"
            >
              {gameState.level === 5 ? "Volver al Menú" : "Siguiente Nivel"}
            </button>
          ) : (
            <>
              <button
                onClick={() => initializeGame(gameState.level)}
                className="w-full py-4 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-lg"
              >
                Reiniciar Nivel
              </button>
              <button
                onClick={() => setGameState((prev) => ({ ...prev, showMenu: true }))}
                className="w-full py-4 border-2 border-accent text-accent hover:bg-accent/10 font-bold rounded-lg"
              >
                Volver al Menú
              </button>
            </>
          )}

          <Link href="/" className="block w-full">
            <button className="w-full py-4 border-2 border-primary text-primary hover:bg-primary/10 font-bold rounded-lg">
              Menú Principal
            </button>
          </Link>
        </div>

        {isLevelCompleted && (
          <p className="mt-6 text-lg font-bold text-accent text-center">
            ¡Felicidades! Has completado el nivel {gameState.level} en {gameState.moves} movimientos.
            {gameState.level < 5 && " ¡Prepárate para el siguiente nivel!"}
          </p>
        )}
      </div>
    </div>
  )
}

export default MemoryGame

