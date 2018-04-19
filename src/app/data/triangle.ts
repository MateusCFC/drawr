import { Point } from './point';
import { Shape, ShapeProperties } from './shape'

const DEFAULT_VERTICES: Point[] = [{x:100, y:100}, {x:200, y:100}, {x:150, y:150}];
const PICK_WIDTH_MIN = 4; //min width considered for the stroke when picking the triangle.

/**
 * Properties that can init a triangle. It extends the shape's properties to include
 * each of the triangle's vertices as a Point.
 */
export interface TriangleProperties extends Partial<ShapeProperties> {
  vertices: Point[];
}

/**
 * Triangle shape. 
 * It is defined by an array of Points that represents its vertices.
 */
export class Triangle extends Shape {
  readonly type = 'triangle';
  protected props: TriangleProperties;

  /**
   * Create a new triangle with a unique id.
   * @param id the shape identiifier (unique)
   */
  constructor(props?: Partial<TriangleProperties>) {
    super(props);
    this.props.vertices = props.vertices || DEFAULT_VERTICES;
  }

  get width() {
    return this.props.style.lineWidth;
  }

  get height() {
    return this.props.style.lineWidth;
  }

  /**
   * Draw itself in a canvas.
   * @param ctx HTML canvas 2D graphic context where the triangle will be drawn.
   * source: https://stackoverflow.com/questions/25837158/how-to-draw-a-star-by-using-canvas-html5
   */
  path(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.props.vertices[0].x,this.props.vertices[0].y);
    ctx.lineTo(this.props.vertices[1].x,this.props.vertices[1].y);
    ctx.lineTo(this.props.vertices[2].x,this.props.vertices[2].y);
    ctx.stroke();
    ctx.closePath();
  }

  /**
   * Calculates the distance between a point and a line. It is called
   * inside the pick function.
   * source: https://stackoverflow.com/questions/11907947/how-to-check-if-a-point-lies-on-a-line-between-2-other-points
   * @param p Point to be checked
   * @param p1 Start point of the line
   * @param p2 End point of the line
   */
  crossProduct(p: Point, p1: Point, p2: Point){
    const dxc = p.x - p1.x;
    const dyc = p.y - p1.y;
    const dxl = p2.x - p1.x;
    const dyl = p2.y - p1.y;
    const cross = dxc*dyl - dyc*dxl;
    return Math.abs(cross/100) <= PICK_WIDTH_MIN;
  }

  /**
   * Check if a certain point is on it, using crossProduct function between
   * the three lines that compose the triangle.
   * @param p Point to be checked
   */
  pick(p: Point){
    const l1 = this.crossProduct(p,this.props.vertices[0],this.props.vertices[1]);
    const l2 = this.crossProduct(p,this.props.vertices[1],this.props.vertices[2]);
    const l3 = this.crossProduct(p,this.props.vertices[2],this.props.vertices[0]);
    return l1 || l2 || l3;
  }

  /**
   * Scale the triangle.
   * @param scaleX scale in the X coordinate
   * @param scaleY Scale in the Y coordinate -- not used
   * @param refX Relative position (in X coordinate) of the center of scale
   * @param refY Relative position (in Y coordinate) of the center of scale -- not used
   */
  scale(scaleX: number, scaleY: number, refX = 0, refY = 0) {
    //TODO
  }
}