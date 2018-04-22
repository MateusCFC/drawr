import { CanvasDirective } from '../canvas.directive';
import { Point } from '../../data/point';
import { EditorService } from '../editor/editor.service';
import { Rect } from '../../data/rect';

/**
 * Define the callback function for mouse events.
 * It must receive the canvas (where the figures are drawn), the canvas layer (where the user
 * interaction happens), and one or two points, according to the occorred event.
 */
type MouseHandler = ( canvas: CanvasDirective,
    layer: CanvasDirective,
    editor: EditorService,
    p1: Point,
    p2?: Point,
    ctx?: CanvasRenderingContext2D) => void;

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


/**
 * Tool responsible for selecting a shape or a group of shapes.
 */
const selection: Tool = {
  name: 'selection',
  icon: 'crop_free',
  click: (canvas: CanvasDirective, layer: CanvasDirective, editor: EditorService, p: Point, p2?: Point, ctx?: CanvasRenderingContext2D) => {

    Object.keys(canvas.figure.shapes);
    for (let i = 0; i < canvas.figure.shapes.length; i++) {
      const id = Object.keys(canvas.figure.shapes)[i];
      const shape = canvas.figure.shapes[id];

      /**
       * First step: Show controller -> Resize, Move and Rotate
       * Second step: Create a filter to mouseDown and mouseUp with the active controller
       */
      if (shape.pick(p)) {
        editor.selectedShape = shape;
        break;
      } else {
        editor.selectedShape = null;
      }
    }
  }
};


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
    const r = new Rect({
      x: p1.x,
      y: p1.y,
      width: p2.x - p1.x,
      height: p2.y - p1.y
    });
    canvas.figure.add(r);
    canvas.figure.refresh();
  }
};

/**
 * Cicle tool does nothing for the moment.
 */
const circle: Tool = {
  name: 'circle',
  icon: 'radio_button_unchecked',
};

/**
 * Set of tools used in the canvas editor.
 */
export const tools = [ selection, rect, circle ];
