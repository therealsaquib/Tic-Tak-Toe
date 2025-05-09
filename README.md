# Advanced Tic-Tac-Toe

An enhanced version of the classic Tic-Tac-Toe game built with React. This version supports customizable board sizes (N×N) and win conditions (M marks in a row).

## Features

- Customizable board size (3×3 up to 10×10)
- Adjustable win condition (3 to N marks in a row)
- Interactive game board with turn tracking
- Game status display (current player, winner, or draw)
- Reset button to start a new game
- Settings panel to adjust game parameters

## Technologies Used

- React.js
- JavaScript (ES6+)
- Tailwind CSS for styling
- Modern React Hooks (useState, useEffect)

## Game Rules

1. Players take turns placing their mark (X or O) on an N×N grid
2. The first player to get M of their marks in a horizontal, vertical, or diagonal row wins
3. If all cells are filled without a winner, the game ends in a draw

## Demo

[Link to live demo on Netlify]

## Local Development

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository
   bash
   git clone https://github.com/your-username/advanced-tic-tac-toe.git
   cd advanced-tic-tac-toe
   

2. Install dependencies
   bash
   npm install
   

3. Start the development server
   bash
   npm start
   

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

bash
npm run build


## Future Enhancements

- Add game history and time travel feature
- Implement player vs. computer mode with difficulty levels
- Add sound effects and animations
- Enable saving game state to local storage
- Add multiplayer support#
