import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { CanvasModule } from './canvas/canvas.module';
import { DataModule } from './data/data.module';
import { SharedModule } from './shared/shared.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    CanvasModule,
    DataModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
