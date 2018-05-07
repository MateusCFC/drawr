import { Component, OnInit, Input } from '@angular/core';
import { CanvasDirective } from '../../canvas.directive';
import { EditorService } from '../../editor/editor.service';
import { GroupService } from '../../../data/group.service';
import { MatDialog } from '@angular/material';
import { Line } from '../../../data/line';
import { Gradient } from '../../../data/shape';
import { ColorPickerComponent } from '../color-picker/color-picker.component';

@Component({
  selector: 'app-line-properties',
  templateUrl: './line-properties.component.html',
  styleUrls: ['./line-properties.component.css']
})
export class LinePropertiesComponent implements OnInit {

  x: number;
  y: number;
  width: number;
  rotation: number;
  transparency: number;

  stroke: string | Gradient;
  lineWidth: number;

  @Input() canvas: CanvasDirective;

  private shape: Line;

  constructor(public editorService: EditorService, public groupService: GroupService, public dialog: MatDialog) { }

  ngOnInit() {
    this.shape = this.editorService.selectedShape as Line;
    this.setFieldValues();
  }

  setFieldValues(){
    console.log(this.shape.id);
    this.x = this.shape.x;
    this.y = this.shape.y;
    this.width = this.shape.width;
    this.rotation = this.shape.rotation;
    this.transparency = this.shape.style.transparency * 100;

    this.lineWidth = this.shape.style.lineWidth;
    this.stroke = this.shape.style.stroke;

    this.groupService.setSelectedShape(this.shape);
  }

  updateShape(){
    this.shape.moveTo(Number(this.x), Number(this.y));
    this.shape.width = this.width;
    this.shape.rotation = this.rotation;
    this.shape.style.transparency = this.transparency / 100;

    this.shape.style.lineWidth = this.lineWidth;
    this.shape.style.stroke = this.stroke;

    this.canvas.figure.refresh();
    console.log(this.shape.id + ' updated');
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
