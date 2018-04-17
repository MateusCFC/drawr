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

  @Input() canvas: CanvasDirective;

  constructor(private editorService: EditorService) {
  }

  ngOnInit() {
    this.editorService.shapeSelectionChanged.subscribe(() => {
      if (this.editorService.selectedShape) {
        this.x = this.editorService.selectedShape.x;
        this.y = this.editorService.selectedShape.y;
      } else {
        this.x = 0;
        this.y = 0;
      }
    });
  }

  updateShape(){
    console.log("update shape"+this.x + " "+this.y);
    this.editorService.selectedShape.moveTo(this.x, this.y);
    this.canvas.figure.refresh();
  }

}
