import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousGamesComponent, PreviousGamesPipe } from './previous-games.component';
import { GameStats } from '../models/game-stats.model';

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
      const resp = pipe.transform([], 'aaaa');
      expect(resp).toEqual([]);
    });

    it('should sort by difficulty ascending - case 1', () => {
      const pipe = new PreviousGamesPipe();
      const resp = pipe.transform([{id:'1', difficulty: 'easy'}] as GameStats[], 'difficulty');
      expect(resp).toEqual([{id:'1', difficulty: 'easy'}]);
    });

    it('should sort by difficulty ascending - case 2', () => {
      const pipe = new PreviousGamesPipe();
      const resp = pipe.transform([{id:'1', difficulty: 'easy'},{id:'2',difficulty: 'hard'}] as GameStats[], 'difficulty');
      expect(resp).toEqual([{id:'2',difficulty: 'hard'}, {id:'1', difficulty: 'easy'}]);
    });

    it('should sort by difficulty ascending - case 3', () => {
      const pipe = new PreviousGamesPipe();
      const resp = pipe.transform([{id:'1', difficulty: 'easy'},{id:'2',difficulty: 'hard'},{id:'3',difficulty: 'hard'}] as GameStats[], 'difficulty');
      expect(resp).toEqual([{id:'2',difficulty: 'hard'}, {id:'3',difficulty: 'hard'}, {id:'1', difficulty: 'easy'}]);
    });

    // TODO: Sort by time spent
    // it('should sort by difficulty and total time ascending - case 1', () => {
    //   const pipe = new PreviousGamesPipe();
    //   const resp = pipe.transform([{id:'1', difficulty: 'easy', totalTime: 1},{id:'2',difficulty: 'hard'},{id:'3',difficulty: 'hard'}] as GameStats[], 'difficulty');
    //   expect(resp).toEqual([{id:'2',difficulty: 'hard'}, {id:'3',difficulty: 'hard'}, {id:'1', difficulty: 'easy'}]);
    // });
  });
});
