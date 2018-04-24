import { Component, OnInit, Input } from '@angular/core';
import { EditorService } from '../editor/editor.service';
import { CanvasDirective } from '../canvas.directive';

@Component({
  selector: 'app-canvas-props',
  templateUrl: './props.component.html',
  styleUrls: ['./props.component.css']
})
export class PropsComponent implements OnInit {

  x: number;
  y: number;

  height: number;
  width: number;

  @Input() canvas: CanvasDirective;

  constructor(private editorService: EditorService) {
  }

  ngOnInit() {
    this.editorService.shapeSelectionChanged.subscribe(() => {
      if (this.editorService.selectedShape) {
        this.x = this.editorService.selectedShape.x;
        this.y = this.editorService.selectedShape.y;
        this.width = this.editorService.selectedShape.width;
        this.height = this.editorService.selectedShape.height;
      } else {
        this.x = 0;
        this.y = 0;
      }
    });
  }

  updateShape(){
    this.editorService.selectedShape.moveTo(Number(this.x), Number(this.y));
    this.editorService.selectedShape.width = this.width;
    this.editorService.selectedShape.height = this.height;
    this.canvas.figure.refresh();
    console.log("updated shape");
  }

}
