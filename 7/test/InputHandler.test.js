import { InputHandler } from '../src/InputHandler.js';

// Mock readline
jest.mock('readline', () => ({
  createInterface: jest.fn(() => ({
    question: jest.fn(),
    close: jest.fn()
  }))
}));

import readline from 'readline';

describe('InputHandler', () => {
  let inputHandler;
  let mockRl;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Set up mock readline interface
    mockRl = {
      question: jest.fn(),
      close: jest.fn()
    };
    readline.createInterface.mockReturnValue(mockRl);
    
    inputHandler = new InputHandler();
  });

  describe('constructor', () => {
    test('creates readline interface', () => {
      expect(readline.createInterface).toHaveBeenCalledWith({
        input: process.stdin,
        output: process.stdout,
      });
    });

    test('stores readline interface', () => {
      expect(inputHandler.rl).toBe(mockRl);
    });
  });

  describe('getInput', () => {
    test('returns user input', async () => {
      const userInput = 'test input';
      mockRl.question.mockImplementation((question, callback) => {
        callback(userInput);
      });

      const result = await inputHandler.getInput('Enter something: ');
      
      expect(result).toBe(userInput);
      expect(mockRl.question).toHaveBeenCalledWith(
        'Enter something: ',
        expect.any(Function)
      );
    });

    test('trims whitespace from input', async () => {
      const userInput = '  test input  ';
      mockRl.question.mockImplementation((question, callback) => {
        callback(userInput);
      });

      const result = await inputHandler.getInput('Enter something: ');
      
      expect(result).toBe('test input');
    });

    test('handles empty input', async () => {
      const userInput = '';
      mockRl.question.mockImplementation((question, callback) => {
        callback(userInput);
      });

      const result = await inputHandler.getInput('Enter something: ');
      
      expect(result).toBe('');
    });

    test('handles multiple consecutive calls', async () => {
      const inputs = ['first', 'second', 'third'];
      let callCount = 0;
      
      mockRl.question.mockImplementation((question, callback) => {
        callback(inputs[callCount++]);
      });

      const results = await Promise.all([
        inputHandler.getInput('First: '),
        inputHandler.getInput('Second: '),
        inputHandler.getInput('Third: ')
      ]);
      
      expect(results).toEqual(inputs);
      expect(mockRl.question).toHaveBeenCalledTimes(3);
    });
  });

  describe('close', () => {
    test('closes readline interface', () => {
      inputHandler.close();
      
      expect(mockRl.close).toHaveBeenCalled();
    });
  });

  describe('getConfirmation', () => {
    test('returns true for "y"', async () => {
      mockRl.question.mockImplementation((question, callback) => {
        callback('y');
      });

      const result = await inputHandler.getConfirmation('Continue?');
      
      expect(result).toBe(true);
    });

    test('returns true for "yes"', async () => {
      mockRl.question.mockImplementation((question, callback) => {
        callback('yes');
      });

      const result = await inputHandler.getConfirmation('Continue?');
      
      expect(result).toBe(true);
    });

    test('returns false for "n"', async () => {
      mockRl.question.mockImplementation((question, callback) => {
        callback('n');
      });

      const result = await inputHandler.getConfirmation('Continue?');
      
      expect(result).toBe(false);
    });

    test('returns false for "no"', async () => {
      mockRl.question.mockImplementation((question, callback) => {
        callback('no');
      });

      const result = await inputHandler.getConfirmation('Continue?');
      
      expect(result).toBe(false);
    });

    test('handles case insensitive input', async () => {
      const inputs = ['Y', 'YES', 'N', 'NO'];
      const expectedResults = [true, true, false, false];
      
      for (let i = 0; i < inputs.length; i++) {
        mockRl.question.mockImplementation((question, callback) => {
          callback(inputs[i]);
        });

        const result = await inputHandler.getConfirmation('Continue?');
        expect(result).toBe(expectedResults[i]);
      }
    });

    test('retries on invalid input', async () => {
      let callCount = 0;
      const responses = ['maybe', 'x', 'yes'];
      
      // Mock console.log to suppress retry messages
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      mockRl.question.mockImplementation((question, callback) => {
        callback(responses[callCount++]);
      });

      const result = await inputHandler.getConfirmation('Continue?');
      
      expect(result).toBe(true);
      expect(mockRl.question).toHaveBeenCalledTimes(3);
      expect(consoleSpy).toHaveBeenCalledWith('Please enter y or n.');
      
      consoleSpy.mockRestore();
    });

    test('formats confirmation question correctly', async () => {
      mockRl.question.mockImplementation((question, callback) => {
        callback('y');
      });

      await inputHandler.getConfirmation('Do you want to continue?');
      
      expect(mockRl.question).toHaveBeenCalledWith(
        'Do you want to continue? (y/n): ',
        expect.any(Function)
      );
    });
  });

  describe('waitForEnter', () => {
    test('waits for user input with default message', async () => {
      mockRl.question.mockImplementation((question, callback) => {
        callback('');
      });

      await inputHandler.waitForEnter();
      
      expect(mockRl.question).toHaveBeenCalledWith(
        'Press Enter to continue...',
        expect.any(Function)
      );
    });

    test('waits for user input with custom message', async () => {
      const customMessage = 'Press any key to start...';
      mockRl.question.mockImplementation((question, callback) => {
        callback('');
      });

      await inputHandler.waitForEnter(customMessage);
      
      expect(mockRl.question).toHaveBeenCalledWith(
        customMessage,
        expect.any(Function)
      );
    });

    test('resolves regardless of input content', async () => {
      mockRl.question.mockImplementation((question, callback) => {
        callback('some random input');
      });

      const result = await inputHandler.waitForEnter();
      
      expect(result).toBeUndefined();
    });
  });

  describe('integration tests', () => {
    test('handles complex input workflow', async () => {
      let callCount = 0;
      const responses = ['23', 'y', '', 'n'];
      
      mockRl.question.mockImplementation((question, callback) => {
        callback(responses[callCount++]);
      });

      // Simulate game input sequence
      const guess = await inputHandler.getInput('Enter guess: ');
      const playAgain = await inputHandler.getConfirmation('Play again?');
      await inputHandler.waitForEnter('Press Enter...');
      const exit = await inputHandler.getConfirmation('Exit?');

      expect(guess).toBe('23');
      expect(playAgain).toBe(true);
      expect(exit).toBe(false);
      expect(mockRl.question).toHaveBeenCalledTimes(4);
    });

    test('handles input handler lifecycle', () => {
      // Create new handler
      const handler = new InputHandler();
      expect(readline.createInterface).toHaveBeenCalled();

      // Use handler
      handler.getInput('test');
      expect(mockRl.question).toHaveBeenCalled();

      // Close handler
      handler.close();
      expect(mockRl.close).toHaveBeenCalled();
    });
  });
}); 