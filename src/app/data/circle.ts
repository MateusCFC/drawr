import { Point } from './point';
import { Shape } from './shape'

/**
 * Circle shape. It is defined by the coordinates of its center, based on the top-left
 * corner and its radius length. 
 */
export class Circle implements Shape {
  top: number;
  left: number;
  radius: number;

  readonly type = 'circle';

  /**
   * Create a new circle with a unique id.
   * @param id the shape identiifier (unique)
   */
  constructor(public readonly id: string) {
    this.top = 10;
    this.left = 10;
    this.radius = 10;
  }

  /**
   * Draw itself in a canvas.
   * @param ctx HTML canvas 2D graphic context where the circle will be drawn.
   */
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(this.left,this.top,this.radius,0,Math.PI*2);
    ctx.fill();
    ctx.closePath();
  }

  /**
   * Check if a certain point is inside of it, using the Pythagorean theorem
   * @param p Point to be checked
   */
  pick(p: Point): boolean{
    const xDiff = this.left - p.x;
    const yDiff = this.top - p.y;
    const distanceFromCenter = Math.pow(xDiff,2) + Math.pow(yDiff,2);
    return distanceFromCenter == Math.pow(this.radius,2);
  }
}