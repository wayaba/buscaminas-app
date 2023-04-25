import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { useState, useEffect } from 'react'

const NUM_MINES = 10
const BOARD_SIZE = 8

export default function Home() {
  const [board, setBoard] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [win, setWin] = useState(false)

  useEffect(() => {
    generateBoard()
  }, [])

  function generateBoard() {
    const newBoard = Array.from({ length: BOARD_SIZE }, (_, row) =>
      Array.from({ length: BOARD_SIZE }, (_, col) => ({
        row,
        col,
        isMine: false,
        isCovered: true,
        adjacentMines: 0
      }))
    ).flat()

    setBoard(newBoard)
    placeMines(newBoard)
    setGameOver(false)
    setWin(false)
  }

  function placeMines(newBoard) {
    let mines = 0
    while (mines < NUM_MINES) {
      const row = Math.floor(Math.random() * BOARD_SIZE)
      const col = Math.floor(Math.random() * BOARD_SIZE)
      const cell = newBoard.find(
        (cell) => cell.row === row && cell.col === col && cell.isMine !== true
      )
      if (cell) {
        cell.isMine = true
        mines++
      }
    }
    calculateAdjacentMines(newBoard)
  }

  function calculateAdjacentMines(newBoard) {
    newBoard
      .filter((cell) => !cell.isMine)
      .forEach((cell) => {
        const count = [-1, 0, 1].reduce((acc, ii) => {
          return (
            acc +
            [-1, 0, 1].reduce((acc, jj) => {
              const r = cell.row + ii
              const c = cell.col + jj
              if (
                r >= 0 &&
                r < BOARD_SIZE &&
                c >= 0 &&
                c < BOARD_SIZE &&
                newBoard.find(
                  (o) => o.col === c && o.row === r && o.isMine === true
                )
              ) {
                return acc + 1
              }
              return acc
            }, 0)
          )
        }, 0)
        cell.adjacentMines = count
      })
  }

  function handleCellClick(row, col) {
    if (gameOver) {
      return
    }

    let newBoard = [...board]
    const cell = getCell(newBoard, row, col)
    if (cell.isCovered) {
      cell.isCovered = false

      if (cell.isMine) {
        setGameOver(true)
      }

      if (cell.adjacentMines === 0) {
        uncoverAdjacentCells(newBoard, row, col)
      }

      if (checkIfWin(newBoard)) {
        setWin(true)
        setGameOver(true)
      }

      setBoard(newBoard)
    }
  }

  const checkIfWin = (newBoard) => {
    const numUncovered = newBoard
      .reduce((prev, current) => prev.concat(current), [])
      .filter((o) => !o.isCovered).length

    return numUncovered === BOARD_SIZE * BOARD_SIZE - NUM_MINES
  }

  function uncoverAdjacentCells(newBoard, row, col) {
    ;[-1, 0, 1].reduce((acc, ii) => {
      return (
        acc +
        [-1, 0, 1].reduce((acc, jj) => {
          const r = row + ii
          const c = col + jj
          if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
            const cell = getCell(newBoard, r, c)
            if (cell.isCovered && !cell.isMine) {
              cell.isCovered = false
              if (cell.adjacentMines === 0) uncoverAdjacentCells(newBoard, r, c)
            }
            return acc + 1
          }
          return acc
        }, 0)
      )
    }, 0)
  }

  const getCell = (board, row, col) => {
    return board.find((cell) => cell.row === row && cell.col === col)
  }

  function handleContextMenu(event, row, col) {
    event.preventDefault()
    if (gameOver) {
      return
    }
    let newBoard = [...board]
    let cell = getCell(newBoard, row, col)
    if (cell.isCovered) {
      cell.isFlagged = !cell.isFlagged
      setBoard(newBoard)
    }
  }

  const TEXT_COLORS = {
    1: 'text-blue-800',
    2: 'text-green-800',
    3: 'text-red-800',
    4: 'text-yellow-800'
  }

  function renderBoard() {
    return (
      <div className="grid grid-cols-8 sm:grid-cols-8  m-auto w-fit">
        {board.map((cell, i) => {
          let content = ''
          let textColor = ''
          if (cell.isCovered) {
            if (cell.isFlagged) content = '🚩'
          } else {
            if (cell.isMine) {
              content = '💣'
            } else {
              content = cell.adjacentMines > 0 ? cell.adjacentMines : ''
              textColor = TEXT_COLORS[content]
            }
          }

          return (
            <div
              key={`${cell.row}-${cell.col}`}
              className={`rounded-lg text-center font-bold ${textColor} text-c border-2 border-black items-center m-0 p-1 w-fitbg-gray-400 bg-gray-700`}
              onClick={() => handleCellClick(cell.row, cell.col)}
              onContextMenu={(event) =>
                handleContextMenu(event, cell.row, cell.col)
              }
            >
              <div
                className={`p-1 rounded ${
                  cell.isCovered ? ' bg-gray-700' : 'bg-gray-400'
                }  w-8 h-8`}
              >
                {content}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <main className="grid h-screen place-content-center bg-slate-900">
      <Header title="Buscaminas" />
      <section className="gird grid-cols-1 m-4">
        {renderBoard()}
        <div className="text-center m-4">
          <button
            className="border rounded-lg hover:bg-slate-500 p-2 bg-slate-700 m-auto"
            onClick={generateBoard}
          >
            Nuevo juego
          </button>
          {gameOver && (
            <div className="message">{win ? 'Ganaste!' : 'Perdiste!'}</div>
          )}
        </div>
      </section>
      <Footer author="Pablo Pedraza" github="wayaba" />
    </main>
  )
}
