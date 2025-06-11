import { Player, HumanPlayer, CPUPlayer } from '../src/Player.js';
import { GAME_CONFIG, CPU_MODES } from '../src/constants.js';

// Mock InputHandler for HumanPlayer tests
const mockInputHandler = {
  getInput: jest.fn()
};

// Mock Math.random for deterministic tests
const originalRandom = Math.random;
const mockRandom = (values) => {
  let index = 0;
  Math.random = jest.fn(() => {
    if (index >= values.length) index = 0;
    return values[index++];
  });
};

describe('Player', () => {
  let player;

  beforeEach(() => {
    player = new Player('TestPlayer', false);
  });

  afterEach(() => {
    Math.random = originalRandom;
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('creates player with correct name', () => {
      expect(player.name).toBe('TestPlayer');
    });

    test('creates board and opponent board', () => {
      expect(player.board).toBeDefined();
      expect(player.opponentBoard).toBeDefined();
    });

    test('sets up board with ships', () => {
      expect(player.board.ships.length).toBe(GAME_CONFIG.NUM_SHIPS);
    });
  });

  describe('hasLost', () => {
    test('returns false when ships remain', () => {
      expect(player.hasLost()).toBe(false);
    });

    test('returns true when all ships sunk', () => {
      // Sink all ships
      player.board.ships.forEach(ship => {
        ship.locations.forEach(location => {
          player.board.processGuess(location);
        });
      });
      expect(player.hasLost()).toBe(true);
    });
  });

  describe('getRemainingShipsCount', () => {
    test('returns correct initial count', () => {
      expect(player.getRemainingShipsCount()).toBe(GAME_CONFIG.NUM_SHIPS);
    });
  });

  describe('receiveAttack', () => {
    test('processes attack on player board', () => {
      const result = player.receiveAttack('99');
      expect(result).toHaveProperty('hit');
      expect(result).toHaveProperty('sunk');
      expect(result).toHaveProperty('alreadyGuessed');
    });
  });

  describe('makeGuess', () => {
    test('throws error for base Player class', async () => {
      await expect(player.makeGuess()).rejects.toThrow('makeGuess method must be implemented by subclasses');
    });
  });

  describe('processGuessResult', () => {
    test('updates opponent board with hit', () => {
      const result = { hit: true, sunk: false };
      player.processGuessResult('23', result);
      expect(player.opponentBoard.grid[2][3]).toBe('X');
      expect(player.opponentBoard.guesses.has('23')).toBe(true);
    });

    test('updates opponent board with miss', () => {
      const result = { hit: false, sunk: false };
      player.processGuessResult('45', result);
      expect(player.opponentBoard.grid[4][5]).toBe('O');
      expect(player.opponentBoard.guesses.has('45')).toBe(true);
    });
  });
});

describe('HumanPlayer', () => {
  let humanPlayer;

  beforeEach(() => {
    humanPlayer = new HumanPlayer(mockInputHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('creates human player with correct name', () => {
      expect(humanPlayer.name).toBe('Human');
    });

    test('shows ships on board', () => {
      expect(humanPlayer.board.showShips).toBe(true);
    });

    test('stores input handler', () => {
      expect(humanPlayer.inputHandler).toBe(mockInputHandler);
    });
  });

  describe('makeGuess', () => {
    test('accepts valid input', async () => {
      mockInputHandler.getInput.mockResolvedValue('23');
      const guess = await humanPlayer.makeGuess();
      expect(guess).toBe('23');
    });

    test('rejects invalid input and retries', async () => {
      mockInputHandler.getInput
        .mockResolvedValueOnce('abc') // Invalid
        .mockResolvedValueOnce('999') // Invalid
        .mockResolvedValueOnce('23');  // Valid
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const guess = await humanPlayer.makeGuess();
      
      expect(guess).toBe('23');
      expect(mockInputHandler.getInput).toHaveBeenCalledTimes(3);
      expect(consoleSpy).toHaveBeenCalledWith('Oops, input must be exactly two digits (e.g., 00, 34, 98).');
      
      consoleSpy.mockRestore();
    });

    test('rejects already guessed location', async () => {
      // Mark location as already guessed
      humanPlayer.opponentBoard.guesses.add('23');
      
      mockInputHandler.getInput
        .mockResolvedValueOnce('23') // Already guessed
        .mockResolvedValueOnce('45'); // Valid new guess
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const guess = await humanPlayer.makeGuess();
      
      expect(guess).toBe('45');
      expect(consoleSpy).toHaveBeenCalledWith('You already guessed that location!');
      
      consoleSpy.mockRestore();
    });
  });
});

describe('CPUPlayer', () => {
  let cpuPlayer;

  beforeEach(() => {
    cpuPlayer = new CPUPlayer();
  });

  afterEach(() => {
    Math.random = originalRandom;
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('creates CPU player with correct name', () => {
      expect(cpuPlayer.name).toBe('CPU');
    });

    test('does not show ships on board', () => {
      expect(cpuPlayer.board.showShips).toBe(false);
    });

    test('initializes in hunt mode', () => {
      expect(cpuPlayer.mode).toBe(CPU_MODES.HUNT);
      expect(cpuPlayer.targetQueue).toEqual([]);
      expect(cpuPlayer.lastHit).toBeNull();
    });
  });

  describe('makeGuess in hunt mode', () => {
    test('makes random guess in hunt mode', async () => {
      mockRandom([0.23, 0.45]); // Should result in guess "23"
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const guess = await cpuPlayer.makeGuess();
      
      expect(guess).toBe('24'); // row 2, col 4 based on mocked random
      expect(consoleSpy).toHaveBeenCalledWith('CPU guesses: 24');
      
      consoleSpy.mockRestore();
    });

    test('avoids already guessed locations', async () => {
      // Mark some locations as already guessed
      cpuPlayer.opponentBoard.guesses.add('23');
      cpuPlayer.opponentBoard.guesses.add('24');
      
      mockRandom([0.23, 0.34, 0.23, 0.45, 0.56, 0.78]); // Multiple random values
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const guess = await cpuPlayer.makeGuess();
      
      expect(guess).not.toBe('23');
      expect(guess).not.toBe('24');
      expect(guess).toMatch(/^\d\d$/);
      
      consoleSpy.mockRestore();
    });
  });

  describe('makeGuess in target mode', () => {
    test('uses target queue when in target mode', async () => {
      cpuPlayer.mode = CPU_MODES.TARGET;
      cpuPlayer.targetQueue = ['12', '32', '21', '23'];
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const guess = await cpuPlayer.makeGuess();
      
      expect(guess).toBe('12');
      expect(cpuPlayer.targetQueue).toEqual(['32', '21', '23']);
      
      consoleSpy.mockRestore();
    });

    test('skips already guessed targets', async () => {
      cpuPlayer.mode = CPU_MODES.TARGET;
      cpuPlayer.targetQueue = ['12', '13', '14'];
      cpuPlayer.opponentBoard.guesses.add('12');
      cpuPlayer.opponentBoard.guesses.add('13');
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const guess = await cpuPlayer.makeGuess();
      
      expect(guess).toBe('14');
      
      consoleSpy.mockRestore();
    });

    test('switches to hunt mode when target queue empty', async () => {
      cpuPlayer.mode = CPU_MODES.TARGET;
      cpuPlayer.targetQueue = [];
      
      mockRandom([0.5, 0.5]);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // The CPU should switch to hunt mode internally when target queue is empty
      const guess = await cpuPlayer.makeGuess();
      
      // After making a guess with empty target queue, it should be in hunt mode
      expect(cpuPlayer.mode).toBe(CPU_MODES.HUNT);
      expect(guess).toMatch(/^\d\d$/);
      
      consoleSpy.mockRestore();
    });
  });

  describe('processGuessResult', () => {
    test('switches to target mode on hit', () => {
      const result = { hit: true, sunk: false };
      cpuPlayer.processGuessResult('23', result);
      
      expect(cpuPlayer.mode).toBe(CPU_MODES.TARGET);
      expect(cpuPlayer.lastHit).toBe('23');
      expect(cpuPlayer.targetQueue.length).toBeGreaterThan(0);
    });

    test('returns to hunt mode when ship sunk', () => {
      cpuPlayer.mode = CPU_MODES.TARGET;
      cpuPlayer.targetQueue = ['12', '32'];
      cpuPlayer.lastHit = '22';
      
      const result = { hit: true, sunk: true };
      cpuPlayer.processGuessResult('23', result);
      
      expect(cpuPlayer.mode).toBe(CPU_MODES.HUNT);
      expect(cpuPlayer.targetQueue).toEqual([]);
      expect(cpuPlayer.lastHit).toBeNull();
    });

    test('stays in hunt mode on miss in hunt mode', () => {
      const result = { hit: false, sunk: false };
      cpuPlayer.processGuessResult('23', result);
      
      expect(cpuPlayer.mode).toBe(CPU_MODES.HUNT);
    });

    test('switches to hunt mode on miss with empty target queue', () => {
      cpuPlayer.mode = CPU_MODES.TARGET;
      cpuPlayer.targetQueue = [];
      
      const result = { hit: false, sunk: false };
      cpuPlayer.processGuessResult('23', result);
      
      expect(cpuPlayer.mode).toBe(CPU_MODES.HUNT);
    });

    test('adds adjacent targets on hit', () => {
      const result = { hit: true, sunk: false };
      cpuPlayer.processGuessResult('55', result);
      
      const expectedTargets = ['45', '65', '54', '56'];
      expectedTargets.forEach(target => {
        expect(cpuPlayer.targetQueue).toContain(target);
      });
    });

    test('does not add invalid adjacent targets', () => {
      const result = { hit: true, sunk: false };
      cpuPlayer.processGuessResult('00', result); // Corner position
      
      // Should only add valid adjacent positions
      const validTargets = cpuPlayer.targetQueue.filter(target => {
        const row = parseInt(target[0]);
        const col = parseInt(target[1]);
        return row >= 0 && row < GAME_CONFIG.BOARD_SIZE && 
               col >= 0 && col < GAME_CONFIG.BOARD_SIZE;
      });
      
      expect(cpuPlayer.targetQueue.length).toBe(validTargets.length);
    });

    test('does not add already guessed adjacent targets', () => {
      cpuPlayer.opponentBoard.guesses.add('45');
      cpuPlayer.opponentBoard.guesses.add('54');
      
      const result = { hit: true, sunk: false };
      cpuPlayer.processGuessResult('55', result);
      
      expect(cpuPlayer.targetQueue).not.toContain('45');
      expect(cpuPlayer.targetQueue).not.toContain('54');
    });
  });
}); 