import { Injectable } from '@angular/core';
import { Cell } from '../models/cell.model';
import { Player } from '../models/player.model';
import { GameDifficulty, GameStats } from '../models/game-stats.model';

type GameState = 'run' | 'lose' | 'win';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  currentGameState: GameState;
  cellWidth = 32;
  cellHeight = 32;
  gridWidth = 10;
  gridHeight = 10;
  isTimerRunning = false;
  time = 0;
  bombs = 10;
  flags = 0;
  players = 1;
  playerStats: Player[];
  currentPlayer = 0;
  plays = 0;
  difficulty: GameDifficulty = 'easy';
  cells: Cell[] = [];
  timeInterval: number = 0;
  settingsVisible = false;
  previousGamesVisible = false;
  previousGames: GameStats[] = [];
  currentGameStats: Partial<GameStats>;

  newGame() {
    this.loadPreviousGames();
    this.plays = 0;
    this.currentPlayer = 0;
    this.playerStats = [];
    for (let i=0;i<this.players;i++) {
      this.playerStats.push({name: `${i}`,score:0});
    }
    this.currentGameState = 'run';
    this.currentGameStats = {};
    this.flags = 0;
    this.cells = new Array(this.gridWidth * this.gridHeight)
      .fill({})
      .map(() => ({clicked: false,value: 0,flag: 0}));
    this.restartTimer();
    this.placeBombs();
    this.calculateValues();
  }

  startTimer() {
    if (this.isTimerRunning) return;
    this.currentGameStats.startTime = new Date();
    this.currentGameStats.difficulty = this.difficulty;
    this.currentGameStats.players = this.players;
    this.isTimerRunning = true;
    this.timeInterval = window.setInterval(() => {
      this.time += 1;
    }, 1000);
  }

  loadPreviousGames(): void {
    const gamesPlayed = localStorage.getItem('gamesPlayed');
    if (gamesPlayed) {
      this.previousGames = JSON.parse(gamesPlayed);
    }
  }

  restartTimer() {
    this.isTimerRunning = false;
    this.time = 0;
    window.clearInterval(this.timeInterval);
  }

  stopTimer() {
    this.currentGameStats.endTime = new Date();
    this.currentGameStats.totalTime = this.time;
    window.clearInterval(this.timeInterval);
  }

  placeBombs() {
    let bombsPlaced = 0;
    while (bombsPlaced < this.bombs) {
      const rx = Math.floor(Math.random() * this.gridWidth);
      const ry = Math.floor(Math.random() * this.gridHeight);
      const i = rx + (ry * this.gridWidth);
      if (this.cells[i].value == 0) {
        this.cells[i].value = -1;
        bombsPlaced += 1;
      }
    }
  }

  calculateValues() {
    for (let i=0; i<this.gridWidth * this.gridHeight; i++) {
      if (this.cells[i].value == -1) continue;
      let adjacentBombs = 0;
      const x = i % this.gridWidth;
      const y = Math.floor(i / this.gridWidth);
      for (let offx = -1; offx <= 1; offx++) {
        for (let offy = -1; offy <= 1; offy++) {
          const adjacentCell = this.getCell(x + offx, y + offy);
          if (adjacentCell && adjacentCell.value == -1) {
            adjacentBombs += 1;
          }
        }
      }
      this.cells[i].value = adjacentBombs;
    }
  }

  getCell(x: number, y: number): Cell | null {
    if (x <= -1 || x >= this.gridWidth || y <= -1 || y >= this.gridHeight) {
      return null;
    }
    else {
      const i = x + (y * this.gridWidth);
      return this.cells[i];
    }
  }

  onCellFlag(i: number) {
    const x = i % this.gridWidth;
    const y = Math.floor(i / this.gridWidth);
    if (x <= -1 || x >= this.gridWidth || y <= -1 || y >= this.gridHeight) return;
    this.cells[i].flag = (this.cells[i].flag + 1) % 3;
    this.calculateFlags();
  }

  calculateFlags() {
    this.flags = 0;
    this.cells.map(cell => {
      this.flags += cell.flag == 1 ? 1 : 0;
    });
  }

  onCellClick(i: number) {
    if (this.cells[i].flag) return;
    if (this.cells[i].value === -1) this.endGame();
    const x = i%this.gridWidth;
    const y = Math.floor(i/this.gridWidth);
    this.clickCell(x, y, this.currentPlayer);
    this.updatePlayerTurn();
  }

  clickCell(x: number, y: number, currPlayer: number) {
    if (x <= -1 || x >= this.gridWidth || y <= -1 || y >= this.gridHeight) return;
    const i = x + y * this.gridWidth;
    if (this.cells[i].clicked || this.cells[i].flag) return;
    this.cells[i].clicked = true;
    this.playerStats[currPlayer].score++;
    this.checkIfWin();
    if (this.cells[i].value == 0) {
      setTimeout(() => {
        for (let offx = -1; offx <= 1; offx++) {
          for (let offy = -1; offy <= 1; offy++) {
            this.clickCell(x + offx, y + offy, currPlayer);
          }
        }
      }, 1);
    }
  }

  checkIfWin() {
    let clicked = 0;
    this.cells.map(cell => {
      if (cell.clicked) {
        clicked++
      }
    });
    if (clicked == this.cells.length - this.bombs) {
      this.currentGameState = 'win';
      this.stopTimer();
      this.revealBombs();
      this.saveGameStats();
    }
  }

  endGame() {
    this.playerStats[this.currentPlayer].score = -1;
    this.currentGameState = 'lose';
    this.stopTimer();
    this.revealBombs();
    this.saveGameStats();
  }

  saveGameStats(): void {
    this.currentGameStats.status = this.getWinner().join('\n');
    this.previousGames.push(this.currentGameStats as GameStats);
    localStorage.setItem('gamesPlayed', JSON.stringify(this.previousGames));
  }

  updatePlayerTurn() {
    this.plays++;
    this.currentPlayer = this.plays%this.players;
  }

  formatRank(rank: number): string {
    const j = rank % 10, k = rank % 100;
    if (j == 1 && k != 11) {
        return rank + 'st';
    }
    if (j == 2 && k != 12) {
        return rank + 'nd';
    }
    if (j == 3 && k != 13) {
        return rank + 'rd';
    }
    return rank + 'th';
  }

  getWinner(): string[] {
    if (this.players === 1) {
      if (this.currentGameState === 'win') {
        return ['🥳', 'You Win'];
      }
      return ['Lost'];
    }
    const scoreMap = this.playerStats.reduce<{ [key: string]: string[] }>((acc,val) => {
      const key = val.score;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(val.name);
      return acc;
    }, {});
    const sortedResults = Object.entries(scoreMap);
    sortedResults.sort((a,b)=>Number(b[0])-Number(a[0]));
    return sortedResults.reduce((acc, val, idx) => {
      acc.push(`\n${this.formatRank(idx+1)}. Player ${val[1].join(' and ')}\n\n\n`)
      return acc;
    }, [] as string[]);
  }

  revealBombs() {
    this.cells.map(cell => {
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
