import { Point } from './point';
import { Shape, ShapeProperties } from './shape'

const DEFAULT_SPIKES = 3;
const DEFAULT_OUTER_RADIUS = 10;
const DEFAULT_INNER_RADIUS = 5;
const PICK_WIDTH_MIN = 4; //min width considered for the stroke when picking the star.

/**
 * Properties that can init a star. It extends the shape's properties to include the
 * spikes (number of vertices), inner radius (radius before the spikes) and
 * outer radius (total radius of the star) (abstract properties of the shape).
 */
export interface StarProperties extends Partial<ShapeProperties> {
    spikes: number;
    innerRadius: number;
    outerRadius: number;
}

/**
 * Star shape. It is defined by a number of spikes, an inner radius and an outer radius.
 */
export class Star extends Shape {
  readonly type = 'star';
  protected props: StarProperties;

  /**
   * Create a new star with a unique id.
   * @param id the shape identiifier (unique)
   */
  constructor(props?: Partial<StarProperties>) {
    super(props);
    this.id = this.generateId();
    this.props.spikes = props.spikes || DEFAULT_SPIKES;
    this.props.innerRadius = props.innerRadius || DEFAULT_INNER_RADIUS;
    this.props.outerRadius = props.outerRadius || DEFAULT_OUTER_RADIUS;
  }

  get width() {
    return this.props.outerRadius*2;
  }

  get height() {
    return this.props.outerRadius*2;
  }

  /**
   * Draw itself in a canvas.
   * @param ctx HTML canvas 2D graphic context where the star will be drawn.
   * source: https://stackoverflow.com/questions/25837158/how-to-draw-a-star-by-using-canvas-html5
   */
  path(ctx: CanvasRenderingContext2D) {
    var x = this.x;
    var y = this.y;
    var rot = Math.PI / 2 * 3;
    var step = Math.PI / this.props.spikes;
    ctx.beginPath();
    ctx.moveTo(this.x,this.y - this.props.outerRadius)
    for (var i = 0;i<this.props.spikes; i++) {
      x = this.x + Math.cos(rot) * this.props.outerRadius;
      y = this.y + Math.sin(rot) * this.props.outerRadius;
      ctx.lineTo(x, y)
      rot += step
      x = this.x + Math.cos(rot) * this.props.innerRadius;
      y = this.y + Math.sin(rot) * this.props.innerRadius;
      ctx.lineTo(x, y)
      rot += step
    }
    ctx.lineTo(this.x, this.y - this.props.outerRadius);
    ctx.stroke();
    ctx.closePath();
  }

  /**
   * Check if a certain point is inside of it, using the Pythagorean theorem
   * (using the outer radius as reference)
   * @param p Point to be checked
   */
  pick(p: Point): boolean{
    const xDiff = p.x - this.x;
    const yDiff = p.y - this.y;
    const distance = Math.sqrt(Math.pow(xDiff,2) + Math.pow(yDiff,2));
    return distance <= this.props.outerRadius;
  }

  /**
   * Scale the star, assuming a linear scale.
   * @param scaleX scale in the X coordinate
   * @param scaleY Scale in the Y coordinate -- not used
   * @param refX Relative position (in X coordinate) of the center of scale
   * @param refY Relative position (in Y coordinate) of the center of scale -- not used
   */
  scale(scaleX: number, scaleY: number, refX = 0, refY = 0) {
    const newInnerRadius = this.props.innerRadius*scaleX;
    const newOuterRadius = this.props.outerRadius*scaleX;
    const deltaInnerRadius = newInnerRadius - this.props.innerRadius;
    this.x -= refX * deltaInnerRadius;
    this.props.innerRadius = newInnerRadius;
    this.props.outerRadius = newOuterRadius;
  }
}
