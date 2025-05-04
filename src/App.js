import React from 'react';
import './App.css';
import TicTacToe from './componets/TicTacToe';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function StartScreen() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <h1 className="text-4xl font-bold mb-8">Welcome to Advanced Tic-Tac-Toe</h1>
      <button
        className="px-8 py-4 bg-blue-600 text-white rounded-lg text-2xl font-semibold hover:bg-blue-700 transition"
        onClick={() => navigate('/game')}
      >
        Start Game
      </button>
      <footer className="mt-12 text-gray-600">Developed by Mohd Saqib</footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/game" element={<TicTacToe />} />
      </Routes>
    </Router>
  );
}

export default App;