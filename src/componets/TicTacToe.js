import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti'; 

const TicTacToe = () => {

  const [boardSize, setBoardSize] = useState(5);
  const [winCondition, setWinCondition] = useState(4);
  const [showSettings, setShowSettings] = useState(false);
  
 
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameStatus, setGameStatus] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null); 
  
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
  
  
  const handleCellClick = (row, col) => {
    if (board[row][col] !== '' || gameOver) return;
    const newBoard = [...board];
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);
    if (checkWin(newBoard, row, col)) {
      setGameStatus(`Winner: Player ${currentPlayer}`);
      setGameOver(true);
      setWinner(currentPlayer); 
    } else if (checkDraw(newBoard)) {
      setGameStatus('Game ended in a draw');
      setGameOver(true);
    } else {
      const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
      setCurrentPlayer(nextPlayer);
      setGameStatus(`Current Turn: Player ${nextPlayer}`);
    }
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {winner && <Confetti />} 
      <h1 className="text-3xl font-bold mb-4 text-center">Play Tic-Tac-Toe Game</h1>
      
      <div className="mb-4 p-4 bg-blue-100 rounded shadow w-full max-w-lg">
        <p className="text-xl font-semibold text-center">{gameStatus}</p>
      </div>
      
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        <button 
          onClick={initializeBoard} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reset Game
        </button>
        <button 
          onClick={toggleSettings} 
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          {showSettings ? 'Hide Settings' : 'Show Settings'}
        </button>
      </div>
      
      {showSettings && (
        <div className="mb-4 p-4 bg-green-100 rounded shadow w-full max-w-md">
          <h2 className="text-xl font-semibold mb-2">Game Settings</h2>
          <div className="mb-3">
            <label className="block mb-1">Board Size (N): {boardSize}×{boardSize}</label>
            <input 
              type="range" 
              min="3" 
              max="10" 
              value={boardSize} 
              onChange={handleBoardSizeChange}
              className="w-full"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1">Win Condition (M): {winCondition} in a row</label>
            <input 
              type="range" 
              min="3" 
              max={boardSize} 
              value={winCondition} 
              onChange={handleWinConditionChange}
              className="w-full"
            />
          </div>
          <button 
            onClick={applySettings} 
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
          >
            Apply Settings
          </button>
        </div>
      )}
      
      <div className="inline-block bg-white p-2 rounded shadow w-full max-w-lg">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center">
            {row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className="w-12 h-12 border border-gray-400 flex items-center justify-center text-2xl font-bold bg-white hover:bg-gray-100"
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={cell !== '' || gameOver}
              >
                <span className={cell === 'X' ? 'text-blue-600' : 'text-red-600'}>
                  {cell}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center text-gray-600">
        <p>Board Size: {boardSize}×{boardSize}</p>
        <p>Win Condition: {winCondition} in a row</p>
      </div>
    </div>
  );
};

export default TicTacToe;