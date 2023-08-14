import { Component } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  animations: [
    trigger('gradientOverlay', [
      transition(':enter', [
        style({
          backgroundPosition: '110% 110%'
        }),
      ])
    ]),
    trigger('stateOverlay', [
      transition(':enter', [
        style({
          opacity: 0
        }),
        animate('100ms 500ms', style({
          opacity: 1
        }))
      ])
    ])
  ]
})
export class BoardComponent {

  constructor(public gameService: GameService) {
    if (gameService.currentGameState !== 'run') {
      gameService.newGame();
    }
  }

  getBoardStyle() {
    return {
      'grid-template-columns': `repeat(${this.gameService.gridWidth}, ${this.gameService.cellWidth}px)`,
      'grid-template-rows': `repeat(${this.gameService.gridHeight}, ${this.gameService.cellHeight}px)`,
    }
  }
}
