import { Component, OnInit, Input } from '@angular/core';
import { EditorService } from '../editor/editor.service';
import { CanvasDirective } from '../canvas.directive';
import { Gradient, Pattern } from '../../data/shape';

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
  fill: string | Gradient | Pattern;
  stroke: string | Gradient;
  lineWidth: number;
  rotation: number;

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
        this.rotation = this.editorService.selectedShape.rotation;

        this.fill = this.editorService.selectedShape.properties.style.fill;

        this.lineWidth = this.editorService.selectedShape.properties.style.lineWidth;
        this.stroke = this.editorService.selectedShape.properties.style.stroke;
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
    this.editorService.selectedShape.rotation = this.rotation;

    this.editorService.selectedShape.properties.style.fill = this.fill;
    this.editorService.selectedShape.properties.style.lineWidth = this.lineWidth;
    this.editorService.selectedShape.properties.style.stroke = this.stroke;

    this.canvas.figure.refresh();
    console.log("updated shape");
  }

}
