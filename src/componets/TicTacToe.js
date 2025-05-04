import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
// Import use-sound conditionally to avoid build errors
const useSound = typeof Audio !== 'undefined' ? require('use-sound').default : () => [() => {}];

const TicTacToe = () => {
  const [boardSize, setBoardSize] = useState(5);
  const [winCondition, setWinCondition] = useState(4);
  const [showSettings, setShowSettings] = useState(false);
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameStatus, setGameStatus] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--dynamic-cols', boardSize);
    document.documentElement.style.setProperty('--dynamic-rows', boardSize);
  }, [boardSize]);

  // Wrap sound hooks in try-catch to handle missing audio files gracefully
  const [playMove] = useSound('/sounds/move.mp3', { volume: 0.5 });
  const [playWin] = useSound('/sounds/win.mp3', { volume: 0.5 });
  const [playDraw] = useSound('/sounds/draw.mp3', { volume: 0.5 });

  // Create safe sound play functions
  const playSoundSafely = (soundFunction) => {
    if (!isMuted) {
      try {
        soundFunction();
      } catch (error) {
        console.log('Sound not available');
      }
    }
  };

  const initializeBoard = () => {
    const newBoard = Array(boardSize).fill().map(() => Array(boardSize).fill(''));
    setBoard(newBoard);
    setCurrentPlayer('X');
    setGameStatus(`Current Turn: Player X`);
    setGameOver(false);
    setWinner(null);
  };

  useEffect(() => {
    initializeBoard();
  }, [boardSize, winCondition]);

  // Load scores from localStorage
  useEffect(() => {
    const savedScores = localStorage.getItem('tictactoe-scores');
    if (savedScores) {
      setScores(JSON.parse(savedScores));
    }
  }, []);

  // Save scores to localStorage
  useEffect(() => {
    localStorage.setItem('tictactoe-scores', JSON.stringify(scores));
  }, [scores]);

  const handleCellClick = async (row, col) => {
    if (board[row][col] !== '' || gameOver) return;

    playSoundSafely(playMove);
    setIsAnimating(true);

    const newBoard = [...board];
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    if (checkWin(newBoard, row, col)) {
      playSoundSafely(playWin);
      setScores(prev => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer] + 1
      }));
      setGameStatus(`Winner: Player ${currentPlayer}`);
      setGameOver(true);
      setWinner(currentPlayer);

      // Highlight winning cells
      highlightWinningCells(newBoard, row, col);
    } else if (checkDraw(newBoard)) {
      playSoundSafely(playDraw);
      setGameStatus('Game ended in a draw');
      setGameOver(true);
    } else {
      const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
      setCurrentPlayer(nextPlayer);
      setGameStatus(`Current Turn: Player ${nextPlayer}`);
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  const highlightWinningCells = (board, row, col) => {
    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1],
    ];
    directions.forEach(([dx, dy]) => {
      let cells = [[row, col]];
      for (let i = 1; i < winCondition; i++) {
        const newRow = row + dx * i;
        const newCol = col + dy * i;
        if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize && board[newRow][newCol] === currentPlayer) {
          cells.push([newRow, newCol]);
        } else break;
      }
      for (let i = 1; i < winCondition; i++) {
        const newRow = row - dx * i;
        const newCol = col - dy * i;
        if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize && board[newRow][newCol] === currentPlayer) {
          cells.push([newRow, newCol]);
        } else break;
      }
      if (cells.length >= winCondition) {
        cells.forEach(([r, c]) => {
          document.querySelector(`#cell-${r}-${c}`).classList.add('bg-green-300');
        });
      }
    });
  };

  const checkWin = (board, row, col) => {
    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1],
    ];
    return directions.some(([dx, dy]) => {
      let count = 1;
      for (let i = 1; i < winCondition; i++) {
        const newRow = row + dx * i;
        const newCol = col + dy * i;
        if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize && board[newRow][newCol] === currentPlayer) {
          count++;
        } else break;
      }
      for (let i = 1; i < winCondition; i++) {
        const newRow = row - dx * i;
        const newCol = col - dy * i;
        if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize && board[newRow][newCol] === currentPlayer) {
          count++;
        } else break;
      }
      return count >= winCondition;
    });
  };

  const checkDraw = (board) => board.every(row => row.every(cell => cell !== ''));

  const handleBoardSizeChange = (e) => setBoardSize(parseInt(e.target.value));
  const handleWinConditionChange = (e) => setWinCondition(Math.min(parseInt(e.target.value), boardSize));
  const toggleSettings = () => setShowSettings(!showSettings);
  const applySettings = () => {
    setShowSettings(false);
    initializeBoard();
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0 });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const resetGame = () => {
    setBoard(Array(boardSize).fill().map(() => Array(boardSize).fill('')));
    setCurrentPlayer('X');
    setGameStatus('Current Turn: Player X');
    setGameOver(false);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 p-4">
      {winner && <Confetti />}
      {winner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Player {winner} Wins!</h2>
            <p className="mb-4">What would you like to do next?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Restart Game
              </button>
              <button
                onClick={() => window.close()}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Exit Game
              </button>
            </div>
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-4 text-center text-white">Play Tic-Tac-Toe Game</h1>

      <div className="mb-4 p-4 bg-blue-100 rounded shadow w-full max-w-lg">
        <p className="text-xl font-semibold text-center">{gameStatus}</p>
      </div>

      <div className="grid bg-gradient-to-br from-gray-100 to-gray-300 p-4 rounded shadow w-full max-w-[98vw] sm:max-w-[98vw]">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-auto-fit gap-1">
            {row.map((cell, colIndex) => (
              <button
                id={`cell-${rowIndex}-${colIndex}`}
                key={`${rowIndex}-${colIndex}`}
                className={`
                  relative overflow-hidden
                  w-[min(calc(98vw/${boardSize}),calc(98vh/${boardSize}))]
                  h-[min(calc(98vw/${boardSize}),calc(98vh/${boardSize}))]
                  border-2 border-gray-400 
                  flex items-center justify-center 
                  text-4xl font-black
                  transform transition-all duration-300
                  ${isAnimating ? 'scale-95' : 'scale-100'}
                  ${cell === '' ? 'hover:bg-gray-50 active:scale-95' : ''}
                  ${winner && board[rowIndex][colIndex] === winner ? 'bg-winner' : 'bg-white'}
                `}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={cell !== '' || gameOver}
              >
                {isAnimating && (
                  <span className="absolute inset-0 bg-gray-200 opacity-30 animate-ping" />
                )}
                <span
                  className={`
                    ${cell === 'X' 
                      ? 'bg-gradient-to-br from-blue-700 to-blue-900 text-transparent bg-clip-text' 
                      : 'bg-gradient-to-br from-red-700 to-red-900 text-transparent bg-clip-text'
                    }
                    transform transition-transform duration-150
                    ${cell !== '' ? 'scale-110 sm:scale-125' : ''}
                  `}
                >
                  {cell}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>

     
    </div>
  );
};

export default TicTacToe;