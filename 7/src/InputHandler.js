import readline from 'readline';

/**
 * InputHandler manages user input using modern async/await patterns
 */
export class InputHandler {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * Get user input asynchronously
   * @param {string} question - Question to ask the user
   * @returns {Promise<string>} Promise that resolves to user input
   */
  getInput(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  /**
   * Close the input interface
   */
  close() {
    this.rl.close();
  }

  /**
   * Get confirmation from user (y/n)
   * @param {string} question - Question to ask
   * @returns {Promise<boolean>} Promise that resolves to true for yes, false for no
   */
  async getConfirmation(question) {
    while (true) {
      const answer = await this.getInput(`${question} (y/n): `);
      const normalized = answer.toLowerCase();
      
      if (normalized === 'y' || normalized === 'yes') {
        return true;
      } else if (normalized === 'n' || normalized === 'no') {
        return false;
      }
      
      console.log('Please enter y or n.');
    }
  }

  /**
   * Wait for user to press Enter
   * @param {string} message - Message to display
   * @returns {Promise<void>} Promise that resolves when user presses Enter
   */
  async waitForEnter(message = 'Press Enter to continue...') {
    await this.getInput(message);
  }
} 