import { Component, OnInit, Input } from '@angular/core';
import { Gradient, Pattern } from '../../../data/shape';
import { CanvasDirective } from '../../canvas.directive';
import { Triangle } from '../../../data/triangle';
import { EditorService } from '../../editor/editor.service';
import { MatSelect, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ColorPickerComponent } from '../color-picker/color-picker.component';

@Component({
  selector: 'app-triangle-properties',
  templateUrl: './triangle-properties.component.html',
  styleUrls: ['./triangle-properties.component.css']
})
export class TrianglePropertiesComponent implements OnInit {

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

  private shape: Triangle;

  constructor(public editorService: EditorService, public dialog: MatDialog) { }

  ngOnInit() {
    this.shape = this.editorService.selectedShape as Triangle;
    this.setFieldValues();

    // atualiza o painel de propriedades quando o usuário interagir com as shapes direto no canvas
    this.canvas.figure.$update.subscribe(() => {
      this.setFieldValues();
    });
  }

  setFieldValues() {
    console.log(this.shape.id);
    this.x = this.shape.x;
    this.y = this.shape.y;
    this.width = this.shape.width;
    this.height = this.shape.height;
    this.rotation = this.shape.rotation;
    this.transparency = this.shape.style.transparency * 100;

    this.fill = this.shape.style.fill;

    this.lineWidth = this.shape.style.lineWidth;
    this.stroke = this.shape.style.stroke;
  }

  updateShape(): void {
    this.shape.moveTo(Number(this.x), Number(this.y));
    /*this.shape.width = this.width;*/
    /*this.shape.height = this.height;*/
    this.shape.rotation = this.rotation;
    this.shape.style.transparency = this.transparency / 100;

    this.shape.style.fill = this.fill;


    this.shape.style.lineWidth = this.lineWidth;
    this.shape.style.stroke = this.stroke;

    this.canvas.figure.refresh();
    console.log(this.shape.id + ' updated');
  }

  openColorPickerFill(): void {
    const dialogRef = this.dialog.open(ColorPickerComponent, {
      width: '250px',
      data: { hex: this.fill }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fill = result;
        this.updateShape();
      }
    });
  }

  openColorPickerStroke(): void {
    const dialogRef = this.dialog.open(ColorPickerComponent, {
      width: '250px',
      data: { hex: this.stroke }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.stroke = result;
        this.updateShape();
      }
    });
  }

}
