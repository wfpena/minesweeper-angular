import { Component, Pipe, PipeTransform } from '@angular/core';
import { GameService } from '../services/game.service';
import { GameDifficulty, GameStats } from '../models/game-stats.model'

// TODO: Not sorting correctly
@Pipe({name: 'sortGames'})
export class PreviousGamesPipe implements PipeTransform {
  transform(array: GameStats[], field: string): any[] {
    if (!Array.isArray(array)) {
      return [];
    }
    const difficultyMap = {'hard': -1,'medium':0,'easy':1,'custom':2};
    const getDifficultyValue = (difficulty: GameDifficulty): number => (difficultyMap[difficulty]);
    array.sort((a: any, b: any) => {
      if (getDifficultyValue(a[field]) < getDifficultyValue(b[field])) {
        return -1;
      } else if (getDifficultyValue(a[field]) > getDifficultyValue(b[field])) {
        return 1;
      } else {
        return 0;
      }
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
