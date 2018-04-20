import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Figure } from '../data/figure';
import { Subscription } from 'rxjs/Subscription';
import { Point } from '../data/point';
import { ToolService } from '../canvas/toolbar/tool.service';

/**
 * Adapt the HTML canvas element to handle figures.
 */
@Directive({
  selector: '[appCanvas]'
})
export class CanvasDirective implements OnInit, OnDestroy {
  @Input() width: number;
  @Input() height: number;
  @Input() figure: Figure;
  
  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D;
  private figureSubscription: Subscription;

  //saves point list. used by the doodle, triangle and polygon tools.
  pointList: Point[] = [];
  pointListSubscription: Subscription;
  //saves polygon points counter. used by the polygon function.
  polygonVertexCounter: number;
  
  constructor(elm: ElementRef, private toolService: ToolService) {
    this._canvas = elm.nativeElement;
    this._context = this._canvas.getContext('2d');
    this._canvas.style.border = '1px dashed #ccc';
  }

  get canvas() {
    return this._canvas;
  }

  get context() {
    return this._context;
  }

  /**
   * When initialized, it draw the given figure and subscribes for changes. So, whenever the figure emits
   * a warning saying the a change happened, then the figure is drawn again.
   */
  ngOnInit() {
    if (this.figure) {
      this.figure.draw(this._context);
      this.figureSubscription = this.figure.$update.subscribe(() => this.figure.draw(this._context))
    }
    this.pointListSubscription = this.toolService.$plUpdate.subscribe(() => this.refreshStoredInfo());
  }

  /**
   * Remove the listener for changes in the figure when the canvas is destroyed.
   */
  ngOnDestroy() {
    this.figureSubscription.unsubscribe();
    this.pointListSubscription.unsubscribe();
  }

  clear() {
    this._context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  refreshStoredInfo(){
    this.pointList = [];
    this.polygonVertexCounter = undefined;
  }
}
