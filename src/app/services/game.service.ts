import { Injectable } from '@angular/core';
import { Cell } from '../models/cell.model';
import { GameState } from '../models/game-state.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private router: Router) {}

  isTimerRunning = false;
  timeInterval = 0;
  settingsVisible = false;
  previousGamesVisible = false;
  previousGames: GameState[] = [];
  gameState: GameState = {
    bombs: 10,
    time: 0,
    flags: 0,
    numberOfPlayers: 1,
    currentPlayer: 0,
    cells: [],
    players: [],
    plays: 0,
    status: 'idle',
    difficulty: 'easy',
    cellWidth: 32,
    cellHeight: 32,
    gridWidth: 10,
    gridHeight: 10,
    clickedCells: 0,
  };

  saveCurrentGame() {
    if (this.gameState.status !== 'running' || !this.isTimerRunning) {
      alert('No game in progress.');
      return;
    }
    const currentState = this.gameState;
    // TODO: Add many saved games
    const savedGames: GameState[] = [currentState];
    localStorage.setItem('savedGames', JSON.stringify(savedGames));
  }

  newGame() {
    this.loadPreviousGames();
    this.initializeGameState();
    this.resetTimer();
    this.placeBombs();
    this.calculateValues();
  }

  initializeGameState() {
    this.gameState.plays = 0;
    this.gameState.currentPlayer = 0;
    this.gameState.clickedCells = 0;
    this.gameState.players = [];
    for (let i=0;i<this.gameState.numberOfPlayers;i++) {
      this.gameState.players.push({name: `${i}`,score:0});
    }
    this.gameState.status = 'running';
    this.gameState.flags = 0;
    this.gameState.cells = new Array(this.gameState.gridWidth * this.gameState.gridHeight)
      .fill({})
      .map(() => ({clicked: false,value: 0,flag: 0}));
  }

  startTimer() {
    if (this.isTimerRunning) return;
    this.gameState.startTime = new Date();
    this.isTimerRunning = true;
    this.timeInterval = window.setInterval(() => {
      this.gameState.time += 1;
    }, 1000);
  }

  loadPreviousGames(): void {
    const gamesPlayed = localStorage.getItem('gamesPlayed');
    if (gamesPlayed) {
      this.previousGames = JSON.parse(gamesPlayed);
    }
  }

  getSavedGames(): GameState[] {
    return JSON.parse(localStorage.getItem('savedGames') || '[]');
  }

  loadSavedGame(savedGame: GameState): void {
    this.gameState = savedGame;
    this.isTimerRunning = true;
    window.clearInterval(this.timeInterval);
    this.timeInterval = window.setInterval(() => {
      this.gameState.time += 1;
    }, 1000);
    this.router.navigate(['/']);
  }

  resetTimer() {
    this.isTimerRunning = false;
    this.gameState.time = 0;
    window.clearInterval(this.timeInterval);
  }

  stopTimer() {
    this.gameState.endTime = new Date();
    this.gameState.totalTime = this.gameState.time;
    window.clearInterval(this.timeInterval);
  }

  placeBombs() {
    let bombsPlaced = 0;
    while (bombsPlaced < this.gameState.bombs) {
      const rx = Math.floor(Math.random() * this.gameState.gridWidth);
      const ry = Math.floor(Math.random() * this.gameState.gridHeight);
      const i = rx + (ry * this.gameState.gridWidth);
      if (this.gameState.cells[i].value == 0) {
        this.gameState.cells[i].value = -1;
        bombsPlaced += 1;
      }
    }
  }

  calculateValues() {
    for (let i=0; i<this.gameState.gridWidth * this.gameState.gridHeight; i++) {
      if (this.gameState.cells[i].value == -1) continue;
      let adjacentBombs = 0;
      const x = i % this.gameState.gridWidth;
      const y = Math.floor(i / this.gameState.gridWidth);
      for (let offx = -1; offx <= 1; offx++) {
        for (let offy = -1; offy <= 1; offy++) {
          const adjacentCell = this.getCell(x + offx, y + offy);
          if (adjacentCell && adjacentCell.value == -1) {
            adjacentBombs += 1;
          }
        }
      }
      this.gameState.cells[i].value = adjacentBombs;
    }
  }

  getCell(x: number, y: number): Cell | null {
    if (x <= -1 || x >= this.gameState.gridWidth || y <= -1 || y >= this.gameState.gridHeight) {
      return null;
    }
    else {
      const i = x + (y * this.gameState.gridWidth);
      return this.gameState.cells[i];
    }
  }

  onCellFlag(i: number) {
    const x = i % this.gameState.gridWidth;
    const y = Math.floor(i / this.gameState.gridWidth);
    if (x <= -1 || x >= this.gameState.gridWidth || y <= -1 || y >= this.gameState.gridHeight) return;
    this.gameState.cells[i].flag = (this.gameState.cells[i].flag + 1) % 3;
    this.calculateFlags();
  }

  calculateFlags() {
    this.gameState.flags = 0;
    this.gameState.cells.map(cell => {
      this.gameState.flags += cell.flag == 1 ? 1 : 0;
    });
  }

  onCellClick(i: number) {
    if (this.gameState.cells[i].flag === 1) return;
    if (this.gameState.cells[i].value === -1) this.gameLost();
    const x = i%this.gameState.gridWidth;
    const y = Math.floor(i/this.gameState.gridWidth);
    this.clickCell(x, y, this.gameState.currentPlayer);
    this.updatePlayerTurn();
  }

  clickCell(x: number, y: number, currPlayer: number) {
    if (x <= -1 || x >= this.gameState.gridWidth || y <= -1 || y >= this.gameState.gridHeight) return;
    const i = x + y * this.gameState.gridWidth;
    if (this.gameState.cells[i].clicked || this.gameState.cells[i].flag === 1) return;
    this.gameState.cells[i].clicked = true;
    this.gameState.clickedCells++;
    this.gameState.players[currPlayer].score++;
    this.checkIfWin();
    if (this.gameState.cells[i].value == 0) {
      setTimeout(() => {
        for (let offx = -1; offx <= 1; offx++) {
          for (let offy = -1; offy <= 1; offy++) {
            this.clickCell(x + offx, y + offy, currPlayer);
          }
        }
      }, 1);
    }
  }

  checkIfWin(): void {
    const clicked = this.gameState.clickedCells;
    if (clicked == this.gameState.cells.length - this.gameState.bombs) {
      this.gameState.status = 'win';
      this.endGame();
    }
  }

  gameLost(): void {
    this.gameState.players[this.gameState.currentPlayer].score = -1;
    this.gameState.status = 'lose';
    this.endGame();
  }

  endGame() {
    this.stopTimer();
    this.revealBombs();
    this.saveGameStats();
  }

  saveGameStats(): void {
    this.gameState.formatterStatus = this.getWinner().join('\n');
    this.previousGames.push(this.gameState as GameState);
    localStorage.setItem('gamesPlayed', JSON.stringify(this.previousGames));
  }

  updatePlayerTurn() {
    this.gameState.plays++;
    this.gameState.currentPlayer = this.gameState.plays%this.gameState.numberOfPlayers;
  }

  formatRank(rank: number): string {
    const j = rank % 10;
    const k = rank % 100;
    if (j == 1 && k != 11) return rank + 'st';
    if (j == 2 && k != 12) return rank + 'nd';
    if (j == 3 && k != 13) return rank + 'rd';
    return rank + 'th';
  }

  getWinner(): string[] {
    if (this.gameState.numberOfPlayers === 1) {
      if (this.gameState.status === 'win') return ['🥳', 'You Win'];
      return ['Lost'];
    }
    const scoreMap = this.gameState.players.reduce<{ [key: string]: string[] }>((acc,val) => {
      const key = val.score;
      if (!acc[key]) acc[key] = [];
      acc[key].push(val.name);
      return acc;
    }, {});
    const sortedResults = Object.entries(scoreMap);
    sortedResults.sort((a,b)=> Number(b[0]) - Number(a[0]));
    return sortedResults.reduce((acc, val, idx) => {
      acc.push(`\n${this.formatRank(idx+1)}. Player ${val[1].join(' and ')}\n\n\n`)
      return acc;
    }, [] as string[]);
  }

  revealBombs() {
    this.gameState.cells.map(cell => {
      if (cell.value == -1) {
        cell.clicked = true;
      }
    });
  }

  clearScoreBoard() {
    this.previousGames = [];
    localStorage.removeItem('gamesPlayed');
  }
}
