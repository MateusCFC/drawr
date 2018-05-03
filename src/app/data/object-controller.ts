import { EditorService } from '../canvas/editor/editor.service';
import { Point } from './point';

function between(v: number, min: number, max: number) {
  return (min <= v) && (v <= max);
}

export class ObjectController {

  private PICK_WIDTH_MIN = 4;

  constructor(private editor: EditorService) {}

  static draw(ctx: CanvasRenderingContext2D, editor: EditorService): void {
    if (!editor.selectedShape) { return; }
    ctx.save();
    ctx.strokeStyle = 'blue';
    ctx.fillStyle = 'blue';
    ctx.lineWidth = 0.6;

    /* draw selection */
    ctx.beginPath();
    ctx.rect(
      editor.selectedShape.x - 5,
      editor.selectedShape.y - 5,
      editor.selectedShape.width + 10,
      editor.selectedShape.height + 10
    );
    ctx.stroke();
    ctx.closePath();

    /* draw scale controllers - left-top */
    ctx.beginPath();
    ctx.fillRect(
      editor.selectedShape.x - 10,
      editor.selectedShape.y - 10,
      5,
      5
    );
    ctx.stroke();
    ctx.closePath();

    /* draw scale controllers - left-bottom */
    ctx.beginPath();
    ctx.fillRect(
      editor.selectedShape.x - 10,
      editor.selectedShape.y + editor.selectedShape.height + 5,
      5,
      5
    );
    ctx.stroke();
    ctx.closePath();

    /* draw scale controllers - right-top */
    ctx.beginPath();
    ctx.fillRect(
      editor.selectedShape.x + editor.selectedShape.width + 5,
      editor.selectedShape.y - 10,
      5,
      5
    );
    ctx.stroke();
    ctx.closePath();

    /* draw scale controllers - right-bottom */
    ctx.beginPath();
    ctx.fillRect(
      editor.selectedShape.x + editor.selectedShape.width + 5,
      editor.selectedShape.y + editor.selectedShape.height + 5,
      5,
      5
    );
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
  }

  isTopLeftScaleController(p: Point) {
    const shape = this.editor.selectedShape;
    const insideX = between(p.x, shape.x - 10 - this.PICK_WIDTH_MIN, shape.x - 10 + 5 + this.PICK_WIDTH_MIN);
    const insideY = between(p.y, shape.y - 10 - this.PICK_WIDTH_MIN, shape.y - 10 + 5 + this.PICK_WIDTH_MIN);
    return insideX && insideY;
  }

}
