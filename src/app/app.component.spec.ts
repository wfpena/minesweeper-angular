import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { SettingsComponent } from './settings/settings.component';
import { CellComponent } from './cell/cell-button.component';
import { TopbarComponent } from './topbar/topbar.component';
import { PreviousGamesComponent, PreviousGamesPipe } from './previous-games/previous-games.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: BoardComponent },
  { path: 'ranks', component: PreviousGamesComponent },
];

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [AppComponent, BoardComponent, SettingsComponent, CellComponent, TopbarComponent, PreviousGamesComponent, PreviousGamesPipe],
    imports: [RouterModule.forRoot(routes)],
    providers: [PreviousGamesPipe],
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'minesweeper-angular'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('minesweeper-angular');
  });

  it('should render settings', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.main-page app-settings')).toBeTruthy();
  });

  it('should render main title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.main-page .main-bg-title')).toBeTruthy();
  });
});
