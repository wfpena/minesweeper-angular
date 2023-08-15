import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { GameState } from '../models/game-state.model';

@Component({
  selector: 'app-saved-games',
  templateUrl: './saved-games.component.html',
  styleUrls: ['../previous-games/previous-games.component.sass']
})
export class SavedGamesComponent {
  savedGames: GameState[];
  constructor(public gameService: GameService) {
    this.savedGames = gameService.getSavedGames();
  }
}
