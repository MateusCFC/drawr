import { Point } from "./point";

const DEFAULT_POSITION = { x: 0, y: 0 };
const DEFAULT_STYLE = { lineWidth: 1 };

export type LineCap = 'butt' | 'round' | 'square';
export type LineJoin = 'bevel' | 'round' | 'miter';

export type GradientType = 'linear' | 'radial';

export interface GradientColor {
  position: number;
  color: string;
}

export interface Gradient {
  type: GradientType;
  start: Point;              // initial point (for linear gradients) or center of the initial circle (for radial gradients)
  end: Point;                // final point (for linear gradients) or center of the final circle (for radial gradients)
  startRadius?: number;      // radius of the initial circle (for radial gradients)
  endRadius?: number;        // radius of the final circle (for radial gradients)
  colors: GradientColor[];   // positions for each color in the gradient
  gradient?: CanvasGradient; // buffered gradient (to avoid creating a new gradient on each canvas draw)
}

export type RepeatPattern = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';

export interface Pattern {
  src: string;
  repeat?: RepeatPattern;
  pattern?: CanvasPattern;   // buffered pattern (to avoid creating a new pattern on each canvas draw)
}

export type FillStyle = string | Gradient | Pattern;
export type StrokeStyle = string | Gradient;

export interface Style {
  fill: FillStyle;
  stroke: StrokeStyle;
  transparency: number;
  lineWidth: number;
  lineCap: LineCap;
  lineJoin: LineJoin;
  lineDash: number[];
}

export interface Shadow {
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
}

export interface BoundingBox {
  topLeft: Point;
  rightBottom: Point;
}

export interface ShapeProperties extends Point {
  style: Partial<Style>;
  shadow: Shadow;
  rotation: number;
}

/**
 * Graphic object which can be added in a figure.
 */
export abstract class Shape {
  /** Constant that specify a category of the shape (e.g. rectangle, circle, polygon etc). */
  readonly type: string;

  /** An identifier for the shape. */
  id: string;

  /** All the shape's properties. */
  protected props: Partial<ShapeProperties>;

  /**
   * Cretate a new shape with a given set of properties.
   * @param props The initial shape's properties.
   */
  constructor(props?: Partial<ShapeProperties>) {
    this.generateId();
    this.props = props ? { ...props } : {};   // create a shallow copy
    this.x = this.x || 0;
    this.y = this.y || 0;
    if (!this.style) {
      this.style = { lineWidth: 1 };     // default style
    }
  }

  /** A shape must set its own path. */

  /**
   * The set of drawing primitives (rect, arc etc) which defines the shape.
   * @param ctx Canvas graphics context where the path will be set.
   */
  abstract path(ctx: CanvasRenderingContext2D): void;

  /**
   * Scale the path of the shape.
   * @param scaleX scale in the X coordinate
   * @param scaleY Scale in the Y coordinate
   * @param refX Relative position (in X coordinate) of the center of scale
   * @param refY Relative position (in Y coordinate) of the center of scale
   */
  abstract scale(scaleX: number, scaleY: number, refX: number, refY: number);

  /**
   * Check if a given position is over the shape.
   * @param p Position to check.
   */
  abstract pick(p: Point): boolean;

  /**
   * Width of the shape. It is abstract because it depends on the shape's path.
   */
  abstract get width(): number;

  /**
   * Height of the shape. It is abstract because it depends on the shape's path.
   */
  abstract get height(): number;

  /** X coordinate of the shape. */
  get x() { return this.props.x; }

  /** Y coordinate of the shape. */
  get y() { return this.props.y; }

  /** Drawing style of the shape (fill, stroke, transparency, and line properties) */
  get style() { return this.props.style; }

  /** Get the shadow properties of the shape. */
  get shadow() { return this.props.shadow; }

  /** Get the rotation angle (in degrees) of the shape. */
  get rotation() { return this.props.rotation; }

  /** Get the bounding box (min and max coordinates) of the shape. */
  get box(): Readonly<BoundingBox> {
    return {
      topLeft: { x: this.x, y: this.y },
      rightBottom: { x: this.x + this.width, y: this.y + this.height }
    }
  }

  /** Set the X coordinate. */
  set x(x: number) { this.props.x = x; }

  /** Set the Y coordinate. */
  set y(y: number) { this.props.y = y; }

  /** Set the drawing style of the shape (fill, stroke, transparency, and line properties) */
  set style(style: Partial<Style>) { this.props.style = style; }

  /** Set the shadow properties of the shape. */
  set shadow(shadow: Shadow) { this.props.shadow = shadow; }

  /** Set the rotation angle (in degrees) of the shape. */
  set rotation(angle: number) { this.props.rotation = angle; }

  /** Change the shape's position. */
  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Draw the shape in a canvas. It calls the `path()` method to define the drawing
   * primitives of the shape.
   * @param ctx Canvas graphic context where the shape will be drawn.
   */
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    this.rotate(ctx);
    ctx.beginPath();
    this.path(ctx);
    this.render(ctx);
    ctx.closePath();
    ctx.restore();
  }

  // --- private/protected methods ----------------------------------------------------------

  /**
   * Rotate the shape turning around its center.
   * @param ctx Canvas graphic context
   */
  protected rotate(ctx: CanvasRenderingContext2D) {
    if (this.rotation) {
      const rad = this.rotation * (Math.PI / 180);
      const x = this.x + (this.width / 2);
      const y = this.y + (this.height / 2);
      ctx.translate(x, y);
      ctx.rotate(rad);
      ctx.translate(-x, -y);
    }
  }

  /**
   * Set the shape's drawing properties (fill, stroke, shadow, and transparency).
   * @param ctx Canvas graphic context
   */
  private render(ctx: CanvasRenderingContext2D) {
    this.setShadow(ctx);
    if (this.style.transparency) {
      ctx.globalAlpha = this.style.transparency;
    }
    if (this.style && this.style.fill) {
      this.setFill(ctx);
      ctx.fill();
    }
    if (this.style && (this.style.stroke || this.style.lineWidth)) {
      if (this.style.fill) {
        this.clearShadow(ctx);
      }
      this.setStroke(ctx);
      ctx.stroke();
    }
  }

  /** Check if a given parameter is a gradient. */
  private isGradient(fill): fill is Gradient {
    return (<Gradient>fill).type !== undefined;
  }

  /** Check if a given parameter is a pattern. */
  private isPattern(fill): fill is Pattern {
    return (<Pattern>fill).src !== undefined;
  }

  /**
   * Set the fill style of the shape. A fill style can be a solid color, a gradient, or an image pattern.
   * @param ctx Canvas graphic context
   */
  private setFill(ctx: CanvasRenderingContext2D) {
    const fill = this.style.fill;
    if (typeof fill === 'string') {
      // strings are considered as CSS colors, e.g. "#fefeab" or "rgb(123, 42, 100)"
      ctx.fillStyle = fill;
    }
    else if (this.isGradient(fill)) {
      // if (fill.gradient === undefined) {
        if (fill.type === 'linear') {
          const box = this.box;
          const startX = this.x + fill.start.x * this.width;
          const startY = this.y + fill.start.y * this.height;
          const endX = this.x + fill.end.x * this.width;
          const endY = this.y + fill.end.y * this.height;
          fill.gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        }
        else {
          fill.gradient = ctx.createRadialGradient(fill.start.x, fill.start.y, fill.startRadius, fill.end.x, fill.end.y, fill.endRadius);
        }
        for (let colorStop of fill.colors) {
          fill.gradient.addColorStop(colorStop.position, colorStop.color);
        }
      // }
      ctx.fillStyle = fill.gradient;
    }
    else if (this.isPattern(fill)) {
      if (fill.pattern === undefined) {
        const image = new Image();
        image.src = fill.src;
        image.onload = () => {
          fill.pattern = ctx.createPattern(image, fill.repeat);
          ctx.fillStyle = fill.pattern;
        }
      }
      else {
        ctx.fillStyle = fill.pattern;
      }
    }
  }

  /**
   * Set the style of the stroke of the shape. A stroke style can be a solid color or a gradient.
   * @param ctx Canvas graphic context
   */
  private setStroke(ctx: CanvasRenderingContext2D) {
    const style = this.style;
    const stroke = style.stroke;

    if (typeof stroke === 'string') {
      // strings are considered as CSS colors, e.g. "#fefeab" or "rgb(123, 42, 100)"
      ctx.strokeStyle = stroke;
    }
    else if (stroke && this.isGradient(stroke)) {
      if (stroke.gradient === undefined) {
        if (stroke.type === 'linear') {
          stroke.gradient = ctx.createLinearGradient(stroke.start.x, stroke.start.y, stroke.end.x, stroke.end.y);
        }
        else {
          stroke.gradient = ctx.createRadialGradient(stroke.start.x, stroke.start.y, stroke.startRadius, stroke.end.x, stroke.end.y, stroke.endRadius);
        }
        for (let colorStop of stroke.colors) {
          stroke.gradient.addColorStop(colorStop.position, colorStop.color);
        }
      }
      ctx.strokeStyle = stroke.gradient;
    }
    if (style.lineWidth !== undefined) { ctx.lineWidth = style.lineWidth; }
    if (style.lineCap !== undefined) { ctx.lineCap = style.lineCap; }
    if (style.lineJoin !== undefined) { ctx.lineJoin = style.lineJoin; }
    if (style.lineDash !== undefined) { ctx.setLineDash(style.lineDash); }
  }

  /**
   * Set the shadow of the shape.
   * @param ctx Canvas graphic context
   */
  private setShadow(ctx: CanvasRenderingContext2D) {
    const shadow = this.shadow;
    if (shadow !== undefined) {
      if (shadow.offsetX !== undefined) { ctx.shadowOffsetX = shadow.offsetX; }
      if (shadow.offsetY !== undefined) { ctx.shadowOffsetY = shadow.offsetY; }
      if (shadow.blur !== undefined) { ctx.shadowBlur = shadow.blur; }
      if (shadow.color !== undefined) { ctx.shadowColor = shadow.color }
    }
  }

  /**
   * Remove the shadow from the graphic context.
   * @param ctx Canvas graphic context.
   */
  private clearShadow(ctx: CanvasRenderingContext2D) {
    ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
  }

  /**
   * Generate an identifier for a shape.
   * Based on https://gist.github.com/gordonbrander/2230317
   * Math.random should be unique because of its seeding algorithm.
   * Convert it to base 36 (numbers + letters), and grab the first 9
   * characters after the decimal.
   */
  private generateId() {
    return `${this.type}-${Math.random().toString(36).substr(2, 6)}`;
  }

}
