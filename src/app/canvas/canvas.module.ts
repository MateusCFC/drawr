import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasDirective } from './canvas.directive';
import { CanvasEditorComponent } from './editor/editor.component';
import { PropsComponent } from './props/props.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SharedModule } from '../shared/shared.module';
import { ToolService } from './toolbar/tool.service';
import { EditorService } from './editor/editor.service';
import { FormsModule } from '@angular/forms';
import { ColorPickerComponent } from './props/color-picker/color-picker.component';
import { RectPropertiesComponent } from './props/rect-properties/rect-properties.component';
import { CirclePropertiesComponent } from './props/circle-properties/circle-properties.component';
import { LinePropertiesComponent } from './props/line-properties/line-properties.component';
import { DoodlePropertiesComponent } from './props/doodle-properties/doodle-properties.component';
import { StarPropertiesComponent } from './props/star-properties/star-properties.component';

/**
 * Integrate drawing funcionalities in a canvas.
 */
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  declarations: [
    CanvasDirective,
    CanvasEditorComponent,
    PropsComponent,
    ToolbarComponent,
    ColorPickerComponent,
    RectPropertiesComponent,
    CirclePropertiesComponent,
    LinePropertiesComponent,
    DoodlePropertiesComponent,
    StarPropertiesComponent
  ],
  providers: [
    ToolService,
    EditorService
  ],
  exports: [
    CanvasDirective,
    CanvasEditorComponent
  ]
})
export class CanvasModule { }
