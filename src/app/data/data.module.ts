import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from './data.service';
import { GroupService } from './group.service';

/**
 * Module responsible for managing the application data.
 */
@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    DataService,
    GroupService
  ]
})
export class DataModule { }
