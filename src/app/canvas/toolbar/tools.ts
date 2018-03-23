import { CanvasDirective } from "../canvas.directive";
import { Point } from "../../data/point";
import { EditorService } from "../editor/editor.service";

/**
 * Define the callback function for mouse events.
 * It must receive the canvas (where the figures are drawn), the canvas layer (where the user
 * interaction happens), and one or two points, according to the occorred event.
 */
interface MouseHandler {
  ( canvas: CanvasDirective,
    layer: CanvasDirective,
    editor: EditorService,
    p1: Point,
    p2?: Point): void
}

/**
 * A tool is defined by its name (identifier), the icon that will shown in the toolbar, and the
 * callbacks to four events as specified below.
 * * *mouse click* is called whenever the user clicks in the canvas;
 * * *dragStart* is called when the user starts dragging on the canvas;
 * * *drag* is called when the user is dragging the mouse one the canvas, and finnaly;
 * * *dragEnd* is called when the dragging has finished.
 */
export interface Tool {
  name: string;
  icon: string;
  click?: MouseHandler;
  dragStart?: MouseHandler;
  drag?: MouseHandler;
  dragEnd?: MouseHandler;
}

const selection: Tool = {
  name: 'selection',
  icon: 'crop_free',
  click: (canvas: CanvasDirective, layer: CanvasDirective, editor: EditorService, p: Point) => {
    for (let id in canvas.figure.shapes) {
      const shape = canvas.figure.shapes[id];
      if (shape.pick(p)) {
        editor.selectedShape = shape;
        break;
      }
    }
  }
}


/**
 * The tool responsible for creating rectangles. It has two event handlers: drag and dragEnd.
 * The first one draws a temporary rectangle in the layer and the second one creates the rectangle
 * in the figure.
 */
const rect: Tool = {
  name: 'rect',
  icon: 'check_box_outline_blank',
  drag: (canvas: CanvasDirective, layer: CanvasDirective, editor: EditorService, p1: Point, p2: Point) => {
    layer.clear();
    const w = p2.x - p1.x;
    const h = p2.y - p1.y;
    layer.context.strokeRect(p1.x, p1.y, w, h);
  },
  dragEnd: (canvas: CanvasDirective, layer: CanvasDirective, editor: EditorService, p1: Point, p2: Point) => {
    layer.clear();
    const r = canvas.figure.addShape('rect', {
      top: p1.y,
      left: p1.x,
      width: p2.x - p1.x,
      height: p2.y - p1.y
    });
  }
}

/**
 * Cicle tool does nothing for the moment.
 */
const circle: Tool = {
  name: 'circle',
  icon: 'radio_button_unchecked'    
}

/**
 * Set of tools used in the canvas editor.
 */
export const tools = [ selection, rect, circle ];