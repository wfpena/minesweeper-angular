import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousGamesComponent, PreviousGamesPipe } from './previous-games.component';
import { GameState } from '../models/game-state.model';

describe('PreviousGamesComponent', () => {
  let component: PreviousGamesComponent;
  let fixture: ComponentFixture<PreviousGamesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviousGamesComponent, PreviousGamesPipe]
    });
    fixture = TestBed.createComponent(PreviousGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('PreviousGamesPipe', () => {
    it('should return empty array for empty array input', () => {
      const pipe = new PreviousGamesPipe();
      const resp = pipe.transform([]);
      expect(resp).toEqual([]);
    });

    it('should sort by difficulty ascending - case 1', () => {
      const pipe = new PreviousGamesPipe();
      const resp = pipe.transform([{id:'1', difficulty: 'easy'}] as GameState[]);
      expect(resp).toEqual([{id:'1', difficulty: 'easy'}]);
    });

    it('should sort by difficulty ascending - case 2', () => {
      const pipe = new PreviousGamesPipe();
      const resp = pipe.transform([{id:'1', difficulty: 'easy'},{id:'2',difficulty: 'hard'}] as GameState[]);
      expect(resp).toEqual([{id:'2',difficulty: 'hard'}, {id:'1', difficulty: 'easy'}]);
    });

    it('should sort by difficulty ascending - case 3', () => {
      const pipe = new PreviousGamesPipe();
      const resp = pipe.transform([{id:'1', difficulty: 'easy'},{id:'2',difficulty: 'hard'},{id:'3',difficulty: 'hard'}] as GameState[]);
      expect(resp).toEqual([{id:'2',difficulty: 'hard'}, {id:'3',difficulty: 'hard'}, {id:'1', difficulty: 'easy'}]);
    });

    it('should sort by difficulty and total time ascending - case 1', () => {
      const pipe = new PreviousGamesPipe();
      const resp = pipe.transform([
        {id:'1', difficulty: 'easy', totalTime: 1},{id:'2',difficulty: 'hard',totalTime: 12},{id:'3',difficulty: 'hard',totalTime:2},{id:'4',difficulty:'medium',totalTime:0},{id:'5', difficulty: 'easy', totalTime: 12}
      ] as GameState[]);
      expect(resp).toEqual([
        {id:'3',difficulty: 'hard',totalTime:2},{id:'2',difficulty: 'hard',totalTime: 12},{id:'4',difficulty:'medium',totalTime:0},{id:'1', difficulty: 'easy', totalTime: 1},{id:'5', difficulty: 'easy', totalTime: 12}
      ]);
    });

    it('should sort by difficulty and total time ascending - case 2', () => {
      const pipe = new PreviousGamesPipe();
      const resp = pipe.transform([
        {id:'1', difficulty: 'hard', totalTime: 1},{id:'2',difficulty: 'hard',totalTime: 12},{id:'3',difficulty: 'hard',totalTime:2},{id:'4',difficulty:'medium',totalTime:0},{id:'5', difficulty: 'easy', totalTime: 12}
      ] as GameState[]);
      expect(resp).toEqual([
        {id:'1', difficulty: 'hard', totalTime: 1},{id:'3',difficulty: 'hard',totalTime:2},{id:'2',difficulty: 'hard',totalTime: 12},{id:'4',difficulty:'medium',totalTime:0},{id:'5', difficulty: 'easy', totalTime: 12}
      ]);
    });
  });
});
