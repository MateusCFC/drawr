import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Figure } from '../data/figure';
import { Subscription } from 'rxjs/Subscription';
import { Point } from '../data/point';
import { ToolService } from '../canvas/toolbar/tool.service';
import { EditorService } from './editor/editor.service';
import { GroupsService } from './groups/groups.service';

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

  /**
   * It indicates if it's the main canvas to edit,
   * the others are only for viewing shapes. It's important
   * to place a marker if it could show controllers, like
   * resize, rotate, and more.
   */
  mainCanvas: boolean;

  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D;
  private figureSubscription: Subscription;

  // saves point list. used by the doodle, triangle and polygon tools.
  public pointList: Point[] = [];

  // subscription that listens to tool changes to persist (or not) information.
  private pointListSubscription: Subscription;

  private groupCreatedSubscription: Subscription;

  // saves polygon points counter. used by the polygon function.
  public polygonVertexCounter: number;

  constructor(elm: ElementRef, private editorService: EditorService, private toolService: ToolService,
    private groupsService: GroupsService) {
    this._canvas = elm.nativeElement;
    this._context = this._canvas.getContext('2d');
    this._canvas.style.border = '1px dashed #ccc';
    this.mainCanvas = false;
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
    this._canvas.height = this.height;
    this._canvas.width = this.width;

    if (this.figure) {
      this.figure.draw(this, this.editorService);
      this.figureSubscription = this.figure.$update.subscribe(() =>
        this.figure.draw(this, this.editorService)
      );
    }
    this.pointListSubscription = this.toolService.$plUpdate.subscribe(() => this.refreshStoredInfo());

    this.groupCreatedSubscription = this.groupsService.groupCreated$.subscribe(
      group => {
        console.log('Evento Grupo Criado');
        console.log(group);
      }
    );
  }

  /**
   * Remove the listener for changes in the figure when the canvas is destroyed.
   */
  ngOnDestroy() {
    this.figureSubscription.unsubscribe();
    this.pointListSubscription.unsubscribe();
    this.groupCreatedSubscription.unsubscribe();
  }

  clear() {
    this._context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Refreshes the info stored on persistent variables used by the tools.
   */
  refreshStoredInfo(){
    this.pointList = [];
    this.polygonVertexCounter = undefined;
  }
}
