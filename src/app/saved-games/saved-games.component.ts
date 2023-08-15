import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { SavedGame } from '../models/saved-game.model';

@Component({
  selector: 'app-saved-games',
  templateUrl: './saved-games.component.html',
  styleUrls: ['../previous-games/previous-games.component.sass']
})
export class SavedGamesComponent {
  savedGames: SavedGame[];
  constructor(public gameService: GameService) {
    this.savedGames = gameService.getSavedGames();
  }
}
