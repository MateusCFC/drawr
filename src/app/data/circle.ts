import { Point } from './point';
import { Shape, ShapeProperties } from './shape'

const DEFAULT_RADIUS= 10;
const PICK_WIDTH_MIN = 4; // min width considered for the stroke when picking the circle.

/**
 * Properties that can init a circle It extends the shape's properties to include the
 * circle radius (abstract properties of the shape).
 */
export interface CircleProperties extends Partial<ShapeProperties> {
  radius: number;
}

/**
 * Circle shape. It is defined by the coordinates of its center, based on the top-left
 * corner and its radius length.
 */
export class Circle extends Shape {
  readonly type = 'circle';
  protected props: CircleProperties;

  /**
   * Create a new circle with a unique id.
   * @param id the shape identiifier (unique)
   */
  constructor(props?: Partial<CircleProperties>) {
    super(props);
    this.props.radius = props.radius || DEFAULT_RADIUS;
  }

  get width() {
    return this.props.radius*2;
  }

  get height() {
    return this.props.radius*2;
  }

  /**
   * Draw itself in a canvas.
   * @param ctx HTML canvas 2D graphic context where the circle will be drawn.
   */
  path(ctx: CanvasRenderingContext2D) {
    ctx.arc(this.x,this.y,this.props.radius,0,Math.PI*2);
  }

  /**
   * Check if a certain point is inside of it, using the Pythagorean theorem
   * @param p Point to be checked
   */
  pick(p: Point): boolean{
    const xDiff = p.x - this.props.x;
    const yDiff = p.y - this.props.y;
    const distance = Math.sqrt(Math.pow(xDiff,2) + Math.pow(yDiff,2));
    return (distance <= this.props.radius);
  }

  /**
   * Scale the circle, assuming it will have a linear scale.
   * @param scaleX scale in the X coordinate
   * @param scaleY Scale in the Y coordinate -- not used
   * @param refX Relative position (in X coordinate) of the center of scale
   * @param refY Relative position (in Y coordinate) of the center of scale -- not used
   */
  scale(scaleX: number, scaleY: number, refX = 0, refY = 0) {
    const newRadius = this.props.radius*scaleX;
    const deltaRadius = newRadius - this.props.radius;
    this.x -= refX*deltaRadius;
    this.props.radius = newRadius;
  }
}
