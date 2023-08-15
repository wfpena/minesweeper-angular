import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { FormControl } from '@angular/forms';
import { GameService } from '../services/game.service';
import { noop } from 'rxjs';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsComponent]
    });
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getMaxBombs()', () => {
    it('should get max bombs value correctly', () => {
      component.width = new FormControl(11, {nonNullable: true});
      component.height = new FormControl(13, {nonNullable: true});
      expect(component.getMaxBombs()).toEqual(128);
    });
  });

  describe('saveSettings()', () => {
    it('should call new game and set correct settings', () => {
      component.width = new FormControl(11, {nonNullable: true});
      component.height = new FormControl(13, {nonNullable: true});
      component.gameService = {gameState:{},newGame:noop} as GameService;
      const newGameSpy = spyOn(component.gameService, 'newGame');
      component.saveSettings();
      expect(newGameSpy).toHaveBeenCalledTimes(1);
      expect(component.gameService.settingsVisible).toBeFalse();
      expect(component.gameService.gameState.bombs).toEqual(10);
    });
  });

  describe('closeSettings()', () => {
    it('should close modal and keep previous settings', () => {
      component.width = new FormControl(11, {nonNullable: true});
      component.height = new FormControl(13, {nonNullable: true});
      component.gameService = {gameState:{bombs:12,gridHeight:11}} as GameService;
      component.closeSettings();
      expect(component.gameService.settingsVisible).toBeFalse();
      expect(component.gameService.gameState.bombs).toEqual(12);
      expect(component.gameService.gameState.gridHeight).toEqual(11);
    });
  });
});
