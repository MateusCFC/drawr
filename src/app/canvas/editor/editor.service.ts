import { Injectable, EventEmitter } from '@angular/core';
import { Shape } from '../../data/shape';
import { Point } from '../../data/point';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EditorService {

  private _selectedShape: Shape;
  private shapeSelectionChanged: Subject<Shape> = new Subject<Shape>();
  shapeSelectionChanged$ = this.shapeSelectionChanged.asObservable();
  // shapeSelectionChanged: EventEmitter<Shape>;

  // saves point list. used by the doodle tool.
  pointList: Point[] = [];

  set selectedShape(shape: Shape) {
    this._selectedShape = shape;
    // console.log('select shape editor service');
    // console.log(this._selectedShape);
    // console.log('end');
    this.shapeSelectionChanged.next(this._selectedShape);
  }
  get selectedShape() {
    return this._selectedShape;
  }
}
