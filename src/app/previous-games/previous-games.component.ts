import { Component, Pipe, PipeTransform } from '@angular/core';
import { GameService } from '../services/game.service';
import { GameDifficulty, GameState } from '../models/game-state.model'

@Pipe({name: 'sortGames'})
export class PreviousGamesPipe implements PipeTransform {
  transform(array: GameState[]): any[] {
    if (!Array.isArray(array)) {
      return [];
    }
    const field = 'difficulty';
    const secondarySort = 'totalTime';
    const difficultyMap = {'hard': -1,'medium':0,'easy':1,'custom':2};
    const getDifficultyValue = (difficulty: GameDifficulty): number => (difficultyMap[difficulty]);
    array.sort((a: any, b: any) => {
      return getDifficultyValue(a[field])-getDifficultyValue(b[field]) || a[secondarySort]-b[secondarySort];
    });
    return array;
  }
}

@Component({
  selector: 'app-previous-games',
  templateUrl: './previous-games.component.html',
  styleUrls: ['./previous-games.component.sass'],
})
export class PreviousGamesComponent {
  constructor(public gameService: GameService) {
    gameService.loadPreviousGames();
  }
}
