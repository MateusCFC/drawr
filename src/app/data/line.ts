import { Point } from './point';
import { Shape, ShapeProperties } from './shape'

const DEFAULT_START: Point = {x: 100, y:100 };
const DEFAULT_END: Point = {x: 200, y: 200};
const PICK_WIDTH_MIN = 4; // min width considered for the stroke when picking the line.

/**
 * Properties that can init a line. It extends the shape's properties to include the
 * start point and end point  (abstract properties of the shape).
 */
export interface LineProperties extends Partial<ShapeProperties> {
  startPoint: Point;
  endPoint: Point;
}

/**
 * Line shape. It is defined by the coordinates of its start and end position.
 */
export class Line extends Shape {
  readonly type = 'line';
  protected props: LineProperties;

  /**
   * Create a new line with a unique id.
   * @param id the shape identiifier (unique)
   */
  constructor(props?: Partial<LineProperties>) {
    super(props);
    this.props.startPoint = props.startPoint || DEFAULT_START;
    this.props.endPoint = props.endPoint || DEFAULT_END;
  }

  get width() {
    return Math.abs(this.props.startPoint.x - this.props.endPoint.x);
  }

  get height() {
    return Math.abs(this.props.startPoint.y - this.props.endPoint.y);
  }

  set width(w: number){
    this.width = w;
  }

  set height(h: number){
    this.height = h;
  }

  /**
   * Draw itself in a canvas.
   * @param ctx HTML canvas 2D graphic context where the line will be drawn.
   */
  path(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.props.startPoint.x,this.props.startPoint.y);
    ctx.lineTo(this.props.endPoint.x,this.props.endPoint.y);
    ctx.stroke();
    ctx.closePath();
  }

  /**
   * Check if a certain point is on it, using the cross-product rule
   * source: https://stackoverflow.com/questions/11907947/how-to-check-if-a-point-lies-on-a-line-between-2-other-points
   * @param p Point to be checked
   */
  pick(p: Point){
    const dxc = p.x - this.props.startPoint.x;
    const dyc = p.y - this.props.startPoint.y;
    const dxl = this.props.endPoint.x - this.props.startPoint.x;
    const dyl = this.props.endPoint.y - this.props.startPoint.y;
    const cross = dxc*dyl - dyc*dxl;
    return Math.abs(cross/100) <= PICK_WIDTH_MIN;
  }

  /**
   * Scale the line.
   * @param scaleX scale in the X coordinate
   * @param scaleY Scale in the Y coordinate
   * @param refX Relative position (in X coordinate) of the center of scale
   * @param refY Relative position (in Y coordinate) of the center of scale
   */
  scale(scaleX: number, scaleY: number, refX = 0, refY = 0) {
    //TODO
  }
}