import { GameRenderer } from '../src/GameRenderer.js';
import { HumanPlayer, CPUPlayer } from '../src/Player.js';
import { GAME_CONFIG } from '../src/constants.js';

// Mock console methods
const mockConsole = {
  log: jest.fn(),
  clear: jest.fn()
};

const originalConsole = console;

describe('GameRenderer', () => {
  let renderer;
  let humanPlayer;
  let cpuPlayer;

  beforeEach(() => {
    renderer = new GameRenderer();
    // Mock InputHandler for HumanPlayer
    const mockInputHandler = { getInput: jest.fn() };
    humanPlayer = new HumanPlayer(mockInputHandler);
    cpuPlayer = new CPUPlayer();
    
    // Replace console methods
    console.log = mockConsole.log;
    console.clear = mockConsole.clear;
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Restore console
    console.log = originalConsole.log;
    console.clear = originalConsole.clear;
  });

  describe('displayBoards', () => {
    test('displays board headers', () => {
      renderer.displayBoards(humanPlayer, cpuPlayer);
      
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('--- OPPONENT BOARD ---')
      );
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('--- YOUR BOARD ---')
      );
    });

    test('displays column headers', () => {
      renderer.displayBoards(humanPlayer, cpuPlayer);
      
      const headerCall = mockConsole.log.mock.calls.find(call => 
        call[0].includes('0 1 2 3 4 5 6 7 8 9')
      );
      expect(headerCall).toBeDefined();
    });

    test('displays correct number of rows', () => {
      renderer.displayBoards(humanPlayer, cpuPlayer);
      
      // Count calls that start with row numbers (0-9)
      const rowCalls = mockConsole.log.mock.calls.filter(call => 
        /^\d /.test(call[0])
      );
      expect(rowCalls.length).toBe(GAME_CONFIG.BOARD_SIZE);
    });

    test('displays row numbers correctly', () => {
      renderer.displayBoards(humanPlayer, cpuPlayer);
      
      for (let i = 0; i < GAME_CONFIG.BOARD_SIZE; i++) {
        const rowCall = mockConsole.log.mock.calls.find(call => 
          call[0].startsWith(`${i} `)
        );
        expect(rowCall).toBeDefined();
      }
    });
  });

  describe('displayGameStart', () => {
    test('displays welcome message', () => {
      renderer.displayGameStart();
      
      expect(mockConsole.log).toHaveBeenCalledWith("\nLet's play Sea Battle!");
    });

    test('displays ship count', () => {
      renderer.displayGameStart();
      
      expect(mockConsole.log).toHaveBeenCalledWith(
        `Try to sink the ${GAME_CONFIG.NUM_SHIPS} enemy ships.`
      );
    });

    test('displays setup confirmation', () => {
      renderer.displayGameStart();
      
      expect(mockConsole.log).toHaveBeenCalledWith(
        'Boards created and ships placed.'
      );
    });
  });

  describe('displayAttackResult', () => {
    test('displays hit message', () => {
      const result = { hit: true, sunk: false, alreadyGuessed: false };
      renderer.displayAttackResult('Human', '23', result);
      
      expect(mockConsole.log).toHaveBeenCalledWith('HUMAN HIT at 23!');
    });

    test('displays miss message', () => {
      const result = { hit: false, sunk: false, alreadyGuessed: false };
      renderer.displayAttackResult('CPU', '45', result);
      
      expect(mockConsole.log).toHaveBeenCalledWith('CPU MISS at 45.');
    });

    test('displays sunk ship message', () => {
      const result = { hit: true, sunk: true, alreadyGuessed: false };
      renderer.displayAttackResult('Human', '23', result);
      
      expect(mockConsole.log).toHaveBeenCalledWith('HUMAN HIT at 23!');
      expect(mockConsole.log).toHaveBeenCalledWith('Human sunk a battleship!');
    });

    test('displays already guessed message', () => {
      const result = { hit: false, sunk: false, alreadyGuessed: true };
      renderer.displayAttackResult('CPU', '23', result);
      
      expect(mockConsole.log).toHaveBeenCalledWith('CPU already guessed that location!');
    });

    test('handles different attacker names', () => {
      const result = { hit: true, sunk: false, alreadyGuessed: false };
      
      renderer.displayAttackResult('Human', '23', result);
      expect(mockConsole.log).toHaveBeenCalledWith('HUMAN HIT at 23!');
      
      renderer.displayAttackResult('CPU', '23', result);
      expect(mockConsole.log).toHaveBeenCalledWith('CPU HIT at 23!');
    });
  });

  describe('displayGameOver', () => {
    test('displays human victory message', () => {
      renderer.displayGameOver('Human');
      
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('CONGRATULATIONS! You sunk all enemy battleships!')
      );
    });

    test('displays CPU victory message', () => {
      renderer.displayGameOver('CPU');
      
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('GAME OVER! The CPU sunk all your battleships!')
      );
    });

    test('displays decorative borders', () => {
      renderer.displayGameOver('Human');
      
      const borderCalls = mockConsole.log.mock.calls.filter(call => 
        call[0].includes('='.repeat(50))
      );
      expect(borderCalls.length).toBe(2); // Top and bottom border
    });
  });

  describe('displayTurn', () => {
    test('displays CPU turn indicator', () => {
      renderer.displayTurn('CPU');
      
      expect(mockConsole.log).toHaveBeenCalledWith("\n--- CPU's Turn ---");
    });

    test('does not display for human turn', () => {
      renderer.displayTurn('Human');
      
      expect(mockConsole.log).not.toHaveBeenCalledWith(
        expect.stringContaining("Human's Turn")
      );
    });
  });

  describe('displayStats', () => {
    test('displays remaining ship counts', () => {
      renderer.displayStats(humanPlayer, cpuPlayer);
      
      const expectedMessage = `\nRemaining ships - You: ${humanPlayer.getRemainingShipsCount()}, CPU: ${cpuPlayer.getRemainingShipsCount()}`;
      expect(mockConsole.log).toHaveBeenCalledWith(expectedMessage);
    });

    test('updates when ships are sunk', () => {
      // Sink one ship for human player
      const firstShip = humanPlayer.board.ships[0];
      firstShip.locations.forEach(location => {
        humanPlayer.board.processGuess(location);
      });
      
      renderer.displayStats(humanPlayer, cpuPlayer);
      
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining(`You: ${GAME_CONFIG.NUM_SHIPS - 1}`)
      );
    });
  });

  describe('clearScreen', () => {
    test('calls console.clear', () => {
      renderer.clearScreen();
      
      expect(mockConsole.clear).toHaveBeenCalled();
    });
  });

  describe('displaySeparator', () => {
    test('displays separator line', () => {
      renderer.displaySeparator();
      
      expect(mockConsole.log).toHaveBeenCalledWith('-'.repeat(40));
    });
  });

  describe('integration tests', () => {
    test('complete game flow display', () => {
      // Start game
      renderer.displayGameStart();
      
      // Show initial boards
      renderer.displayBoards(humanPlayer, cpuPlayer);
      
      // Human turn
      const hitResult = { hit: true, sunk: false, alreadyGuessed: false };
      renderer.displayAttackResult('Human', '23', hitResult);
      
      // CPU turn
      renderer.displayTurn('CPU');
      const missResult = { hit: false, sunk: false, alreadyGuessed: false };
      renderer.displayAttackResult('CPU', '45', missResult);
      
      // Display stats
      renderer.displayStats(humanPlayer, cpuPlayer);
      
      // Verify multiple calls were made
      expect(mockConsole.log.mock.calls.length).toBeGreaterThan(10);
    });

    test('handles rapid sequence of displays', () => {
      // Simulate rapid game progression
      for (let i = 0; i < 5; i++) {
        renderer.displayBoards(humanPlayer, cpuPlayer);
        renderer.displayAttackResult('Human', `2${i}`, { hit: false, sunk: false, alreadyGuessed: false });
        renderer.displayTurn('CPU');
        renderer.displayAttackResult('CPU', `3${i}`, { hit: false, sunk: false, alreadyGuessed: false });
      }
      
      // Should handle all calls without errors
      expect(mockConsole.log.mock.calls.length).toBeGreaterThan(20);
    });
  });
}); 