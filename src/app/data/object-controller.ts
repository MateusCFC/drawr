import { EditorService } from '../canvas/editor/editor.service';

export class ObjectController {
  static draw(ctx: CanvasRenderingContext2D, editor: EditorService): void {
    if (!editor.selectedShape) { return; }
    ctx.stroke();
    ctx.rect(
      editor.selectedShape.x - 10,
      editor.selectedShape.y - 10,
      editor.selectedShape.width + 20,
      editor.selectedShape.height + 20
    );
    ctx.stroke();
  }
}
