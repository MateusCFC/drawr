import { Component, OnInit, Input } from '@angular/core';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { Gradient, Pattern } from '../../../data/shape';
import { CanvasDirective } from '../../canvas.directive';
import { EditorService } from '../../editor/editor.service';
import { MatDialog } from '@angular/material';
import { Circle } from '../../../data/circle';

@Component({
  selector: 'app-circle-properties',
  templateUrl: './circle-properties.component.html',
  styleUrls: ['./circle-properties.component.css'],
  entryComponents: [ ColorPickerComponent ]
})
export class CirclePropertiesComponent implements OnInit {

  x: number;
  y: number;
  height: number;
  width: number;
  radius: number;
  rotation: number;
  transparency: number;

  fill: string | Gradient | Pattern;
  stroke: string | Gradient;
  lineWidth: number;

  @Input() canvas: CanvasDirective;

  private shape: Circle;

  constructor(public editorService: EditorService, public dialog: MatDialog) {
  }

  ngOnInit() {
    /*this.editorService.shapeSelectionChanged.subscribe(() => {
      if (this.editorService.selectedShape) {
        this.setFieldValues();
      }
    });
    */
    this.shape = this.editorService.selectedShape as Circle;
    this.setFieldValues();
  }

  setFieldValues(){
    console.log(this.shape.id);

    this.x = this.shape.x;
    this.y = this.shape.y;
    this.width = this.shape.width;
    this.height = this.shape.height;

    this.radius = this.shape.props.radius;
    this.rotation = this.shape.rotation;
    this.transparency = this.shape.style.transparency * 100;

    this.fill = this.shape.style.fill;

    this.lineWidth = this.shape.style.lineWidth;
    this.stroke = this.shape.style.stroke;
  }

  updateShape(){
    this.shape.moveTo(Number(this.x), Number(this.y));
    this.shape.props.radius = this.radius;
    this.width = this.shape.props.radius * 2;
    this.height = this.shape.props.radius * 2;
    this.shape.rotation = this.rotation;
    this.shape.style.transparency = this.transparency / 100;

    this.shape.style.fill = this.fill;


    this.shape.style.lineWidth = this.lineWidth;
    this.shape.style.stroke = this.stroke;

    this.canvas.figure.refresh();
    console.log(this.shape.id + ' updated');
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
