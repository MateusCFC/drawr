import { Point } from './point';
import { Shape } from './shape'

/** 
 * defines how close the clicked point needs to be to trigger the pick function for this object.
 * it is used as a comparator to the cross product rule used in the pick function
 * min value should be between 200 and 300
*/
const PICK_THRESHOLD = 300;
/**
 * Line shape. It is defined by the coordinates of its start and end position.
 */
export class Line implements Shape {
  startPoint: Point;
  endPoint: Point;

  readonly type = 'triangle';

  /**
   * Create a new triangle with a unique id.
   * @param id the shape identiifier (unique)
   */
  constructor(public readonly id: string) {
    this.startPoint = {x: 10, y: 10};
    this.startPoint = {x: 10, y: 10};
  }

  /**
   * Draw itself in a canvas.
   * @param ctx HTML canvas 2D graphic context where the rectangle will be drawn.
   */
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.startPoint.x,this.startPoint.y);
    ctx.lineTo(this.endPoint.x,this.endPoint.y);
    ctx.stroke();
    ctx.closePath();
  }

  /**
   * Check if a certain point is on it, using the cross-product rule
   * source: https://stackoverflow.com/questions/11907947/how-to-check-if-a-point-lies-on-a-line-between-2-other-points
   * @param p Point to be checked
   */
  pick(p: Point){
    const dxc = p.x - this.startPoint.x;
    const dyc = p.y - this.startPoint.y;
    const dxl = this.endPoint.x - this.startPoint.x;
    const dyl = this.endPoint.y - this.startPoint.y;
    const cross = dxc * dyl - dyc * dxl;
    console.log(cross)
    return Math.abs(cross) < PICK_THRESHOLD;
  }
}