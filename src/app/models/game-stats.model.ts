export type GameDifficulty = 'easy' | 'medium' | 'hard' | 'custom';

export interface GameStats {
  id?: string;
  startTime: Date;
  endTime?: Date;
  difficulty: GameDifficulty;
  totalTime: number;
  status: string;
  players: number;
}
