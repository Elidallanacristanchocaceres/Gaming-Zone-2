"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"

const getRandomColor = () => {
  const letters = "0123456789ABCDEF"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

type Difficulty = "fácil" | "intermedio" | "difícil" | "experto"

const LEVELS: Record<Difficulty, { size: number; words: string[] }> = {
  fácil: {
    size: 8,
    words: ["ESPAÑA", "MÉXICO", "PERÚ", "CHILE", "CUBA", "BRASIL", "ITALIA", "FRANCIA"],
  },
  intermedio: {
    size: 10,
    words: ["COLOMBIA", "ARGENTINA", "ECUADOR", "CULTURA", "IDIOMA", "FIESTA", "TANGO"],
  },
  difícil: {
    size: 12,
    words: ["SUPERMAN", "SPIDERMAN", "WONDERWOMAN", "WOLVERINE", "SHAZAM", "MAGNETO", "DOCTORDOOM", "THANOS", "FLASH"],
  },
  experto: {
    size: 15,
    words: [
      "MARRUECOS",
      "SUDAFRICA",
      "ZIMBABUE",
      "PAKISTAN",
      "REINOUNIDO",
      "PAISESBAJOS",
      "ARGENTINA",
      "SIERRALEONA",
      "MADAGASCAR",
      "LIBERIA",
      "NIGERIA",
      "NORUEGA",
      "PORTUGAL",
      "ESLOVENIA",
    ],
  },
}

const WordSearch: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("fácil")
  const [grid, setGrid] = useState<string[][]>([])
  const [foundWords, setFoundWords] = useState<{ word: string; color: string; found: boolean }[]>([])
  const [foundCells, setFoundCells] = useState<{ [key: number]: string }>({})
  const [showMenu, setShowMenu] = useState(true)
  const [timer, setTimer] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedCells, setSelectedCells] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGameReady, setIsGameReady] = useState(false)
  const gridRef = useRef<string[][]>([])

  useEffect(() => {
    if (!showMenu && !isLoading) {
      setTimer(0)
      setIsGameReady(true)
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [showMenu, isLoading])

  const initializeGrid = useCallback(async (currentDifficulty: Difficulty) => {
    try {
      setIsLoading(true)
      const { size, words } = LEVELS[currentDifficulty]
      const newGrid: string[][] = Array(size)
        .fill(null)
        .map(() => Array(size).fill(""))

      for (const word of words) {
        await new Promise((resolve) => setTimeout(resolve, 0))
        placeWord(newGrid, word)
      }
      fillEmptyCells(newGrid)

      gridRef.current = newGrid
      setGrid(newGrid)
      setFoundWords(words.map((word) => ({ word, color: "", found: false })))
      setFoundCells({})
      setSelectedCells([])
      setScore(0)
    } catch (error) {
      console.error("Error initializing grid:", error)
      alert("Hubo un problema al iniciar el juego. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
      setShowMenu(false)
    }
  }, [])

  const placeWord = (grid: string[][], word: string) => {
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [-1, 1],
      [0, -1],
      [-1, 0],
      [-1, -1],
      [1, -1],
    ]

    let placed = false
    while (!placed) {
      const direction = directions[Math.floor(Math.random() * directions.length)]
      const [dx, dy] = direction

      const startX = Math.floor(Math.random() * grid.length)
      const startY = Math.floor(Math.random() * grid.length)

      if (canPlaceWord(grid, word, startX, startY, dx, dy)) {
        for (let i = 0; i < word.length; i++) {
          grid[startX + i * dx][startY + i * dy] = word[i]
        }
        placed = true
      }
    }
  }

  const canPlaceWord = (grid: string[][], word: string, startX: number, startY: number, dx: number, dy: number) => {
    const size = grid.length
    if (startX + word.length * dx > size || startX + word.length * dx < 0) return false
    if (startY + word.length * dy > size || startY + word.length * dy < 0) return false

    for (let i = 0; i < word.length; i++) {
      const cellContent = grid[startX + i * dx][startY + i * dy]
      if (cellContent !== "" && cellContent !== word[i]) return false
    }

    return true
  }

  const fillEmptyCells = (grid: string[][]) => {
    const letters = "AÁBCDEÉFGHIÍJKLMNÑOÓPQRSTUÚVWXYZ"
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === "") {
          grid[i][j] = letters[Math.floor(Math.random() * letters.length)]
        }
      }
    }
  }

  const checkWord = useCallback(
    (selection: number[]) => {
      if (selection.length < 2) return false

      const selectedLetters = selection.map((index) => {
        const row = Math.floor(index / gridRef.current.length)
        const col = index % gridRef.current.length
        return gridRef.current[row][col]
      })

      const sortedSelectedLetters = selectedLetters.sort().join("")
      const foundWord = LEVELS[difficulty].words.find(
        (word) => word.split("").sort().join("") === sortedSelectedLetters,
      )

      if (foundWord) {
        const wordColor = getRandomColor()

        setFoundWords((prev) => {
          const newFoundWords = prev.map((fw) =>
            fw.word === foundWord ? { ...fw, color: wordColor, found: true } : fw,
          )
          const allWordsFound = newFoundWords.every((fw) => fw.found)
          if (allWordsFound) {
            alert(
              `¡Felicidades! Has encontrado todas las palabras.\n\nNivel: ${difficulty}\nTiempo: ${timer} segundos\nPuntuación: ${score}`,
            )
          }
          return newFoundWords
        })

        setFoundCells((prev) => {
          const newFoundCells = { ...prev }
          selection.forEach((index) => {
            newFoundCells[index] = wordColor
          })
          return newFoundCells
        })

        setScore((prevScore) => prevScore + foundWord.length * 10)
        setSelectedCells([])
        return true
      }
      return false
    },
    [difficulty, timer, score],
  )

  const handleCellClick = useCallback(
    (index: number) => {
      setSelectedCells((prev) => {
        if (prev.includes(index)) {
          const newSelection = prev.filter((cellIndex) => cellIndex !== index)
          return newSelection
        }

        const newSelection = [...prev, index]
        if (newSelection.length >= 2) {
          const wordFound = checkWord(newSelection)
          if (!wordFound) {
            return newSelection
          }
          return []
        }

        return newSelection
      })
    },
    [checkWord],
  )

  const nextLevel = useCallback(() => {
    const levels: Difficulty[] = ["fácil", "intermedio", "difícil", "experto"]
    const currentIndex = levels.indexOf(difficulty)
    if (currentIndex < levels.length - 1) {
      const newDifficulty = levels[currentIndex + 1] as Difficulty
      setDifficulty(newDifficulty)
      setShowMenu(false)
      initializeGrid(newDifficulty)
    } else {
      alert("¡Felicidades! Has completado todos los niveles.")
      setShowMenu(true)
    }
  }, [difficulty, initializeGrid])

  const renderMenu = () => (
    <div className="w-full max-w-md mx-auto bg-card p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center text-primary mb-6">Sopa de Letras</h1>
      <p className="text-lg text-center mb-6 text-primary">Selecciona la dificultad:</p>
      <div className="space-y-4">
        {(Object.keys(LEVELS) as Difficulty[]).map((level) => (
          <button
            key={level}
            className={`w-full py-4 ${difficulty === level ? "bg-accent" : "bg-secondary"} hover:bg-secondary/90 text-white font-bold rounded-lg`}
            onClick={() => {
              setIsLoading(true)
              setDifficulty(level)
              initializeGrid(level).catch((error) => {
                console.error("Error initializing game:", error)
                setIsLoading(false)
                setShowMenu(true)
                alert("No se pudo iniciar el juego. Por favor, inténtalo de nuevo.")
              })
            }}
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )

  const renderGame = () => {
    const size = LEVELS[difficulty].size
    const cellSize = Math.min(500 / size, 40)

    return (
      <div className="w-full max-w-4xl mx-auto bg-card p-6 rounded-xl shadow-lg">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-xl text-primary">Cargando...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-primary mb-2">Sopa de Letras</h1>
              <p className="text-lg text-primary mb-2">Nivel: {difficulty}</p>
              <div className="flex justify-between max-w-xs mx-auto">
                <p className="text-primary">Tiempo: {timer}s</p>
                <p className="text-primary">Puntuación: {score}</p>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <div
                className="grid gap-1 border border-border p-2 rounded-lg"
                style={{
                  gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
                  gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
                }}
              >
                {gridRef.current.flatMap((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const index = rowIndex * gridRef.current.length + colIndex
                    const isSelected = selectedCells.includes(index)
                    const foundColor = foundCells[index]
                    return (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        className={`flex items-center justify-center font-bold text-sm transition-colors ${
                          isSelected && !foundColor
                            ? "bg-secondary text-white"
                            : foundColor
                              ? ""
                              : "bg-muted hover:bg-muted/80"
                        }`}
                        style={foundColor ? { backgroundColor: foundColor, color: "white" } : {}}
                        onClick={() => handleCellClick(index)}
                      >
                        {cell}
                      </button>
                    )
                  }),
                )}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {foundWords.map(({ word, color, found }) => (
                  <span
                    key={word}
                    className={`px-2 py-1 rounded ${found ? "line-through" : "bg-muted"}`}
                    style={found ? { backgroundColor: color, color: "white" } : {}}
                  >
                    {word}
                  </span>
                ))}
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => initializeGrid(difficulty)}
                  className="bg-secondary hover:bg-secondary/90 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Reiniciar
                </button>

                <button
                  onClick={() => setShowMenu(true)}
                  className="bg-accent hover:bg-accent/90 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Cambiar Nivel
                </button>

                <Link href="/">
                  <button className="border-2 border-primary text-primary hover:bg-primary/10 font-bold py-2 px-4 rounded-lg">
                    Menú Principal
                  </button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="w-full">
      {showMenu ? (
        renderMenu()
      ) : isLoading ? (
        <div className="w-full max-w-md mx-auto bg-card p-8 rounded-xl shadow-lg flex items-center justify-center h-64">
          <p className="text-xl text-primary">Cargando...</p>
        </div>
      ) : isGameReady ? (
        renderGame()
      ) : null}
    </div>
  )
}

export default WordSearch