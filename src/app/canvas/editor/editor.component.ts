import {
  Component,
  OnInit,
  ContentChild,
  AfterContentInit,
  ViewChild,
  Inject,
  HostListener,
  Input
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { CanvasDirective } from '../canvas.directive';
import { Figure } from '../../data/figure';
import { DataService } from '../../data/data.service';
import { ToolService } from '../toolbar/tool.service';
import { Point } from '../../data/point';
import { EditorService } from '../editor/editor.service';
import {
  ObjectController,
  ObjectControllersTypes
} from '../../data/object-controller';

/** Number of pixels the mouse position must differ to consider as a drag. */
const MOVE_THRESHOLD = 3;

/**
 * Component that adds toolbar, a property panel, and an interaction layer over a canvas in order to
 * create a figure editor.
 */
@Component({
  selector: 'app-canvas-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class CanvasEditorComponent implements AfterContentInit {

  width: number;
  height: number;

  /** As the canvas where the figure will be drawn is dynamically inserted (throght `ng-content`),
   * it is necessary to get it with `@ContentChild()` */
  @ContentChild(CanvasDirective) canvas: CanvasDirective;

  /** A canvas over the canvas where the figure will be drawn. It is used as an interaction layer where
   * user events are captured and shapes are pre-rendered. */
  @ViewChild(CanvasDirective) layer: CanvasDirective;

  /** In case of need of temporary figures in the interaction layer, this figure instance is used. */
  layerFig: Figure;

  /** auxiliary objects to control mouse events. */
  private isDragging = false;
  private dragOrigin: Point = undefined;

  /**
   * It indicates the object controller (move, resize, rotate)
   * that is selected by user. It happens when the user select
   * a object, and click in one of the controllers of object.
   */
  private isObjectControllerSelected = false;
  private controllerTypeSelected: ObjectControllersTypes;

  constructor(
    private dataService: DataService,
    private toolService: ToolService,
    public editorService: EditorService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.layerFig = dataService.createFigure();
  }

  ngOnInit() {
    /*this.width = window.innerWidth - 24;
    this.height = window.innerHeight - 94;*/
    this.width = 2000;
    this.height = 1500;
  }

  ngAfterContentInit() {
    // the size of the layer canvas is modified only after the initialization of `ng-content`, where
    // the canvas with figures is rendered.
    this.layer.canvas.height = this.height;
    this.layer.canvas.width = this.width;
    this.canvas.canvas.height = this.height;
    this.canvas.canvas.width = this.width;
    this.canvas.figure.draw(this.canvas, this.editorService);

    this.canvas.mainCanvas = true;
    this.editorService.shapeSelectionChanged.subscribe(() => {
      this.canvas.figure.draw(this.canvas, this.editorService);
    });
  }

  /* Método chamado quando o evento resize é disparado na página */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    console.log( window.innerWidth + "x" + window.innerHeight);
  }

  /**
   * Event handler to mouse down event.
   * @param event mouse down event
   */
  mouseDown(event: MouseEvent) {
    const x = event.offsetX;
    const y = event.offsetY;
    this.dragOrigin = { x, y };
  }

  /**
   * Event handler to mouse up event.
   * @param event mouse up event
   */
  mouseUp(event: MouseEvent) {
    const x = event.offsetX;
    const y = event.offsetY;
    const point: Point = { x, y };
    const tool = this.toolService.selected;

    if (this.isDragging) {
      if (this.isObjectControllerSelected) {
        const shape = this.editorService.selectedShape;

        if (
          this.controllerTypeSelected === ObjectControllersTypes.ScaleTopLeft
        ) {
          let newScaleY = 1;
          let newScaleX = 1;
          let refY = 0;
          let refX = 0;

          if (point.y < shape.y + shape.height) {
            const diffY = shape.y - point.y;
            newScaleY = (diffY + shape.height - 10) / shape.height;
            refY = 1;
          }

          if (point.x < shape.x + shape.width) {
            const diffX = shape.x - point.x;
            newScaleX = (diffX + shape.width - 10) / shape.width;
            refX = 1;
          }

          shape.scale(newScaleX, newScaleY, refY, refX);
        } else if (
          this.controllerTypeSelected === ObjectControllersTypes.ScaleBottomLeft
        ) {
          let newScaleY = 0;
          let newScaleX = 1;
          let refY = 0;
          let refX = 0;

          if (point.y >= shape.y) {
            const diffY = point.y - (shape.y + shape.height);
            newScaleY = (diffY + shape.height - 10) / shape.height;
            refY = 1;
          }

          if (point.x < shape.x + shape.width) {
            const diffX = shape.x - point.x;
            newScaleX = (diffX + shape.width - 10) / shape.width;
            refX = 0;
          }

          shape.scale(newScaleX, newScaleY, refY, refX);
        } else if (
          this.controllerTypeSelected === ObjectControllersTypes.ScaleTopRight
        ) {
          let newScaleY = 0;
          let newScaleX = 0;
          let refY = 1;
          let refX = 0;

          if (point.y < shape.y + shape.height) {
            const diffY = shape.y - point.y;
            newScaleY = (diffY + shape.height - 10) / shape.height;
            refY = 0;
          }

          if (point.x >= shape.x) {
            const diffX = point.x - (shape.x + shape.width);
            newScaleX = (diffX + shape.width - 10) / shape.width;
            refX = 1;
          }

          shape.scale(newScaleX, newScaleY, refY, refX);
        } else if (
          this.controllerTypeSelected ===
          ObjectControllersTypes.ScaleBottomRight
        ) {
          let newScaleY = 0;
          let newScaleX = 0;
          let refY = 0;
          let refX = 0;

          if (point.y >= shape.y) {
            const diffY = point.y - (shape.y + shape.height);
            newScaleY = (diffY + shape.height - 10) / shape.height;
            refY = 0;
          }

          if (point.x >= shape.x) {
            const diffX = point.x - (shape.x + shape.width);
            newScaleX = (diffX + shape.width - 10) / shape.width;
            refX = 0;
          }

          shape.scale(newScaleX, newScaleY, refY, refX);
        } else if (
          this.controllerTypeSelected === ObjectControllersTypes.Move
        ) {
          shape.moveTo(
            point.x - (this.dragOrigin.x - shape.x),
            point.y - (this.dragOrigin.y - shape.y)
          );
        } else if (
          this.controllerTypeSelected === ObjectControllersTypes.Rotation
        ) {
          shape.rotation = Math.atan2(point.y - this.dragOrigin.y, point.x - this.dragOrigin.x) * 180 / Math.PI;
        }

        this.isObjectControllerSelected = false;
        this.canvas.figure.refresh();
      } else {
        if (tool && tool.dragEnd) {
          tool.dragEnd(
            this.canvas,
            this.layer,
            this.editorService,
            this.dragOrigin,
            { x, y }
          );
        }
      }
    } else {
      if (tool && tool.click) {
        tool.click(
          this.canvas,
          this.layer,
          this.editorService,
          this.dragOrigin,
          null,
          this.canvas.context
        );
      }
    }
    this.resetMouseEvent();
  }

  /**
   * Event handler to mouse move event.
   * @param event mouse move event
   */
  mouseMove(event: MouseEvent) {
    const x = event.offsetX;
    const y = event.offsetY;
    const point: Point = { x, y };
    const obj = new ObjectController(this.editorService);

    // reset cursor
    document.body.style.cursor = 'default';

    // if dragOrigin is not undefined, then the user has pressed the mouse button.
    if (this.dragOrigin) {
      if (this.editorService.selectedShape) {
        if (!this.isDragging) {
          this.isDragging = true;

          if (obj.isTopLeftScaleController(point)) {
            this.isObjectControllerSelected = true;
            this.controllerTypeSelected = ObjectControllersTypes.ScaleTopLeft;
          } else if (obj.isBottomLeftScaleController(point)) {
            this.isObjectControllerSelected = true;
            this.controllerTypeSelected =
              ObjectControllersTypes.ScaleBottomLeft;
          } else if (obj.isTopRightScaleController(point)) {
            this.isObjectControllerSelected = true;
            this.controllerTypeSelected = ObjectControllersTypes.ScaleTopRight;
          } else if (obj.isBottomRightScaleController(point)) {
            this.isObjectControllerSelected = true;
            this.controllerTypeSelected =
              ObjectControllersTypes.ScaleBottomRight;
          } else if (this.editorService.selectedShape.pick(point)) {
            this.isObjectControllerSelected = true;
            this.controllerTypeSelected = ObjectControllersTypes.Move;
          } else if (obj.isRotateController(point)) {
            this.isObjectControllerSelected = true;
            this.controllerTypeSelected = ObjectControllersTypes.Rotation;
          }
        }
      }

      const tool = this.toolService.selected;
      if (!this.isDragging) {
        const movedUpDown = Math.abs(y - this.dragOrigin.y) > MOVE_THRESHOLD;
        const movedLeftRight = Math.abs(x - this.dragOrigin.x) > MOVE_THRESHOLD;
        if (movedUpDown || movedLeftRight) {
          this.isDragging = true;
          if (tool && tool.dragStart) {
            tool.dragStart(
              this.canvas,
              this.layer,
              this.editorService,
              this.dragOrigin
            );
          }
        }
      } else {
        if (tool && tool.drag) {
          tool.drag(
            this.canvas,
            this.layer,
            this.editorService,
            this.dragOrigin,
            { x, y }
          );
        }
      }
    } else {
      // If there is a selected shape, then show custom cursor on controls
      if (this.editorService.selectedShape) {
        if (obj.isTopLeftScaleController(point)) {
          document.body.style.cursor = 'nwse-resize';
        } else if (obj.isBottomLeftScaleController(point)) {
          document.body.style.cursor = 'nesw-resize';
        } else if (obj.isTopRightScaleController(point)) {
          document.body.style.cursor = 'nesw-resize';
        } else if (obj.isBottomRightScaleController(point)) {
          document.body.style.cursor = 'nwse-resize';
        } else if (this.editorService.selectedShape.pick(point)) {
          document.body.style.cursor = 'move';
        } else if (obj.isRotateController(point)) {
          document.body.style.cursor = 'move';
        }
      }
    }
  }

  /**
   * Called when the mouse gets out from the canvas or when some interaction has finished.
   * @param event mouse out event
   */
  resetMouseEvent(event?: MouseEvent) {
    if (this.isDragging && event && event.type === 'mouseout') {
      const x = event.offsetX;
      const y = event.offsetY;
      const tool = this.toolService.selected;
      if (tool && tool.dragEnd) {
        tool.dragEnd(
          this.canvas,
          this.layer,
          this.editorService,
          this.dragOrigin,
          { x, y }
        );
      }
    }
    this.dragOrigin = undefined;
    this.isDragging = false;
  }

  /**
   * Called when the user double click the mouse
   * @param event mouse out event
   */
  doubleClick(event?: MouseEvent) {
    const tool = this.toolService.selected;

    if (tool && (tool.name === 'save' || tool.name === 'import')) {
      tool.doubleClick(this.canvas, this.dataService);
    }
    
    this.dragOrigin = undefined;
    this.isDragging = false;
  }
}
