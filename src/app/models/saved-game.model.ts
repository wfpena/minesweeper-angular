import { Cell } from "./cell.model";
import { GameStats } from "./game-stats.model";
import { Player } from "./player.model";

export interface SavedGame {
  plays: number;
  currentPlayer: number;
  playerStats: Player[];
  cells: Cell[];
  flags: number;
  bombs: number;
  time: number;
  cellWidth: number;
  cellHeight: number;
  gridWidth: number;
  gridHeight: number;
  currentGameStats: GameStats;
}
