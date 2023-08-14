import type { Configuration } from 'webpack';
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as webpack from 'webpack';

console.log(`\n\nRunning webpack for production environment...\n`);

module.exports = {
  mode: 'production',
  entry: {
    'app': 'src/main.ts'
  },
  output: {
    path: path.join(__dirname, 'dist/minesweeper-angular'),
    filename: '[name].[fullhash].bundle.js',
  }
} as Configuration;
