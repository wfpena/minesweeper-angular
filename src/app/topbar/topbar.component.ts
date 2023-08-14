import { Component } from '@angular/core';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.sass']
})
export class TopbarComponent {
  constructor(public gameService: GameService) { }
}
