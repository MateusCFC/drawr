import { Point } from './point';
import { Shape, ShapeProperties } from './shape'

const DEFAULT_VERTEX_COUNTER = 5;
const DEFAULT_VERTICES: Point[] = [{x:100, y:100}, {x:200, y:100}, {x:150, y:150}];
const PICK_WIDTH_MIN = 4; //min width considered for the stroke when picking the polygon.

/**
 * Properties that can init a polygon. It extends the shape's properties to include
 * each of the polygon's vertices as a Point.
 */
export interface PolygonProperties extends Partial<ShapeProperties> {
  vertices: Point[];
  vertexCounter: number;
}

export class PolygonVerticesHandler {
    public static VERTEX_COUNTER: number;

    static set vertexCounter(n: number){
      this.VERTEX_COUNTER = n;
    }

    static get vertexCounter(){
      return this.VERTEX_COUNTER;
    }
}

/**
 * Polygon shape.
 * It is defined by an array of Points that represents its vertices.
 */
export class Polygon extends Shape {
  readonly type = 'polygon';
  protected props: PolygonProperties;

  /**
   * Create a new polygon with a unique id.
   * @param id the shape identiifier (unique)
   */
  constructor(props?: Partial<PolygonProperties>) {
    super(props);
    this.id = this.generateId();
    this.props.vertices = props.vertices || DEFAULT_VERTICES;
    this.props.vertexCounter = props.vertexCounter || DEFAULT_VERTEX_COUNTER;
  }

  getMinYX(opt) {
    let minX = 100000;
    let minY = 100000;
    for (var i = 0; i < this.props.vertices.length; i++) {
      if (this.props.vertices[i].x < minX) minX = this.props.vertices[i].x;
      if (this.props.vertices[i].y < minY) minY = this.props.vertices[i].y;
    }
    if (opt === 'w') return minX;
    if (opt === 'h') return minY;
  }

  getMaxYX(opt) {
    let maxX = 0;
    let maxY = 0;
    for (var i = 0; i < this.props.vertices.length; i++) {
      if (this.props.vertices[i].x > maxX) maxX = this.props.vertices[i].x;
      if (this.props.vertices[i].y > maxY) maxY = this.props.vertices[i].y;
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

  get vertexCounter(){
    return this.vertexCounter;
  }

  /**
   * Draw itself in a canvas.
   * @param ctx HTML canvas 2D graphic context where the polygon will be drawn.
   */
  path(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.props.vertices[0].x,this.props.vertices[0].y);
    for (var i=1;i<this.props.vertexCounter;i++){
        ctx.lineTo(this.props.vertices[i].x,this.props.vertices[i].y);
    }
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
    if (!this.style.fill){
      let out = false;
      for (var i=0;i<this.props.vertexCounter-1;i++){
        out = out || this.crossProduct(p,this.props.vertices[i],this.props.vertices[i+1]);
      }
      out = out || this.crossProduct(p,this.props.vertices[this.props.vertexCounter-1],this.props.vertices[0]);
      return out;
    } else {
      return (p.x < this.getMaxYX('w') && p.x > this.getMinYX('w')) && (p.y < this.getMaxYX('h') && p.y > this.getMinYX('h'));
    }
  }

  /**
   * Scale the polygon.
   * @param scaleX scale in the X coordinate
   * @param scaleY Scale in the Y coordinate
   * @param refX Relative position (in X coordinate) of the center of scale
   * @param refY Relative position (in Y coordinate) of the center of scale
   */
  scale(scaleX: number, scaleY: number, refX = 0, refY = 0) {
    //TODO
  }
}
