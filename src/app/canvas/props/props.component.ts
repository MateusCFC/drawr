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

  @Input() canvas: CanvasDirective;

  constructor(public editorService: EditorService) {
  }

  ngOnInit() {
  }

}
