/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellComponent } from './cell-button.component';
import { noop } from 'rxjs';
import { GameService } from '../services/game.service';

describe('CellComponent', () => {
  let component: CellComponent;
  let fixture: ComponentFixture<CellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CellComponent]
    });
    fixture = TestBed.createComponent(CellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set symbol to bomb if value -1', () => {
      component.cell = {clicked:false,flag:0,value:-1};
      component.ngOnInit();
      expect(component.symbol).toEqual('💣');
    });

    it('should set correct symbol color for cell value - case 1', () => {
      component.cell = {clicked:false,flag:0,value:8};
      component.ngOnInit();
      expect(component.symbolColor).toEqual('#aeaeae');
    });

    it('should set correct symbol color for cell value - case 2', () => {
      component.cell = {clicked:false,flag:0,value:5};
      component.ngOnInit();
      expect(component.symbolColor).toEqual('#8c0000');
    });

    [
      [1, '#00ffff'],
      [2, '#00ff00'],
      [3, '#ffbe00'],
      [4, '#2f0076'],
      [6, '#34b200'],
      [7, 'black'],
    ].forEach(([value, expectedResult]) => {
      it(`should return color ${expectedResult} for value "${value}"`, () => {
        component.cell = {clicked:false,flag:0,value: Number(value)};
        component.ngOnInit();
        expect(component.symbolColor).toEqual(expectedResult.toString());
      });
    });

    describe('onClick', () => {
      it('should call game service methods on click', () => {
        component.gameService = {
          startTimer: noop,
          onCellClick: (_) => {return;},
        } as GameService;
        const timerSpy = spyOn(component.gameService, 'startTimer');
        const cellClickSpy = spyOn(component.gameService, 'onCellClick');
        component.cell = {clicked:false,flag:0,value:-1};
        component.onClick();
        expect(timerSpy).toHaveBeenCalled();
        expect(cellClickSpy).toHaveBeenCalled();
        expect(component.symbol).toEqual('💥');
      });
    });

    describe('onRightClick', () => {
      it('should call game service methods on right click', () => {
        component.gameService = {
          startTimer: noop,
          onCellFlag: (_) => {return;},
        } as GameService;
        const timerSpy = spyOn(component.gameService, 'startTimer');
        const cellFlagSpy = spyOn(component.gameService, 'onCellFlag');
        component.cell = {clicked:false,flag:0,value:-1};
        component.onRightClick();
        expect(timerSpy).toHaveBeenCalled();
        expect(cellFlagSpy).toHaveBeenCalled();
        expect(component.flagSymbol).toEqual('');
      });
    });
  });
});
