import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CellComponent } from './cell/cell-button.component';
import { BoardComponent } from './board/board.component';
import { SettingsComponent } from './settings/settings.component';
import { TopbarComponent } from './topbar/topbar.component';
import { PreviousGamesComponent, PreviousGamesPipe } from './previous-games/previous-games.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: BoardComponent },
  { path: 'ranks', component: PreviousGamesComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    CellComponent,
    BoardComponent,
    SettingsComponent,
    TopbarComponent,
    PreviousGamesComponent,
    PreviousGamesPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [PreviousGamesPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
