import React, { useEffect, useState } from 'react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
const defaultState = {
	history: [Array(9).fill(null)],
	currentStep: 0,
}


type Player = 'X' | 'O'
type Squares = Array<Player | null>
type GameState = {
	history: Array<Squares>
	currentStep: number
}

function Board() {
	const [state, setState] = useState<GameState>(() => {
		const storedSquares = localStorage.getItem('state')
		try {
			return storedSquares ? JSON.parse(storedSquares) : defaultState
		} catch {
			return defaultState
		}
	})
	const { history, currentStep } = state
	const squares = history[currentStep]
	const status = calculateStatus(squares)
	const nextValue = calculateNextValue(squares)

	useEffect(() => {
		localStorage.setItem('state', JSON.stringify(state))
	}, [state])

	function handleClick(i: number) {
		if (squares[i] || calculateWinner(squares)) return
		const newSquares = squares.slice()
		newSquares[i] = nextValue

		const newHistory = history.slice(0, currentStep + 1)
		newHistory.push(newSquares)
		setState({
			history: newHistory,
			currentStep: newHistory.length - 1,
		})
	}

	function renderSquare(i: number) {
		return (
			<button
				onClick={() => handleClick(i)}
				className="w-20 h-20 text-2xl font-semibold border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition-all duration-150"
			>
				{squares[i]}
			</button>
		)
	}

	function restartGame() {
		setState(defaultState)
		localStorage.removeItem('state')
	}
	return (
		<div className="flex flex-col items-center gap-4">
			<div className="text-xl font-bold text-gray-700">{status}</div>

			<div className="grid grid-cols-3 gap-2">
				{renderSquare(0)}
				{renderSquare(1)}
				{renderSquare(2)}
				{renderSquare(3)}
				{renderSquare(4)}
				{renderSquare(5)}
				{renderSquare(6)}
				{renderSquare(7)}
				{renderSquare(8)}
			</div>

			<button
				onClick={restartGame}
				className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
			>
				Restart
			</button>

			<div className='mt-4 flex flex-col'>
				{history.map((squares, step) => (
					<button
						key={step}
						onClick={() => setState({ ...state, currentStep: step })}
						className={`px-2 py-1 m-1 rounded ${step === currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
					>
						{step === 0 ? 'Go to game start' : `Go to move #${step}`}
					</button>
				))}
			</div>
		</div>
	)
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
	function handleError() {
		resetErrorBoundary()
		localStorage.removeItem('state')
	}
	return (
		<div className="p-4 bg-red-100 text-red-700 rounded">
			<h2 className="font-bold">Something went wrong:</h2>
			<p>{error.message}</p>
			<button
				onClick={handleError}
				className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
			>
				Try again
			</button>
		</div>
	)
}
function App() {
	return (
		<div className="min-h-screen flex items-start justify-center bg-gray-50">
			<div className="p-6 bg-white rounded-lg shadow-md">
				<ErrorBoundary FallbackComponent={ErrorFallback}>
					<Board />
				</ErrorBoundary>
			</div>
		</div>
	)
}

function calculateNextValue(squares: Squares): Player {
	const xCount = squares.filter(square => square === 'X').length
	const oCount = squares.filter(square => square === 'O').length
	return xCount === oCount ? 'X' : 'O'
}

function calculateWinner(squares: Squares): Player | null {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	]

	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i]
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a]
		}
	}
	return null
}

function calculateStatus(squares: Squares): string {
	const winner = calculateWinner(squares)
	if (winner) {
		return `Winner: ${winner}`
	} else if (squares.every(square => square !== null)) {
		return 'Draw'
	} else {
		return `Next player: ${calculateNextValue(squares)}`
	}
}

export default App
