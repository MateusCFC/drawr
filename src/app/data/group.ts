import { Point } from './point';
import { Shape } from './shape'

/**
 * Group shape.
 */
export class Group extends Shape {
  readonly type = 'group';

  /** The bottom left point of the group. Along with the group position (x and y), they define the group bouding box. */
  private max: Point;

  public name: string;

  /** Members of the group. */
  shapes: Shape[];

  /**
   * Create a new group and optionally set its initial members.
   * @param shapes A list of shapes that will be member of the group.
   */
  constructor(name: string, shape?: Shape) {
    super();
    this.max = { x: 0, y: 0 };

    this.name = name;

    this.resetBox();
    this.shapes = [];
    if (shape) {
      this.add(shape);
      // Make the shape position relative to the group position.
      // So, it need to be moved.
      shape.moveTo(shape.x - this.x, shape.y - this.y);
    }
  }

  /**
   * Add one shape. When a shape is added to the group, its box (which defines the group's position
   * and bottom-left coordinate) is updated.
   * @param shape Shape to be added
   */
  add(shape: Shape) {
    this.shapes.push(shape);
    this.updateBox(shape);
  }

  /**
   * Remove one shape. When a shape is removed from the group, its box (which defines the group's position
   * and bottom-left coordinate) is updated.
   * @param shape Shape of list of shapes to be removed
   */
  remove(shape: Shape) {
    const index = this.shapes.findIndex(sh => sh === shape);
    this.shapes.splice(index, 1);
    this.updateBoxForAllShapes();
  }

  /**
   * The group width is the difference between left and right positions.
   */
  get width() {
    return this.max.x - this.x;
  }

  /**
   * The group height is the difference between top and bottom positions.
   */
  get height() {
    return this.max.y - this.y;
  }

  /**
   * Draw all the shapes in the group.
   * @param ctx Canvas graphics context
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    this.rotate(ctx);
    // draw the shapes of the group relative to the group position
    ctx.translate(this.x, this.y);
    for (let shape of this.shapes) {
      shape.draw(ctx);
    }
    ctx.restore();
  }

  /**
   * The path of the group is the path of all its members. However, this method does nothing
   * since the group's draw method overwrites the shape's draw methods calling all its
   * members to draw themselves.
   * @param ctx Canvas graphics context
   */
  path(ctx: CanvasRenderingContext2D) {
  }

  /**
   * Check if a given position is over any member of the group.
   * @param p Position to check.
   */
  pick(p: Point): boolean {
    for(let i = this.shapes.length - 1; i >= 0; i--) {
      if (this.shapes[i].pick(p)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Scale all members of the group.
   * @param scaleX scale in the X coordinate
   * @param scaleY Scale in the Y coordinate
   * @param refX Relative position (in X coordinate) of the center of scale
   * @param refY Relative position (in Y coordinate) of the center of scale
   */
  scale(scaleX: number, scaleY: number, refX = 0, refY = 0) {
    const previousX = this.x;
    const previousY = this.y;
    this.resetBox();
    for (const shape of this.shapes) {
      shape.scale(scaleX, scaleY, refX, refY);
      this.updateBox(shape);
    }
    this.x = previousX + this.x * refX;
    this.y = previousY + this.y * refY;
  }

  /**
   * Reset the bounding box of the group. The bouding box is defined by the group's position and
   * its bottom right point (`max`).
   */
  private resetBox() {
    this.x = Number.MAX_SAFE_INTEGER;
    this.y = Number.MAX_SAFE_INTEGER;
    this.max.x = Number.MIN_SAFE_INTEGER;
    this.max.y = Number.MIN_SAFE_INTEGER;
  }

  /**
   * Update the bounding box of the group taking into account the a new shape.
   * The bouding box is defined by the group's position and its bottom right point (`max`).
   * @param shape The new shape in the group.
   */
  private updateBox(shape: Shape) {
    if (shape.x < this.x) { this.x = shape.x; }
    if (shape.y < this.y) { this.y = shape.y; }
    if (shape.x > this.max.x) { this.max.x = shape.x; }
    if (shape.y > this.max.y) { this.max.y = shape.y; }
  }

  /**
   * Update the bounding box of the group taking into account all its members.
   */
  private updateBoxForAllShapes() {
    this.resetBox();
    for (let shape of this.shapes) {
      this.updateBox(shape);
    }
  }

}
