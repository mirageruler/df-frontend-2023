/* eslint-disable no-restricted-globals */
/* eslint-disable react/jsx-no-bind */
import { OpenAIMessage } from 'api'
import { Chess } from 'chess.js'
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

export default function Home() {
  const game = useMemo(() => new Chess(), [])
  const [matchResult, setMatchResult] = useState('')
  const [playerTurn, setPlayerTurn] = useState(true)
  const [gamePosition, setGamePosition] = useState(game.fen())

  const msgs = useRef([] as OpenAIMessage[])
  const botPossibleMoves = useRef([] as string[])
  const recentMove = useRef('')

  useEffect(() => {
    msgs.current = [] // if the previous game is finished, refresh the conversation history
    msgs.current.push({
      role: 'system',
      content: `You are playing a game of western chess against a user. Please tell me your move in algebraic notation (eg: e2-e4, eg: Be7, eg: Nxc4) and nothing else. Do not mention my moves.`,
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

    const botPossibleMovesString = botPossibleMoves.current.join(' or ')
    msgs.current.push({
      role: 'user',
      content: `I play ${recentMove.current}. Your turn; and you must choose only one move among the following possible moves at this turn: ${botPossibleMovesString}.`,
    })

    // Use the OpenAI API to get the best move
    const openAIResponse = await getChatCompletions({
      model: 'openai/gpt-3.5-turbo',
      messages: msgs.current,
    })

    if (openAIResponse && openAIResponse.choices) {
      const responseContent = openAIResponse.choices[0].message.content

      if (responseContent !== '') {
        const bestMoves: string[] = responseContent.split(',')
        if (bestMoves.length > 0) {
          game.move(bestMoves[0])
          setGamePosition(game.fen())
          msgs.current.push({ role: 'assistant', content: `${bestMoves[0]}` })
        }
      }
    }
    setPlayerTurn(true)
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
      game.move({
        from: source,
        to: target,
        promotion: piece[1].toLowerCase() ?? 'q',
      })
    } catch (error) {
      return false
    }

    setGamePosition(game.fen())
    setPlayerTurn(false)
    return true
  }

  const handleRestartGame = () => {
    // handle restart game
    setMatchResult('')
    game.reset()
    setPlayerTurn(true)
    location.reload()
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
      </div>
    </div>
  )
}
