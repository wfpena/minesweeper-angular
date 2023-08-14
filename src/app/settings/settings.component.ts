import { Component, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { trigger, style, animate, transition, query, animateChild, group } from '@angular/animations';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  animations: [
    trigger('modal', [
      transition(':enter', [
        group([
          query('@overlay', animateChild()),
          query('@container', animateChild())
        ])
      ]),
      transition(':leave', [
        group([
          query('@overlay', animateChild()),
          query('@container', animateChild())
        ])
      ])
    ]),
    trigger('overlay', [
      transition(':enter', [
        style({
          opacity: 0
        }),
        animate('100ms', style({
          opacity: 1
        }))
      ]),
      transition(':leave', [
        style({
          opacity: 1
        }),
        animate('100ms', style({
          opacity: 0
        })),
      ])
    ]),
    trigger('container', [
      transition(':enter', [
        style({
          marginTop: '100px'
        }),
        animate('100ms', style({
          marginTop: '0px'
        })),
      ]),
      transition(':leave', [
        style({
          marginTop: '0px'
        }),
        animate('100ms', style({
          marginTop: '-100px'
        })),
      ]),
    ])
  ],
})
export class SettingsComponent implements AfterViewChecked {
  width = new FormControl(this.gameService.gridWidth, {nonNullable: true});
  height = new FormControl(this.gameService.gridHeight, {nonNullable: true});
  difficultyForm = new FormGroup({difficulty: new FormControl(this.gameService.difficulty)});
  bombs = new FormControl(this.gameService.bombs);
  players = new FormControl(this.gameService.players);

  constructor(
    private cdr: ChangeDetectorRef,
    public gameService: GameService
  ) { }

  saveSettings() {
    this.gameService.settingsVisible = false;
    this.gameService.gridWidth = this.width.value || 10;
    this.gameService.gridHeight = this.height.value || 10;
    this.gameService.bombs = this.bombs.value || 10;
    this.gameService.players = this.players.value || 1;
    this.gameService.difficulty = this.difficultyForm.controls['difficulty'].value || 'easy';
    this.gameService.newGame();
  }

  closeSettings() {
    this.gameService.settingsVisible = false;
    this.gameService.settingsVisible = false;
    this.width.setValue(this.gameService.gridWidth);
    this.height.setValue(this.gameService.gridHeight);
    this.bombs.setValue(this.gameService.bombs);
    this.players.setValue(this.gameService.players);
    this.difficultyForm.controls['difficulty'].setValue(this.gameService.difficulty);
  }

  getMaxBombs() {
    return Math.floor(this.width.value * this.height.value * 0.9);
  }

  ngAfterViewChecked() {
    this.bombs.setValue(Math.min(this.getMaxBombs(), this.bombs.value || 10));
    this.cdr.detectChanges();
  }

  onDifficultyChange() {
    const selectedDifficulty = this.difficultyForm.controls['difficulty'].value;
    if (!selectedDifficulty) return;
    if (selectedDifficulty === 'easy') {
      this.width.setValue(10);
      this.height.setValue(10);
      this.bombs.setValue(10);
    } else if (selectedDifficulty === 'medium') {
      this.width.setValue(16);
      this.height.setValue(16);
      this.bombs.setValue(40);
    } else if (selectedDifficulty === 'hard') {
      this.width.setValue(16);
      this.height.setValue(30);
      this.bombs.setValue(99);
    }
  }

  parametersChanged() {
    this.difficultyForm.setValue({difficulty:'custom'});
  }
}
