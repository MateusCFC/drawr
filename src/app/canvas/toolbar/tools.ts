import { CanvasDirective } from "../canvas.directive";
import { Point } from "../../data/point";
import { DataService } from "../../data/data.service";
import { EditorService } from "../editor/editor.service";
import { Rect } from "../../data/rect";
import { Circle } from "../../data/circle";
import { Line } from "../../data/line";
import { Doodle } from "../../data/doodle";
import { Star } from "../../data/star";
import { Triangle } from "../../data/triangle";
import { Polygon, PolygonVertexes } from "../../data/polygon";
import Swal from 'sweetalert2'

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

type DataHandler = (canvas: CanvasDirective, data: DataService) => void;

/**
 * A tool is defined by its name (identifier), the icon that will shown in the toolbar, and the
 * callbacks to four events as specified below.
 * * *mouse click* is called whenever the user clicks in the canvas;
 * * *mouse double click* is called when the user clicks twice in the icon;
 * * *dragStart* is called when the user starts dragging on the canvas;
 * * *drag* is called when the user is dragging the mouse one the canvas, and finnaly;
 * * *dragEnd* is called when the dragging has finished.
 */
export interface Tool {
  name: string;
  icon: string;
  title: string;
  tooltip: string;
  click?: MouseHandler;
  doubleClick?: DataHandler;
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
  title: '',
  tooltip: 'Selection',
  click: (canvas: CanvasDirective, layer: CanvasDirective, editor: EditorService, p: Point, p2?: Point, ctx?: CanvasRenderingContext2D) => {

    console.log(canvas.figure.shapes);
    Object.keys(canvas.figure.shapes);
    for (let i = 0; i < canvas.figure.shapes.length; i++) {
      const id = Object.keys(canvas.figure.shapes)[i];
      const shape = canvas.figure.shapes[id];

      /**
       * First step: Show controller -> Resize, Move and Rotate
       * Second step: Create a filter to mouseDown and mouseUp with the active controller
       */
      console.log(shape);
      console.log(shape.pick(p));
      if (shape.pick(p)) {
        editor.selectedShape = shape;
        break;
      } else {
        editor.selectedShape = null;
      }
    }
  },
  doubleClick: () => {}
};

/**
 * The tool responsible for creating rectangles. It has two event handlers: drag and dragEnd.
 * The first one draws a temporary rectangle in the layer and the second one creates the rectangle
 * in the figure.
 */
const rect: Tool = {
  name: 'rect',
  icon: 'check_box_outline_blank',
  title: '',
  tooltip: 'Rectangle',
  drag: (canvas: CanvasDirective, layer: CanvasDirective, editor: EditorService, p1: Point, p2: Point) => {
    layer.clear();
    const w = p2.x - p1.x;
    const h = p2.y - p1.y;
    layer.context.strokeRect(p1.x, p1.y, w, h);
  },
  dragEnd: (canvas: CanvasDirective, layer: CanvasDirective, editor: EditorService, p1: Point, p2: Point) => {
    console.log('get here');
    layer.clear();
    const r = new Rect({
      x: p1.x,
      y: p1.y,
      width: p2.x - p1.x,
      height: p2.y - p1.y,
      rotation: 0,
      style : {
          fill : '#cccccc',
          stroke : '#000000',
          lineWidth : 1,
          transparency: 1
      }
    });
    canvas.figure.add(r);
    canvas.figure.refresh();
  },
  doubleClick: () => {}
};

/**
 * The tool responsible for creating circles. It has two event handlers: drag and dragEnd.
 * The first one draws a temporary circle in the layer and the second one creates the circle
 * in the figure. The center of the circle is fixed on the point where the drag started,
 * while the radius changes based on mouse movement. It's set to be a full circle.
 */
const circle: Tool = {
  name: 'circle',
  icon: 'radio_button_unchecked',
  title: '',
  tooltip: 'Circle',
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
      center: p1,
      radius: Math.sqrt(Math.pow(p1.x - p2.x,2) + Math.pow(p1.y - p2.y,2)),
      rotation: 0,
      style : {
        fill : '#cccccc',
        stroke : '#000000',
        lineWidth : 1,
        transparency: 1
      }
    });

    canvas.figure.add(c);
    canvas.figure.refresh();
  },
  doubleClick: () => {}
}

/**
 * The tool responsible for creating lines. It has two event handlers: drag and dragEnd.
 * The first one draws a temporary line in the layer and the second one creates the line
 * in the figure. The start point of the line is fixed on the point where the drag started,
 * while the length changes based on mouse movement.
 */
const line: Tool = {
  name: 'line',
  icon: 'border_color',
  title: '',
  tooltip: 'Line',
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
      endPoint: p2,
      x: p1.x,
      y: p1.y,
      rotation: 0,
      style : {
          stroke : '#000000',
          lineWidth : 1,
          transparency: 1
      }
    });
    canvas.figure.add(l);
    canvas.figure.refresh();
  },
  doubleClick: () => {}
}

/**
 * The tool responsible for creating doodle lines. It has two event handlers: drag and dragEnd.
 * The first one draws a temporary doodle, that follows the mouse pointer in the figure and the
 * second one creates the same doodle on the main canvas.
 */
const doodle: Tool = {
  name: 'doodle',
  icon: 'mode_edit',
  title: '',
  tooltip: 'Doodle',
  drag: (canvas: CanvasDirective, layer: CanvasDirective, editor: EditorService, p1: Point, p2: Point) => {
    layer.context.beginPath();
    if (canvas.pointList.length == 0) canvas.pointList.push(p1);
    layer.context.moveTo(canvas.pointList[canvas.pointList.length-1].x,canvas.pointList[canvas.pointList.length-1].y);
    layer.context.lineTo(p2.x,p2.y);
    canvas.pointList.push(p2);
    layer.context.stroke();
    layer.context.closePath();
  },
  dragEnd: (canvas: CanvasDirective, layer: CanvasDirective, editor: EditorService, p1: Point, p2: Point) => {
    layer.clear();
    const l = new Doodle({
      points: canvas.pointList,
      x: p1.x,
      y: p1.y,
      rotation: 0,
      style : {
          stroke : '#000000',
          lineWidth : 1,
          transparency: 1
      }
    });
    canvas.figure.add(l);
    canvas.figure.refresh();
    canvas.pointList = [];
  },
  doubleClick: () => {}
}

/**
 * The tool responsible for creating stars. It has one event handler: click.
 * It creates a star, using default values for spikes, inner and outer radius,
 * centered on the clicked position.
 */
const star: Tool = {
  name: 'star',
  icon: 'star_border',
  title: '',
  tooltip: 'Star',
  click: (canvas: CanvasDirective, layer: CanvasDirective, editor: EditorService, p1: Point) => {
    layer.clear();
    const s = new Star({
      x: p1.x,
      y: p1.y,
      rotation: 0,
      style : {
          fill : '#cccccc',
          stroke : '#000000',
          lineWidth : 1,
          transparency: 1
      },
      spikes: 5,
      innerRadius: 5,
      outerRadius: 15
    });

    canvas.figure.add(s);
    canvas.figure.refresh();
  },
  doubleClick: () => {}
}

/**
 * The tool responsible for creating triangles. It has one event handler: click.
 * It creates a triangle based on three consecutive clicks, using them as references
 * for its vertices.
 */
const triangle: Tool = {
  name: 'triangle',
  icon: 'signal_cellular_null',
  title: '',
  tooltip: 'Triangle',
  click: (canvas: CanvasDirective, layer: CanvasDirective, editor: EditorService, p1: Point) => {
    if (canvas.pointList[0] === undefined){
      canvas.pointList.push(p1);
      return;
    } else {
      if (canvas.pointList[1] === undefined){
        canvas.pointList.push(p1);
        return;
      }
    }
    canvas.pointList.push(p1);
    const t = new Triangle({
      vertices: canvas.pointList
    });
    canvas.figure.add(t);
    canvas.figure.refresh();
    canvas.pointList = [];
  },
  doubleClick: () => {}
}

/**
 * The tool responsible for creating polygons. It has one event handler: click.
 * It creates a polygon based on consecutive clicks, using them as references
 * for its vertices.
 */
const polygon: Tool = {
  name: 'polygon',
  icon: 'crop',
  title: '',
  tooltip: 'Polygon',
  click: (canvas: CanvasDirective, layer: CanvasDirective, editor: EditorService, p1: Point) => {
    if (canvas.polygonVertexCounter === undefined){
      canvas.polygonVertexCounter = PolygonVertexes.VERTEX_COUNTER;
      canvas.pointList.push(p1);
      canvas.polygonVertexCounter -= 1;
      return;
    }
    if (canvas.polygonVertexCounter > 0){
      canvas.pointList.push(p1);
      canvas.polygonVertexCounter -= 1;
      if (canvas.polygonVertexCounter == 0) {
        const p = new Polygon({
          vertices: canvas.pointList,
          vertexCounter: PolygonVertexes.VERTEX_COUNTER
        });
        canvas.figure.add(p);
        canvas.figure.refresh();
        canvas.pointList = [];
        canvas.polygonVertexCounter = undefined;
      }
    }
  },
  doubleClick: () => {}
}

/**
 * This tool is responsible for export the image canvas
 */
const exportImage: Tool = {
  name: 'save',
  icon: 'save',
  title: 'Salvar desenho',  
  doubleClick: (canvas: CanvasDirective, data: DataService) => {
    Swal({
      title: 'Salvar arquivo',
      text: "Em qual formato gostaria de salvar seu desenho?",
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Imagem',
      cancelButtonText: 'PDF'
    }).then((result) => {
      // Handle the user choice
      if (result.value) {
        // Export draw to image
        data.saveAsImage(canvas.canvas);
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {
        // Export draw to pdf
        data.saveAsPDF(canvas.canvas);
      }
    });
  }
}

/**
 * This tool is responsible for import the image canvas
 */
const importImage: Tool = {
  name: 'import',
  icon: 'import_export',
  title: 'Importar desenho',
  doubleClick: (canvas: CanvasDirective, data: DataService) => {
    // Trigger the file upload
    let input = document.getElementById('imgfile');
    input.addEventListener('change', handleFiles);

    // Image handler
    function handleFiles(e) {
      // Get the canvas context
      var ctx = canvas.context;
      var img = new Image;

      if (!(e.target.files[0] === undefined)) {
        img.src = URL.createObjectURL(e.target.files[0]);
        img.onload = function() {
            ctx.drawImage(img, 40, 40);
        }
      }
    }

    // Trigger the upload click
    input.click();
  }
}

/**
 * Set of tools used in the canvas editor.
 */
export const tools = [ selection, line, doodle, rect, circle, triangle, star, polygon, exportImage, importImage ];