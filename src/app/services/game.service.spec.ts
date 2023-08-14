import { TestBed } from '@angular/core/testing';

import { GameService } from './game.service';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getWinner', () => {
    it('should return winner emoji and title when 1 player and win state', () => {
      service.currentGameState = 'win';
      service.players = 1;
      const resp = service.getWinner();
      expect(resp).toEqual(['🥳', 'You Win']);
    });

    it('should return Lost title when 1 player and lose state', () => {
      service.currentGameState = 'lose';
      service.players = 1;
      const resp = service.getWinner();
      expect(resp).toEqual(['Lost']);
    });

    it('should get the correct rank order for 2 players', () => {
      service.players = 2;
      service.playerStats = [
        {name: '0', score: -1},
        {name: '1', score: 0},
      ]
      const resp = service.getWinner();
      expect(resp.length).toEqual(2);
      expect(resp).toEqual([`\n1st. Player 1\n\n\n`, `\n2nd. Player 0\n\n\n`]);
    });

    it('should get the correct rank order for 3 players and tie', () => {
      service.players = 2;
      service.playerStats = [
        {name: '0', score: -1},
        {name: '1', score: 0},
        {name: '2', score: 0},
      ]
      const resp = service.getWinner();
      expect(resp.length).toEqual(2);
      expect(resp).toEqual([`\n1st. Player 1 and 2\n\n\n`, `\n2nd. Player 0\n\n\n`]);
    });

    it('should get the correct rank order for 4 players and tie', () => {
      service.players = 2;
      service.playerStats = [
        {name: '0', score: 1},
        {name: '1', score: 0},
        {name: '2', score: 0},
        {name: '3', score: -1},
      ]
      const resp = service.getWinner();
      expect(resp.length).toEqual(3);
      expect(resp).toEqual([`\n1st. Player 0\n\n\n`, `\n2nd. Player 1 and 2\n\n\n`, `\n3rd. Player 3\n\n\n`]);
    });

    it('should get the correct rank order for 4 players and multiple ties', () => {
      service.players = 2;
      service.playerStats = [
        {name: '0', score: 1},
        {name: '1', score: 0},
        {name: '2', score: 0},
        {name: '3', score: 1},
      ]
      const resp = service.getWinner();
      expect(resp.length).toEqual(2);
      expect(resp).toEqual([`\n1st. Player 0 and 3\n\n\n`, `\n2nd. Player 1 and 2\n\n\n`]);
    });
  });

  describe('formatRank', () => {
    [
      [1, '1st'],
      [2, '2nd'],
      [3, '3rd'],
      [4, '4th'],
      [5, '5th'],
    ].forEach(([rank, expectedResult]) => {
      it(`should return ${expectedResult} for rank "${rank}"`, () => {
        expect(service.formatRank(rank as number)).toBe(expectedResult as string);
      });
    });
  });
});
