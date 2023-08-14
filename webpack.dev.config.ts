import type { Configuration } from 'webpack';
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as webpack from 'webpack';

console.log(`\n\nRunning webpack for DEV environment...\n`);

module.exports = {
  mode: 'development',
  entry: {
    'app': 'src/main.ts'
  },
  watch: true,
  output: {
    path: path.join(__dirname, 'dist/minesweeper-angular'),
    filename: '[name].bundle.js',
  }
} as Configuration;
