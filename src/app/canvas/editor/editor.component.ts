import { Component, OnInit, ContentChild, AfterContentInit, ViewChild } from '@angular/core';
import { CanvasDirective } from '../canvas.directive';
import { Figure } from '../../data/figure';
import { DataService } from '../../data/data.service';
import { ToolService } from '../toolbar/tool.service';
import { Point } from '../../data/point';

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

  constructor(private dataService: DataService, private toolService: ToolService) {
    this.layerFig = dataService.createFigure();
  }

  ngAfterContentInit() {
    // the size of the layer canvas is modified only after the initialization of `ng-content`, where
    // the canvas with figures is rendered.
    this.layer.canvas.height = this.canvas.height;
    this.layer.canvas.width = this.canvas.width;
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
    const tool = this.toolService.selected;
    if (this.isDragging) {
      if (tool && tool.dragEnd) {
        tool.dragEnd(this.canvas, this.layer, this.dragOrigin, { x, y });
      }
    }
    else {
      if (tool && tool.click) {
        tool.click(this.canvas, this.layer, this.dragOrigin);
      }
    }
    this.resetMouseEvent();
  }

  /**
   * Event handler to mouse move event.
   * @param event mouse move event
   */
  mouseMove(event: MouseEvent) {
    // if dragOrigin is not undefined, then the user has pressed the mouse button.
    if (this.dragOrigin) {
      const x = event.offsetX;
      const y = event.offsetY;
      const tool = this.toolService.selected;
      if (!this.isDragging) {
        const movedUpDown = Math.abs(y - this.dragOrigin.y) > MOVE_THRESHOLD;
        const movedLeftRight = Math.abs(x - this.dragOrigin.x) > MOVE_THRESHOLD;
        if (movedUpDown || movedLeftRight) {
          this.isDragging = true;
          if (tool && tool.dragStart) {
            tool.dragStart(this.canvas, this.layer, this.dragOrigin);
          }
        }
      }
      else {
        if (tool && tool.drag) {
          tool.drag(this.canvas, this.layer, this.dragOrigin, { x, y });
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
        tool.dragEnd(this.canvas, this.layer, this.dragOrigin, { x, y });
      }
    }
    this.dragOrigin = undefined;
    this.isDragging = false;
  }

}
