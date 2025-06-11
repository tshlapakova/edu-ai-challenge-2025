import { Game } from '../src/Game.js';
import { HumanPlayer, CPUPlayer } from '../src/Player.js';

// Mock all dependencies
jest.mock('../src/Player.js');
jest.mock('../src/GameRenderer.js');
jest.mock('../src/InputHandler.js');

// Create mock classes
const mockInputHandler = {
  getInput: jest.fn(),
  getConfirmation: jest.fn(),
  close: jest.fn()
};

const mockRenderer = {
  displayGameStart: jest.fn(),
  displayBoards: jest.fn(),
  displayTurn: jest.fn(),
  displayAttackResult: jest.fn(),
  displayGameOver: jest.fn(),
  displayStats: jest.fn()
};

const mockHumanPlayer = {
  name: 'Human',
  makeGuess: jest.fn(),
  receiveAttack: jest.fn(),
  processGuessResult: jest.fn(),
  hasLost: jest.fn(),
  getRemainingShipsCount: jest.fn()
};

const mockCPUPlayer = {
  name: 'CPU',
  makeGuess: jest.fn(),
  receiveAttack: jest.fn(),
  processGuessResult: jest.fn(),
  hasLost: jest.fn(),
  getRemainingShipsCount: jest.fn()
};

// Mock the constructor imports
HumanPlayer.mockImplementation(() => mockHumanPlayer);
CPUPlayer.mockImplementation(() => mockCPUPlayer);

// Mock console.log to suppress output during tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('Game', () => {
  let game;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Suppress console output
    console.log = jest.fn();
    console.error = jest.fn();
    
    game = new Game();
    
    // Manually set mocked dependencies
    game.inputHandler = mockInputHandler;
    game.renderer = mockRenderer;
    game.humanPlayer = mockHumanPlayer;
    game.cpuPlayer = mockCPUPlayer;
  });

  afterEach(() => {
    // Restore console
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  describe('constructor', () => {
    test('initializes game properties correctly', () => {
      const newGame = new Game();
      expect(newGame.gameOver).toBe(false);
      expect(newGame.winner).toBeNull();
    });
  });

  describe('initialize', () => {
    test('creates players and sets up game', async () => {
      await game.initialize();
      
      expect(HumanPlayer).toHaveBeenCalledWith(mockInputHandler);
      expect(CPUPlayer).toHaveBeenCalled();
      expect(game.humanPlayer).toBe(mockHumanPlayer);
      expect(game.cpuPlayer).toBe(mockCPUPlayer);
      expect(game.currentPlayer).toBe(mockHumanPlayer);
      expect(mockRenderer.displayGameStart).toHaveBeenCalled();
    });
  });

  describe('playTurn', () => {
    beforeEach(async () => {
      await game.initialize();
      mockHumanPlayer.makeGuess.mockResolvedValue('23');
      mockCPUPlayer.receiveAttack.mockReturnValue({ 
        hit: true, 
        sunk: false, 
        alreadyGuessed: false 
      });
      mockHumanPlayer.hasLost.mockReturnValue(false);
      mockCPUPlayer.hasLost.mockReturnValue(false);
    });

    test('displays game state and processes turn', async () => {
      await game.playTurn();
      
      expect(mockRenderer.displayBoards).toHaveBeenCalledWith(mockHumanPlayer, mockCPUPlayer);
      expect(mockRenderer.displayTurn).toHaveBeenCalledWith('Human');
      expect(mockHumanPlayer.makeGuess).toHaveBeenCalled();
      expect(mockCPUPlayer.receiveAttack).toHaveBeenCalledWith('23');
      expect(mockHumanPlayer.processGuessResult).toHaveBeenCalled();
      expect(mockRenderer.displayAttackResult).toHaveBeenCalled();
    });

    test('checks game over conditions', async () => {
      const checkGameOverSpy = jest.spyOn(game, 'checkGameOver');
      
      await game.playTurn();
      
      expect(checkGameOverSpy).toHaveBeenCalled();
    });

    test('adds delay for CPU moves', async () => {
      game.currentPlayer = mockCPUPlayer;
      const sleepSpy = jest.spyOn(game, 'sleep').mockResolvedValue();
      
      await game.playTurn();
      
      expect(sleepSpy).toHaveBeenCalledWith(1000);
    });

    test('does not add delay for human moves', async () => {
      const sleepSpy = jest.spyOn(game, 'sleep').mockResolvedValue();
      
      await game.playTurn();
      
      expect(sleepSpy).not.toHaveBeenCalled();
    });
  });

  describe('getOpponent', () => {
    test('returns CPU when current player is human', () => {
      game.currentPlayer = mockHumanPlayer;
      expect(game.getOpponent()).toBe(mockCPUPlayer);
    });

    test('returns human when current player is CPU', () => {
      game.currentPlayer = mockCPUPlayer;
      expect(game.getOpponent()).toBe(mockHumanPlayer);
    });
  });

  describe('switchPlayer', () => {
    test('switches from human to CPU', () => {
      game.currentPlayer = mockHumanPlayer;
      game.switchPlayer();
      expect(game.currentPlayer).toBe(mockCPUPlayer);
    });

    test('switches from CPU to human', () => {
      game.currentPlayer = mockCPUPlayer;
      game.switchPlayer();
      expect(game.currentPlayer).toBe(mockHumanPlayer);
    });

    test('does not switch when game is over', () => {
      game.gameOver = true;
      game.currentPlayer = mockHumanPlayer;
      game.switchPlayer();
      expect(game.currentPlayer).toBe(mockHumanPlayer);
    });
  });

  describe('checkGameOver', () => {
    test('sets CPU winner when human loses', () => {
      mockHumanPlayer.hasLost.mockReturnValue(true);
      mockCPUPlayer.hasLost.mockReturnValue(false);
      
      game.checkGameOver();
      
      expect(game.gameOver).toBe(true);
      expect(game.winner).toBe('CPU');
    });

    test('sets human winner when CPU loses', () => {
      mockHumanPlayer.hasLost.mockReturnValue(false);
      mockCPUPlayer.hasLost.mockReturnValue(true);
      
      game.checkGameOver();
      
      expect(game.gameOver).toBe(true);
      expect(game.winner).toBe('Human');
    });

    test('does not end game when both players have ships', () => {
      mockHumanPlayer.hasLost.mockReturnValue(false);
      mockCPUPlayer.hasLost.mockReturnValue(false);
      
      game.checkGameOver();
      
      expect(game.gameOver).toBe(false);
      expect(game.winner).toBeNull();
    });
  });

  describe('endGame', () => {
    beforeEach(async () => {
      await game.initialize();
      game.gameOver = true;
      game.winner = 'Human';
    });

    test('displays final game state', async () => {
      mockInputHandler.getConfirmation.mockResolvedValue(false);
      
      await game.endGame();
      
      expect(mockRenderer.displayBoards).toHaveBeenCalledWith(mockHumanPlayer, mockCPUPlayer);
      expect(mockRenderer.displayGameOver).toHaveBeenCalledWith('Human');
      expect(mockRenderer.displayStats).toHaveBeenCalledWith(mockHumanPlayer, mockCPUPlayer);
    });

    test('asks if player wants to play again', async () => {
      mockInputHandler.getConfirmation.mockResolvedValue(false);
      
      await game.endGame();
      
      expect(mockInputHandler.getConfirmation).toHaveBeenCalledWith('Would you like to play again?');
    });

    test('restarts game when player wants to play again', async () => {
      mockInputHandler.getConfirmation.mockResolvedValue(true);
      const restartSpy = jest.spyOn(game, 'restart').mockResolvedValue();
      
      await game.endGame();
      
      expect(restartSpy).toHaveBeenCalled();
    });

    test('cleans up when player does not want to play again', async () => {
      mockInputHandler.getConfirmation.mockResolvedValue(false);
      const cleanupSpy = jest.spyOn(game, 'cleanup');
      
      await game.endGame();
      
      expect(cleanupSpy).toHaveBeenCalled();
    });
  });

  describe('restart', () => {
    beforeEach(async () => {
      await game.initialize();
      game.gameOver = true;
      game.winner = 'Human';
    });

    test('resets game state', async () => {
      const startSpy = jest.spyOn(game, 'start').mockResolvedValue();
      
      await game.restart();
      
      expect(game.gameOver).toBe(false);
      expect(game.winner).toBeNull();
      expect(startSpy).toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    test('closes input handler', () => {
      game.cleanup();
      
      expect(mockInputHandler.close).toHaveBeenCalled();
    });
  });

  describe('sleep', () => {
    test('resolves after specified time', async () => {
      const start = Date.now();
      await game.sleep(10);
      const end = Date.now();
      
      expect(end - start).toBeGreaterThanOrEqual(5);
    });
  });

  describe('handleError', () => {
    test('logs error and cleans up', () => {
      const cleanupSpy = jest.spyOn(game, 'cleanup');
      const exitSpy = jest.spyOn(process, 'exit').mockImplementation();
      
      game.handleError(new Error('Test error'));
      
      expect(console.error).toHaveBeenCalled();
      expect(cleanupSpy).toHaveBeenCalled();
      expect(exitSpy).toHaveBeenCalledWith(1);
      
      exitSpy.mockRestore();
    });
  });

  describe('start integration', () => {
    test('runs complete game loop until victory', async () => {
      // Mock a short game where human wins quickly
      let turnCount = 0;
      const maxTurns = 3;
      
      mockHumanPlayer.makeGuess.mockResolvedValue('23');
      mockCPUPlayer.makeGuess.mockResolvedValue('45');
      mockHumanPlayer.receiveAttack.mockReturnValue({ hit: false, sunk: false, alreadyGuessed: false });
      mockCPUPlayer.receiveAttack.mockReturnValue({ hit: true, sunk: false, alreadyGuessed: false });
      
      // Mock hasLost to return true after a few turns
      mockHumanPlayer.hasLost.mockImplementation(() => false);
      mockCPUPlayer.hasLost.mockImplementation(() => {
        turnCount++;
        return turnCount >= maxTurns;
      });
      
      mockInputHandler.getConfirmation.mockResolvedValue(false);
      
      const initializeSpy = jest.spyOn(game, 'initialize');
      const playTurnSpy = jest.spyOn(game, 'playTurn');
      const endGameSpy = jest.spyOn(game, 'endGame');
      
      await game.start();
      
      expect(initializeSpy).toHaveBeenCalled();
      expect(playTurnSpy).toHaveBeenCalled();
      expect(endGameSpy).toHaveBeenCalled();
      expect(game.winner).toBe('Human');
    });
  });
}); 