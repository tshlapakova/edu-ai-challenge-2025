#!/usr/bin/env node

import { Game } from './Game.js';

/**
 * Main entry point for the Sea Battle game
 */
async function main() {
  const game = new Game();
  
  try {
    await game.start();
  } catch (error) {
    game.handleError(error);
  }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\n\nGame interrupted. Thanks for playing!');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\nGame terminated. Thanks for playing!');
  process.exit(0);
});

// Start the game
main().catch((error) => {
  console.error('Failed to start game:', error.message);
  process.exit(1);
}); 