import { CanvasDirective } from "../canvas.directive";
import { Point } from "../../data/point";
import { EditorService } from "../editor/editor.service";
import { Rect } from "../../data/rect";
import { Circle } from "../../data/circle";
import { Line } from "../../data/line";
import { Doodle } from "../../data/doodle";

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


/**
 * Tool responsible for selecting a shape or a group of shapes.
 */
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
    const r = new Rect({
      x: p1.x,
      y: p1.y,
      width: p2.x - p1.x,
      height: p2.y - p1.y
    });
    canvas.figure.add(r);
    canvas.figure.refresh();
  }
}

/**
 * The tool responsible for creating circles. It has two event handlers: drag and dragEnd.
 * The first one draws a temporary circle in the layer and the second one creates the circle
 * in the figure. The center of the circle is fixed on the point where the drag started, 
 * while the radius changes based on mouse movement. It's set to be a full circle.
 */
const circle: Tool = {
  name: 'circle',
  icon: 'radio_button_unchecked',
  drag: (canvas: CanvasDirective, layer: CanvasDirective, editor: EditorService, p1: Point, p2: Point) => {
    layer.clear();
    const leftSize = Math.abs(p1.x - p2.x);
    const topSize = Math.abs(p1.y - p2.y);
    const radius = Math.sqrt(leftSize*leftSize + topSize*topSize);
    layer.context.beginPath();
    layer.context.arc(p1.x,p1.y,radius,0,Math.PI*2);
    layer.context.stroke();
    layer.context.closePath();
  },
  dragEnd: (canvas: CanvasDirective, layer: CanvasDirective, editor: EditorService, p1: Point, p2: Point) => {
    layer.clear();
    const c = new Circle({
      x: p1.x,
      y: p1.y,
      radius: Math.sqrt(Math.pow(p1.x - p2.x,2) + Math.pow(p1.y - p2.y,2))
    });
    canvas.figure.add(c);
    canvas.figure.refresh();
  }
}

/**
 * The tool responsible for creating lines. It has two event handlers: drag and dragEnd.
 * The first one draws a temporary line in the layer and the second one creates the line
 * in the figure. The start point of the line is fixed on the point where the drag started, 
 * while the length changes based on mouse movement.
 */
const line: Tool = {
  name: 'line',
  icon: 'mode_edit',
  drag: (canvas: CanvasDirective, layer: CanvasDirective, editor: EditorService, p1: Point, p2: Point) => {
    layer.clear();
    layer.context.beginPath();
    layer.context.moveTo(p1.x,p1.y);
    layer.context.lineTo(p2.x,p2.y);
    layer.context.stroke();
    layer.context.closePath();
  },
  dragEnd: (canvas: CanvasDirective, layer: CanvasDirective, editor: EditorService, p1: Point, p2: Point) => {
    layer.clear();
    const l = new Line({
      startPoint: p1,
      endPoint: p2
    });
    canvas.figure.add(l);
    canvas.figure.refresh();
  }
}

/**
 * The tool responsible for creating doodle lines. It has two event handlers: drag and dragEnd.
 * The first one draws a temporary line in the layer and the second one creates the line
 * in the figure. The start point of the line is fixed on the point where the drag started, 
 * while the length changes based on mouse movement.
 */
const doodle: Tool = {
  name: 'line',
  icon: 'border_color',
  drag: (canvas: CanvasDirective, layer: CanvasDirective, editor: EditorService, p1: Point, p2: Point) => {
    //layer.clear();
    layer.context.beginPath();
    if (editor.pointList.length == 0) editor.pointList.push(p1);
    layer.context.moveTo(editor.pointList[editor.pointList.length-1].x,editor.pointList[editor.pointList.length-1].y);
    layer.context.lineTo(p2.x,p2.y);
    editor.pointList.push(p2);
    layer.context.stroke();
    layer.context.closePath();
  },
  dragEnd: (canvas: CanvasDirective, layer: CanvasDirective, editor: EditorService, p1: Point, p2: Point) => {
    layer.clear();
    const l = new Doodle({
      points: editor.pointList
    });
    canvas.figure.add(l);
    canvas.figure.refresh();
    editor.pointList = [];
  }
}

/**
 * Set of tools used in the canvas editor.
 */
export const tools = [ selection, doodle, line, rect, circle ];