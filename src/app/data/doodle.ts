import { Point } from './point';
import { Shape, ShapeProperties } from './shape'

const DEFAULT_POINTS: Point[] = [{ x: 100, y: 100 }, { x: 200, y: 200 }];
const PICK_WIDTH_MIN = 4; //min width considered for the stroke when picking the doodle.

/**
 * Properties that can init a doodle. It extends the shape's properties to include the
 * start point and end point  (abstract properties of the shape).
 */
export interface DoodleProperties extends Partial<ShapeProperties> {
  points: Point[];
}

/**
 * Doodle shape. It is defined by a list of points.
 */
export class Doodle extends Shape {
  readonly type = 'doodle';
  protected props: DoodleProperties;

  /**
   * Create a new doodle with a unique id.
   * @param id the shape identiifier (unique)
   */
  constructor(props?: Partial<DoodleProperties>) {
    super(props);
    this.id = this.generateId();
    this.props.points = props.points || DEFAULT_POINTS;
  }

  getMinYX(opt) {
    let minX = 100000;
    let minY = 100000;
    for (var i = 0; i < this.props.points.length; i++) {
      if (this.props.points[i].x < minX) minX = this.props.points[i].x;
      if (this.props.points[i].y < minY) minY = this.props.points[i].y;
    }
    if (opt === 'w') return minX;
    if (opt === 'h') return minY;
  }

  getMaxYX(opt) {
    let maxX = 0;
    let maxY = 0;
    for (var i = 0; i < this.props.points.length; i++) {
      if (this.props.points[i].x > maxX) maxX = this.props.points[i].x;
      if (this.props.points[i].y > maxY) maxY = this.props.points[i].y;
    }
    if (opt === 'w') return maxX;
    if (opt === 'h') return maxY;
  }

  get width() {
    return this.getMaxYX('w') - this.getMinYX('w');
  }

  get height() {
    return this.getMaxYX('h') - this.getMinYX('h');
  }

  /**
   * Draw itself in a canvas.
   * @param ctx HTML canvas 2D graphic context where the doodle will be drawn.
   */
  path(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    for (var i = 0; i < this.props.points.length - 1; i++) {
      ctx.moveTo(this.props.points[i].x, this.props.points[i].y);
      ctx.lineTo(this.props.points[i + 1].x, this.props.points[i + 1].y);
    }
    ctx.stroke();
    ctx.closePath();
  }

  /**
   * Check if a certain point is on it, by checking if the points' list contains the point given.
   * @param p Point to be checked
   */
  pick(p: Point) {
    for (var i = 0; i < this.props.points.length; i++) {
      const xDiff = Math.abs(this.props.points[i].x - p.x);
      const yDiff = Math.abs(this.props.points[i].y - p.y);
      if (xDiff <= PICK_WIDTH_MIN && yDiff <= PICK_WIDTH_MIN) return true;
    }
    return false;
  }

  /**
   * Scale the doodle.
   * @param scaleX scale in the X coordinate
   * @param scaleY Scale in the Y coordinate
   * @param refX Relative position (in X coordinate) of the center of scale
   * @param refY Relative position (in Y coordinate) of the center of scale
   */
  scale(scaleX: number, scaleY: number, refX = 0, refY = 0) {
    //TODO
  }
}
