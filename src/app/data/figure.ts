import { Rect } from './rect';
import { Circle } from './circle';
import { Line } from './line';
import { Shape, Shapes } from './shape';
import { Subject } from 'rxjs/Subject';

export type ShapeType = 'rect' | 'circle' | 'line';

/**
 * A figure is a set of shapes. It represents the model (data) and it's not concerned by the view (how the shapes are rendered).
 * To assure independency of the model from the view, an instance of Figure is observable. Clients may subscribe to the changes
 * in the figure to update their views.
 */
export class Figure {
  shapes: Shapes = {};

  /// It uses the library RxJS too create an observable
  private updateSubject = new Subject<boolean>();

  /** Observable which clients may subscribe to listen for updates. */
  $update = this.updateSubject.asObservable();

  /**
   * Create a new shape in the figure. The shape is defined by its type name and its parameters.
   * For instance, a rectangle shape has as name 'rect' and as params an object with the properties `top`, `left`,
   * `width`, and `height`.
   * @param type shape name (identifier)
   * @param params an object with the shape properties
   */
  addShape(type: ShapeType, params: any): Figure {
    const shape = this.createShape(type);
    for (let param in params) {
      shape[param] = params[param];
    }
    this.shapes[shape.id] = shape;
    this.updateSubject.next(true);    
    return this;
  }

  /**
   * Remove a shape from the figure.
   * @param id The id of the shape to remove from the figure.
   */
  removeShape(id: ShapeType): Figure {
    this.shapes[id] = undefined;
    this.updateSubject.next(true);
    return this;
  }

  /**
   * Remove all shapes from the figure.
   */
  clear(): Figure {
    this.shapes = {};
    this.updateSubject.next(true);
    return this;
  }

  /**
   * Return a shape in the figure.
   * @param id The id of the shape to retrieve
   */
  getShape(id: ShapeType): Shape {
    return this.shapes[id];
  }

  /**
   * Draw the figure in a HTML canvas.
   * @param context HTML canvas 2D graphic context where the figure will be drawn
   */
  draw(context: CanvasRenderingContext2D): void {
    for (let id in this.shapes) {
      this.shapes[id].draw(context);
    }
  }
  
  /**
   * Generate an identifier for a shape.
   * Based on https://gist.github.com/gordonbrander/2230317
   * Math.random should be unique because of its seeding algorithm.
   * Convert it to base 36 (numbers + letters), and grab the first 9
   * characters after the decimal.
   */
  private generateId(type: ShapeType) {
    return `${type}-${Math.random().toString(36).substr(2, 6)}`;
  }

  /**
   * Factory method to create shapes.
   */
  private createShape(shapeType: ShapeType) {
    // this loop assures the generated id is unique in the shape set.
    let id = this.generateId(shapeType);
    while (this.shapes[id] !== undefined) {
      id = this.generateId(shapeType);
    }

    switch (shapeType) {
      case 'rect': return new Rect(id);
      case 'circle': return new Circle(id);
      case 'line': return new Line(id);
    }
  }

}