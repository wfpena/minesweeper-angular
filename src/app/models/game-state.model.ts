import { Cell } from './cell.model';
import { Player } from './player.model';

export type GameDifficulty = 'easy' | 'medium' | 'hard' | 'custom';
export type GameStatus = 'running' | 'lose' | 'win' | 'idle';

export interface GameState {
  id?: string;
  startTime?: Date;
  endTime?: Date;
  formatterStatus?: string;
  difficulty: GameDifficulty;
  totalTime?: number;
  plays: number;
  numberOfPlayers: number;
  currentPlayer: number;
  players: Player[];
  cells: Cell[];
  flags: number;
  bombs: number;
  time: number;
  cellWidth: number;
  cellHeight: number;
  gridWidth: number;
  gridHeight: number;
  status: GameStatus,
  clickedCells: number;
}
