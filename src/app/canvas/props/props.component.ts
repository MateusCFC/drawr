import { Component, OnInit, Input } from '@angular/core';
import { EditorService } from '../editor/editor.service';
import { CanvasDirective } from '../canvas.directive';
import { Gradient, Pattern } from '../../data/shape';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ColorPickerComponent } from './color-picker/color-picker.component';

@Component({
  selector: 'app-canvas-props',
  templateUrl: './props.component.html',
  styleUrls: ['./props.component.css'],
  entryComponents: [ ColorPickerComponent ]
})
export class PropsComponent implements OnInit {

  x: number;
  y: number;
  height: number;
  width: number;
  rotation: number;
  transparency: number;

  fill: string | Gradient | Pattern;
  stroke: string | Gradient;
  lineWidth: number;

  @Input() canvas: CanvasDirective;

  constructor(private editorService: EditorService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.editorService.shapeSelectionChanged.subscribe(() => {
      if (this.editorService.selectedShape) {
        this.x = this.editorService.selectedShape.x;
        this.y = this.editorService.selectedShape.y;
        this.width = this.editorService.selectedShape.width;
        this.height = this.editorService.selectedShape.height;
        this.rotation = this.editorService.selectedShape.rotation;
        this.transparency = this.editorService.selectedShape.style.transparency * 100;

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
    this.editorService.selectedShape.style.transparency = this.transparency / 100;

    this.editorService.selectedShape.properties.style.fill = this.fill;


    this.editorService.selectedShape.properties.style.lineWidth = this.lineWidth;
    this.editorService.selectedShape.properties.style.stroke = this.stroke;

    this.canvas.figure.refresh();
    console.log("updated shape");
  }


  openColorPickerFill(): void {
    let dialogRef = this.dialog.open(ColorPickerComponent, {
      width: '250px',
      data: { hex: this.fill }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.fill = result;
        this.updateShape();
      }
    });
  }

  openColorPickerStroke(): void {
    let dialogRef = this.dialog.open(ColorPickerComponent, {
      width: '250px',
      data: { hex: this.stroke }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.stroke = result;
        this.updateShape();
      }
    });
  }

}
