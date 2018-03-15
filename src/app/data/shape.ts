
/**
 * Graphic object which can be added in a figure.
 */
export interface Shape {
  id: string;
  type: string;
  // color, border, fillcolor etc.

  /** Any shape must know how to draw itself. */
  draw(ctx: CanvasRenderingContext2D);
}

/** Set of shapes indexed by an id. */
export interface Shapes {
  [id: string]: Shape;
}
