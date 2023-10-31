/* eslint-disable prettier/prettier */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/jsx-no-bind */
import { OpenAIMessage } from 'api'
import { Chess, Move } from 'chess.js'
import { Button } from 'components/Button'
import { useMemo, useEffect, useRef, useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { getChatCompletions } from '../api/chat/chat'

const colMap = new Map([
  ['a', 0],
  ['b', 1],
  ['c', 2],
  ['d', 3],
  ['e', 4],
  ['f', 5],
  ['g', 6],
  ['h', 7],
])

let undoStack = [] as Move[];

export default function Home() {
  const game = useMemo(() => new Chess(), [])
  const [matchResult, setMatchResult] = useState('')
  const [playerTurn, setPlayerTurn] = useState(true)
  const [readyToUndo, setReadyToUndo] = useState(false)
  const [readyToRedo, setReadyToRedo] = useState(false)
  const [gamePosition, setGamePosition] = useState(game.fen())

  const msgs = useRef([] as OpenAIMessage[])
  const botPossibleMoves = useRef([] as string[])
  const recentMove = useRef('')
  const turnNumber = useRef(1)

  useEffect(() => {
    msgs.current = [] // if the previous game is finished, refresh the conversation history
    msgs.current.push({
      role: 'system',
      content: `You are a chess grandmaster playing black, and your goal is to win as quickly as possible. I will provide the current game score before each of your moves, and your reply should just be your next move in algebraic notation with no other commentary. The current score:`,
    })
  }, [])

  useEffect(() => {
    if (game.isGameOver() || game.isDraw()) {
      if (game.turn() === 'b') {
        setMatchResult('win')
        return
      }
      setMatchResult('lose')
      return
    }

    if (game.turn() === 'b') {
      if (playerTurn) {
        return
      }
      botPossibleMoves.current = game.moves()
      if (game.isCheck()) {
        recentMove.current = `${recentMove.current}+`
      }
      makeBOTMove()
    }
  }, [game, playerTurn, makeBOTMove])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function makeBOTMove() {
    if (
      game.isGameOver() ||
      game.isDraw() ||
      botPossibleMoves.current.length === 0
    )
      return

    if (turnNumber.current === 1) {
      msgs.current.push({
        role: 'user',
        content: `${turnNumber.current}. ${recentMove.current}`,
      })
    } else {
      msgs.current[msgs.current.length - 1].content = `${msgs.current[msgs.current.length - 1].content}\n${turnNumber.current}. ${recentMove.current}`
    }

    // Use the OpenAI API to get the best move
    const openAIResponse = await getChatCompletions({
      model: 'openai/gpt-4',
      messages: msgs.current,
    })

    if (openAIResponse && openAIResponse.choices) {
      const responseContent = openAIResponse.choices[0].message.content
        if (responseContent !== "") {
          try {
            const botMoveString = extractValidChessMove(responseContent)
            if (botMoveString === null) { 
              game.reset()
              setPlayerTurn(true)
              return
            }
            const botMove = game.move(botMoveString)
            undoStack.push(botMove)
            setGamePosition(game.fen())
          msgs.current[msgs.current.length - 1].content = `${msgs.current[msgs.current.length - 1].content} ${botMoveString}`
          turnNumber.current = turnNumber.current + 1
          } catch (error) {
            game.reset()
            setPlayerTurn(true)
            return
          }
        }
    } else {
      game.reset()
      setPlayerTurn(true)
      return
    }
    setPlayerTurn(true)
    setReadyToUndo(true)
  }

  const onDrop = (source: string, target: string, piece: string) => {
    if (playerTurn === false) {
      return false
    }

    const targetRow = `${8 - +target[1]}`
    const targetCol = colMap.get(target[0])
    const board = game.board()
    if (piece[1].toLowerCase() === 'p') {
      recentMove.current = `${target}` // a default normal move of pawn
      if (board[targetRow][targetCol] !== null) {
        recentMove.current = `${source[0]}x${target}` // a capture move
      }
    } else {
      recentMove.current = `${piece[1]}${target}` // a default normal move of any piece except pawn
      if (board[targetRow][targetCol] !== null) {
        recentMove.current = `${piece[1]}x${target}` // a capture move
      }
    }

    try {
      const userMove = game.move({
        from: source,
        to: target,
        promotion: piece[1].toLowerCase() ?? 'q',
      })
      undoStack.push(userMove)
    } catch (error) {
      return false
    }

    setGamePosition(game.fen())
    setPlayerTurn(false)
    return true
  }

  const handleRestartGame = () => {
    // handle restart game
    undoStack = []
    setMatchResult('')
    game.reset()
    setPlayerTurn(true)
    location.reload()
  }

  const handleUndo = () => {
    if (readyToUndo) {
      const blackMove = game.undo();
    if (blackMove !== null) {
      undoStack.push(blackMove)
    }
    const whiteMove = game.undo();
    if (whiteMove !== null) {
      undoStack.push(whiteMove)
    }
    console.log('blackMove by Undo:', blackMove)
    console.log('whiteMove by Undo:', whiteMove)
    setGamePosition(game.fen());
    turnNumber.current = turnNumber.current-1
    const res = trimStringTillLastNewline(msgs.current[msgs.current.length - 1].content)
    console.log('After:', res)
    msgs.current[msgs.current.length - 1].content = res
    setReadyToRedo(true)
    }
    console.log('undoStack by Undo:', undoStack)
  }
  
  const handleRedo = () => {
    if (readyToRedo) {
      const blackMove = undoStack.pop()
      if (blackMove) {
        game.move(blackMove)
      }
      const whiteMove = undoStack.pop()
      if (whiteMove) {
        game.move(whiteMove)
      }
      setGamePosition(game.fen());
      turnNumber.current = turnNumber.current+1
      msgs.current[msgs.current.length - 1].content = `${msgs.current[msgs.current.length - 1].content}\n${turnNumber.current}. ${whiteMove?.san} ${blackMove?.san}`
      if (undoStack.length === 0) {
        setReadyToRedo(false)
      }
    }
    
    console.log('undoStack by Redo:', undoStack)
  }

  function trimStringTillLastNewline(input: string): string {
    console.log('Before:', input)
    const lastNewlineIndex = input.lastIndexOf('\n');
    console.log('lastNewlineIndex:', lastNewlineIndex)

    if (lastNewlineIndex !== -1) {
        console.log('TRIMMED!')
        return input.substring(0, lastNewlineIndex);
    } 
        return input; // If no newline found, return the original string
  }


  function extractValidChessMove(input: string): string | null {
    const chessRegex = /[BRQNK][a-h][1-8]|[BRQNK][a-h]x[a-h][1-8]|[BRQNK][a-h][1-8]x[a-h][1-8]|[BRQNK][a-h][1-8][a-h][1-8]|[BRQNK][a-h][a-h][1-8]|[BRQNK]x[a-h][1-8]|[a-h]x[a-h][1-8]=(B+R+Q+N)|[a-h]x[a-h][1-8]|[a-h][1-8]x[a-h][1-8]=(B+R+Q+N)|[a-h][1-8]x[a-h][1-8]|[a-h][1-8][a-h][1-8]=(B+R+Q+N)|[a-h][1-8][a-h][1-8]|[a-h][1-8]=(B+R+Q+N)|[a-h][1-8]|[BRQNK][1-8]x[a-h][1-8]|[BRQNK][1-8][a-h][1-8]/;
  
    const matches = input.match(chessRegex);
  
    if (matches && matches.length > 0) {
      return matches[0]; // Return the first valid chess move found in the input
    }
  
    return null; // Return null if no valid move is found in the input
  }

  return (
    <div className="app">
      <div className="w-full min-h-screen flex-col flex justify-center items-center relative bg-[url('/chessbg.png')] bg-cover">
        <div className="sm:w-3/4 md:w-1/2 lg:w-1/3">
          {matchResult && (
            <div className="flex flex-col items-center p-5 gap-2 text-gray-900 dark:text-white z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow dark:bg-gray-700">
              {`You ${matchResult}!`}
              <Button appearance="primary" onClick={() => handleRestartGame()}>
                Restart game
              </Button>
            </div>
          )}
          <Chessboard position={gamePosition} onPieceDrop={onDrop} />
        </div>
        <Button
        appearance="primary"
        onClick={() => {
          handleRestartGame()
        }}
      >
        New game
      </Button>
      <Button
        appearance="primary"
        onClick={() => {
          handleUndo()
        }}
      >
        Undo
      </Button>
      <Button
        appearance="primary"
        onClick={() => {
          handleRedo()
        }}
      >
        Redo
      </Button>
      </div>
    </div>
  )
}
