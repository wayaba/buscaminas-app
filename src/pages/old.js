import { useState, useEffect } from 'react'

const NUM_MINES = 10
const BOARD_SIZE = 8

export default function Home() {
  const [board, setBoard] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [win, setWin] = useState(false)

  useEffect(() => {
    generateBoard3()
  }, [])

  function createCell(row, col) {
    return {
      row,
      col,
      isMine: false,
      isCovered: true,
      adjacentMines: 0
    }
  }

  function createRow(row) {
    return Array.from({ length: BOARD_SIZE }, (v, col) => createCell(row, col))
  }

  function generateBoard() {
    // const newBoard = []
    // for (let row = 0; row < BOARD_SIZE; row++) {
    //   newBoard.push(createRow(row))
    // }

    const newBoard = Array.from({ length: BOARD_SIZE }, (v, row) =>
      createRow(row)
    )

    setBoard(newBoard)
    placeMines(newBoard)
    setGameOver(false)
    setWin(false)
  }

  function generateBoard3() {
    const newBoard = []
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        newBoard.push({
          row,
          col,
          isMine: false,
          isCovered: true,
          adjacentMines: 0
        })
      }
    }

    setBoard(newBoard)
    placeMines3(newBoard)
    setGameOver(false)
    setWin(false)

    console.log('como quedo', newBoard)
  }

  function placeMines3(newBoard) {
    let mines = 0
    while (mines < NUM_MINES) {
      let row = Math.floor(Math.random() * BOARD_SIZE)
      let col = Math.floor(Math.random() * BOARD_SIZE)
      let cell = newBoard.find(
        (cell) => cell.row === row && cell.col === col && cell.isMine !== true
      )
      if (cell) {
        cell.isMine = true
        mines++
      }
    }
    calculateAdjacentMines3(newBoard)
  }
  function placeMines(newBoard) {
    let mines = 0
    while (mines < NUM_MINES) {
      let row = Math.floor(Math.random() * BOARD_SIZE)
      let col = Math.floor(Math.random() * BOARD_SIZE)
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true
        mines++
      }
    }
    calculateAdjacentMines(newBoard)
  }

  function calculateAdjacentMines3(newBoard) {
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

  function calculateAdjacentMines(newBoard) {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        let cell = newBoard[i][j]
        if (!cell.isMine) {
          let count = 0
          for (let ii = -1; ii <= 1; ii++) {
            for (let jj = -1; jj <= 1; jj++) {
              let r = i + ii
              let c = j + jj
              if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
                if (newBoard[r][c].isMine) {
                  count++
                }
              }
            }
          }
          cell.adjacentMines = count
        }
      }
    }
  }

  function handleCellClick3(row, col) {
    if (gameOver) {
      return
    }

    let newBoard = [...board]
    const cell = newBoard.find((o) => o.row === row && o.col === col)
    if (cell.isCovered) {
      cell.isCovered = false

      if (cell.isMine) {
        setGameOver(true)
      }

      if (cell.adjacentMines === 0) {
        uncoverAdjacentCells3(newBoard, row, col)
      }

      if (checkIfWin(newBoard)) {
        setWin(true)
        setGameOver(true)
      }

      setBoard(newBoard)
    }
  }

  function handleCellClick(row, col) {
    if (gameOver) {
      return
    }

    let newBoard = [...board]
    const cell = newBoard[row][col]
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

  function uncoverAdjacentCells3(newBoard, row, col) {
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
              if (cell.adjacentMines === 0)
                uncoverAdjacentCells3(newBoard, r, c)
            }
            return acc + 1
          }
          return acc
        }, 0)
      )
    }, 0)
  }

  function uncoverAdjacentCells(newBoard, row, col) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        let r = row + i
        let c = col + j
        if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
          const cell = newBoard[r][c]
          if (cell.isCovered && !cell.isMine) {
            cell.isCovered = false
            if (cell.adjacentMines === 0) uncoverAdjacentCells(newBoard, r, c)
          }
        }
      }
    }
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
    let cell = newBoard[row][col]
    if (cell.isCovered) {
      cell.isFlagged = !cell.isFlagged
      setBoard(newBoard)
    }
  }

  function renderCell(cell, row, col) {
    let content = ''
    let textColor = 'text-blue-800'
    if (cell.isCovered) {
      if (cell.isFlagged) {
        content = 'F'
      }
    } else {
      if (cell.isMine) {
        content = 'M'
      } else if (cell.adjacentMines > 0) {
        content = cell.adjacentMines
        if (content === 2) textColor = 'text-green-800'

        if (content === 3) textColor = 'text-red-800'
        if (content === 4) textColor = 'text-yellow-800'
      }
    }

    return (
      <div
        key={`${row}-${col}`}
        className={`rounded-lg text-center font-bold ${textColor} text-c border-2 border-black items-center m-0 p-1 w-fitbg-gray-400 bg-gray-700`}
        onClick={() => handleCellClick(row, col)}
        onContextMenu={(event) => handleContextMenu(event, row, col)}
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
  }

  function renderBoard() {
    console.log(board)
    return (
      <div className="grid grid-cols-8 sm:grid-cols-8  m-auto w-fit">
        {board.map((item, i) => item.map((cell, j) => renderCell(cell, i, j)))}
      </div>
    )
  }

  function renderBoard3() {
    console.log('board', board)
    return (
      <div className="grid grid-cols-8 sm:grid-cols-8  m-auto w-fit">
        {board.map((cell, i) => {
          let content = ''
          let textColor = 'text-blue-800'
          if (cell.isCovered) {
            if (cell.isFlagged) {
              content = 'F'
            }
          } else {
            if (cell.isMine) {
              content = 'M'
            } else if (cell.adjacentMines > 0) {
              content = cell.adjacentMines
              if (content === 2) textColor = 'text-green-800'

              if (content === 3) textColor = 'text-red-800'
              if (content === 4) textColor = 'text-yellow-800'
            }
          }

          return (
            <div
              key={`${cell.row}-${cell.col}`}
              className={`rounded-lg text-center font-bold ${textColor} text-c border-2 border-black items-center m-0 p-1 w-fitbg-gray-400 bg-gray-700`}
              onClick={() => handleCellClick3(cell.row, cell.col)}
              //onContextMenu={(event) => handleContextMenu(event, row, col)}
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
      <h1>Buscaminas</h1>
      <section className="gird grid-cols-1 m-4">{renderBoard3()}</section>
      <button onClick={generateBoard3}>Nuevo juego</button>
      {gameOver && (
        <div className="message">{win ? 'Ganaste!' : 'Perdiste!'}</div>
      )}
    </main>
  )
}
