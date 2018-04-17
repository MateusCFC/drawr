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
    ToolbarComponent
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
