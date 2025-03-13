"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"

type Difficulty = "easy" | "medium" | "hard"

const GRID_SIZES: Record<Difficulty, number> = {
  easy: 3,
  medium: 4,
  hard: 5,
}

export const SlidingPuzzle: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [tiles, setTiles] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [showMenu, setShowMenu] = useState(true)

  useEffect(() => {
    if (!showMenu) {
      initializePuzzle()
    }
  }, [showMenu])

  const initializePuzzle = () => {
    const gridSize = GRID_SIZES[difficulty]
    const tileCount = gridSize * gridSize - 1
    const numbers = Array.from({ length: tileCount }, (_, i) => i + 1)
    const shuffled = shuffleArray([...numbers, 0])
    setTiles(shuffled)
    setMoves(0)
    setIsComplete(false)
  }

  const shuffleArray = (array: number[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  const moveTile = (index: number) => {
    const gridSize = GRID_SIZES[difficulty]
    const emptyIndex = tiles.indexOf(0)
    if (isAdjacent(index, emptyIndex, gridSize)) {
      const newTiles = [...tiles]
      ;[newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]]
      setTiles(newTiles)
      setMoves(moves + 1)
      checkCompletion(newTiles)
    }
  }

  const isAdjacent = (index1: number, index2: number, gridSize: number) => {
    const row1 = Math.floor(index1 / gridSize)
    const col1 = index1 % gridSize
    const row2 = Math.floor(index2 / gridSize)
    const col2 = index2 % gridSize
    return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1
  }

  const checkCompletion = (currentTiles: number[]) => {
    const isComplete = currentTiles.every((tile, index) => {
      if (index === currentTiles.length - 1) return tile === 0
      return tile === index + 1
    })
    setIsComplete(isComplete)
  }

  const renderMenu = () => (
    <div className="w-full max-w-md mx-auto bg-card p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center text-primary mb-6">Sliding Puzzle</h1>
      <p className="text-lg text-center mb-6 text-primary">Selecciona la dificultad:</p>
      <div className="space-y-4">
        {(["easy", "medium", "hard"] as Difficulty[]).map((level) => (
          <button
            key={level}
            className={`w-full py-4 ${difficulty === level ? "bg-accent" : "bg-secondary"} hover:bg-secondary/90 text-white font-bold rounded-lg`}
            onClick={() => {
              setDifficulty(level)
              setShowMenu(false)
            }}
          >
            {level === "easy" ? "Fácil" : level === "medium" ? "Intermedio" : "Difícil"}
          </button>
        ))}
      </div>
    </div>
  )

  const renderGame = () => {
    const gridSize = GRID_SIZES[difficulty]
    const gridTemplateColumns = `repeat(${gridSize}, minmax(0, 1fr))`

    return (
      <div className="w-full max-w-2xl mx-auto bg-card p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-primary mb-4">Sliding Puzzle</h1>
        <p className="text-lg text-center mb-6 text-primary">
          Nivel: {difficulty === "easy" ? "Fácil" : difficulty === "medium" ? "Intermedio" : "Difícil"}
        </p>

        <div
          className="grid gap-1 mb-6 mx-auto"
          style={{
            gridTemplateColumns,
            width: `${gridSize * 70}px`,
            maxWidth: "100%",
          }}
        >
          {tiles.map((tile, index) =>
            tile === 0 ? (
              <div key={index} className="aspect-square bg-muted rounded-lg" />
            ) : (
              <button
                key={index}
                onClick={() => moveTile(index)}
                className="aspect-square bg-accent text-white text-xl md:text-2xl font-bold flex items-center justify-center rounded-lg hover:bg-accent/90 transition-colors"
              >
                {tile}
              </button>
            ),
          )}
        </div>

        <p className="text-lg text-center mb-6 text-primary">Movimientos: {moves}</p>

        {isComplete && <p className="text-xl font-bold text-center text-accent mb-6">¡Puzzle Completado!</p>}

        <div className="space-y-3 max-w-md mx-auto">
          <button
            onClick={initializePuzzle}
            className="w-full py-4 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-lg"
          >
            Reiniciar
          </button>

          <button
            onClick={() => setShowMenu(true)}
            className="w-full py-4 bg-accent hover:bg-accent/90 text-white font-bold rounded-lg"
          >
            Cambiar Dificultad
          </button>

          <Link href="/" className="block w-full">
            <button className="w-full py-4 border-2 border-primary text-primary hover:bg-primary/10 font-bold rounded-lg">
              Volver al Menú Principal
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return showMenu ? renderMenu() : renderGame()
}