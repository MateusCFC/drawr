import { Rect } from './rect';
import { Shape } from './shape';
import { Subject } from 'rxjs/Subject';
import { Point } from './point';
import { EditorService } from '../canvas/editor/editor.service';
import { ObjectController } from './object-controller';
import { CanvasDirective } from '../canvas/canvas.directive';

export type ShapeType = 'rect' | 'circle';

/**
 * A figure is a set of shapes. It represents the model (data) and it's not concerned by the view (how the shapes are rendered).
 * To assure independency of the model from the view, an instance of Figure is observable. Clients may subscribe to the changes
 * in the figure to update their views.
 */
export class Figure {
  /** List of shapes in the figure. */
  shapes: Shape[] = [];

  /// It uses the library RxJS too create an observable
  private updateSubject = new Subject<boolean>();

  /** Observable which clients may subscribe to listen for updates. */
  $update = this.updateSubject.asObservable();

  /**
   * Add a new shape in the figure.
   * @param shape shape to be added.
   */
  add(shape: Shape) {
    this.shapes.push(shape);
    return this;
  }

  /**
   * Remove a shape from the figure.
   * @param shape shape to be removed.
   */
  remove(shape: Shape) {
    const index = this.shapes.findIndex(sh => sh === shape);
    this.shapes.splice(index, 1);
    return this;
  }

  /**
   * Remove all shapes from the figure.
   */
  clear(): Figure {
    this.shapes = [];
    return this;
  }

  /**
   * Move a shape towards the front of the shapes stack, so it appears over the last position.
   * @param shape Shape to move.
   */
  up(shape: Shape) {
    const index = this.shapes.findIndex(sh => sh === shape);
    if (index >= 0 && index < this.shapes.length - 1) {
      this.shapes.splice(index, 2, this.shapes[index + 1], this.shapes[index]);
    }
    return this;
  }

  /**
   * Move a shape towards the back of the shapes stack, so it appears under the last position.
   * @param shape Shape to move.
   */
  down(shape: Shape) {
    const index = this.shapes.findIndex(sh => sh === shape);
    if (index > 0 && index < this.shapes.length) {
      this.shapes.splice(index - 1, 2, this.shapes[index], this.shapes[index - 1]);
    }
    return this;
  }

  /**
   * Move a shape to the front of the shapes stack, so it appears over all the other shapes.
   * @param shape Shape to move.
   */
  toFront(shape: Shape) {
    const index = this.shapes.findIndex(sh => sh === shape);
    if (index >= 0 && index < this.shapes.length) {
      this.shapes.splice(index, 1);
      this.shapes.push(shape);
    }
    return this;
  }

  /**
   * Move a shape to the back of the shapes stack, so it appears under any other shape.
   * @param shape Shape to move.
   */
  toBack(shape: Shape) {
    const index = this.shapes.findIndex(sh => sh === shape);
    if (index >= 0 && index < this.shapes.length) {
      this.shapes.splice(index, 1);
      this.shapes.unshift(shape);
    }
    return this;
  }

  /**
   * Return the first shape a given point is over.
   * @param p Position to check.
   */
  pick(p: Point): Shape {
    for (let i = this.shapes.length - 1; i >= 0; i--) {
      if (this.shapes[i].pick(p)) {
        return this.shapes[i];
      }
    }
  }

  /**
   * Return a shape in the figure.
   * @param id The id of the shape to retrieve.
   */
  getShapeById(id: string): Shape {
    const index = this.shapes.findIndex(sh => sh.id === id);
    return this.shapes[index];
  }

  /**
   * Draw the figure in a HTML canvas.
   * @param ctx HTML canvas 2D graphic context where the figure will be drawn
   */
  draw(canvas: CanvasDirective, editor: EditorService): void {
    const ctx = canvas.context;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (const shape of this.shapes) {
      shape.draw(ctx);
    }
    if (canvas.mainCanvas) {
      this.drawController(canvas.context, editor);
    }
  }

  private drawController(ctx: CanvasRenderingContext2D, editor: EditorService) {
    ObjectController.draw(ctx, editor);
  }

  /**
   * Send a notification to the figure subscribers saying that it has changed.
   */
  refresh() {
    this.updateSubject.next(true);
  }

}
