import { Injectable, EventEmitter } from '@angular/core';
import { Shape } from '../../data/shape';

@Injectable()
export class EditorService {

  private _selectedShape: Shape;
  shapeSelectionChanged: EventEmitter<boolean>;

  set selectedShape(shape: Shape) {
    this._selectedShape = shape;
    this.shapeSelectionChanged.emit(true);
  }
  get selectedShape() {
    return this._selectedShape;
  }

  constructor() {
    this.shapeSelectionChanged = new EventEmitter<boolean>();
  }
}
