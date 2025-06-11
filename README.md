# Sea Battle CLI Game

A modernized command-line interface (CLI) implementation of the classic Sea Battle (Battleship) game, built with modern JavaScript (ES6+) and clean architecture principles.

## Features

- **Modern JavaScript**: Built with ES6+ features including classes, modules, async/await, and arrow functions
- **Clean Architecture**: Modular design with clear separation of concerns
- **Intelligent AI**: CPU opponent with hunt and target modes for challenging gameplay
- **Responsive UI**: Clean terminal interface with side-by-side board display
- **Input Validation**: Robust input handling with clear error messages
- **Graceful Error Handling**: Comprehensive error handling and process management

## Gameplay

You play against an intelligent CPU opponent. Both players place their ships randomly on a 10x10 grid. Players take turns guessing coordinates to hit the opponent's ships. The first player to sink all of the opponent's ships wins.

### Game Symbols
- `~` represents water (unknown/unexplored)
- `S` represents your ships on your board
- `X` represents a hit (successful attack)
- `O` represents a miss (failed attack)

### Game Mechanics
- **10x10 grid** for each player
- **3 ships** per player, each 3 cells long
- **Turn-based coordinate input** (e.g., `00`, `34`, `99`)
- **Smart CPU AI** with hunt and target modes
- **Real-time game state display** with dual board view

## Requirements

- **Node.js 14.0.0 or higher** - Download from [https://nodejs.org/](https://nodejs.org/)

## Installation & Usage

### Quick Start
1. **Clone or download** the project
2. **Navigate to the project directory** in your terminal
3. **Run the game**:
   ```bash
   npm start
   ```
   or
   ```bash
   node src/main.js
   ```

### Alternative Commands
```bash
# Development mode with debugging
npm run dev

# Direct execution
node src/main.js
```

## Architecture

The modernized codebase follows clean architecture principles with clear separation of concerns:

```
src/
├── constants.js     # Game configuration and constants
├── Ship.js         # Ship class with state management
├── Board.js        # Board class with game logic
├── Player.js       # Player classes (Human, CPU, Base)
├── GameRenderer.js # Display and UI logic
├── InputHandler.js # Modern async input handling
├── Game.js         # Main game orchestration
└── main.js         # Entry point and error handling
```

### Key Improvements
- **ES6+ Features**: Classes, modules, const/let, arrow functions, async/await
- **Encapsulation**: No global variables, proper state management
- **Modularity**: Clear separation of game logic, display, and input
- **Error Handling**: Comprehensive error handling and graceful shutdown
- **Code Quality**: Consistent naming, documentation, and structure

## Controls

- Enter coordinates as two digits (e.g., `00` for top-left, `99` for bottom-right)
- `Ctrl+C` to quit the game at any time
- Follow on-screen prompts for game flow

## Game Flow

1. Game initializes and places ships randomly
2. Player and CPU boards are displayed side-by-side
3. Player makes a guess by entering coordinates
4. Attack result is displayed (hit/miss/sunk)
5. CPU makes its move using intelligent AI
6. Process repeats until all ships of one player are sunk
7. Winner is announced with option to play again

Enjoy the modernized Sea Battle experience! 