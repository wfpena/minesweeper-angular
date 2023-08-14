import { Component, Input, OnInit } from '@angular/core';
import { Cell } from '../models/cell.model';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-cell-button',
  templateUrl: './cell-button.component.html'
})
export class CellComponent implements OnInit {
  @Input() index: number;
  @Input() cell: Cell;
  flagSymbol = '';
  symbol = '';
  symbolColor = 'cyan';

  constructor(public gameService: GameService) { }

  ngOnInit() {
    if (this.cell && this.cell.value == -1) {
      this.symbol = '💣';
    }
    else if (this.cell && this.cell.value > 0) {
      this.symbol = this.cell.value.toString();
      switch (this.cell.value) {
        case 1: this.symbolColor = '#00ffff'; break;
        case 2: this.symbolColor = '#00ff00'; break;
        case 3: this.symbolColor = '#ffbe00'; break;
        case 4: this.symbolColor = '#2f0076'; break;
        case 5: this.symbolColor = '#8c0000'; break;
        case 6: this.symbolColor = '#34b200'; break;
        case 7: this.symbolColor = 'black'; break;
        case 8: this.symbolColor = '#aeaeae'; break;
      }
    }
  }

  onClick() {
    this.gameService.startTimer();
    if (this.cell.value == -1) {
      this.symbol = '💥';
    }
    this.gameService.onCellClick(this.index);
  }

  onRightClick() {
    this.gameService.startTimer();
    this.gameService.onCellFlag(this.index);
    switch (this.cell.flag) {
      case 0: this.flagSymbol = ''; break;
      case 1: this.flagSymbol = '🚩'; break;
      case 2: this.flagSymbol = '?'; break;
    }
    return false;
  }
}
