import { Injectable, EventEmitter } from '@angular/core';
import { Shape } from '../../data/shape';
import { Point } from '../../data/point';

@Injectable()
export class EditorService {

  private _selectedShape: Shape;
  shapeSelectionChanged: EventEmitter<boolean>;

  // saves point list. used by the doodle tool.
  pointList: Point[] = [];

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
