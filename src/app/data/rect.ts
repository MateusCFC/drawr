import { Point } from './point';
import { Shape, ShapeProperties } from './shape'

const DEFAULT_WIDTH = 10;
const DEFAULT_HEIGHT = 10;
const PICK_WIDTH_MIN = 4; // min width considered for the stroke when picking the rect.

function between(v: number, min: number, max: number) {
  return (min <= v) && (v <= max);
}

/**
 * Properties that can init a rectangle. It extends the shape's properties to include the
 * rectangle width and height (abstract properties of the shape).
 */
export interface RectProperties extends Partial<ShapeProperties> {
  width: number;
  height: number;
}

/**
 * Rectangle shape. It is defined by the coordinates of its top-left corner (shape's x and y)
 * and its size (width and height).
 */
export class Rect extends Shape {
  readonly type = 'rect';
  protected props: RectProperties;

  /**
   * Create a new rectangle with a unique id.
   * @param id the shape identiifier (unique)
   */
  constructor(props?: Partial<RectProperties>) {
    super(props);
    this.id = this.generateId();
    this.props.width = props.width || DEFAULT_WIDTH;
    this.props.height = props.height || DEFAULT_HEIGHT;
  }

  get width() {
    return this.props.width;
  }

  get height() {
    return this.props.height;
  }

  set width(w) {
    this.props.width = w;
  }

  set height(h) {
    this.props.height = h;
  }

  /**
   * Draw itself in a canvas.
   * @param ctx HTML canvas 2D graphic context where the rectangle will be drawn.
   */
  path(ctx: CanvasRenderingContext2D) {
    ctx.rect(this.x, this.y, this.width, this.height);
  }

  /**
   * Check if a given position is over the rectangle (in case it is filled) or over its edges (in case it is not filled).
   * @param p Position to check.
   */
  pick(p: Point): boolean {
    //console.log(this.x + "<="+ p.x + "<="+ (this.x + this.width));
    //console.log(this.y + "<="+ p.y + "<="+ (this.y + this.height));
    const insideX = between(p.x, this.x, this.x + this.width);
    const insideY = between(p.y, this.y, this.y + this.height);
    /*if (this.style.fill) {*/
      return insideX && insideY;
    /*} else {
      const discount = Math.max(this.style.lineWidth, PICK_WIDTH_MIN);
      const onLeftEdge = insideY && between(p.x, this.x - discount, this.x + discount);
      const onTopEdge = insideX && between(p.y, this.y - discount, this.y + discount);
      const right = this.x + this.width - 1;
      const bottom = this.y + this.height - 1;
      const onRightEdge = insideY && between(p.x, right - discount, right + discount);
      const onBottomEdge = insideX && between(p.y, bottom - discount, bottom + discount);
      return onLeftEdge || onRightEdge || onTopEdge || onBottomEdge;
    }*/
  }

  /**
   * Scale the rectangle.
   * @param scaleX scale in the X coordinate
   * @param scaleY Scale in the Y coordinate
   * @param refX Relative position (in X coordinate) of the center of scale
   * @param refY Relative position (in Y coordinate) of the center of scale
   */
  scale(scaleX: number, scaleY: number, refX = 0, refY = 0) {
    const newWidth = this.props.width * scaleX;
    const newHeight = this.props.height * scaleY;
    const deltaWidth = newWidth - this.props.width;
    const deltaHeight = newHeight - this.props.height;
    this.x -= refX * deltaWidth;
    this.y -= refY * deltaHeight;
    this.props.width = newWidth;
    this.props.height = newHeight;
  }
}
