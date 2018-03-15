import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from './data.service';

/**
 * Module responsible for managing the application data.
 */
@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    DataService
  ]
})
export class DataModule { }
