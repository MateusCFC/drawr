import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasDirective } from './canvas.directive';
import { CanvasEditorComponent } from './editor/editor.component';
import { PropsComponent } from './props/props.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SharedModule } from '../shared/shared.module';
import { ToolService } from './toolbar/tool.service';

/**
 * Integrate drawing funcionalities in a canvas.
 */
@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    CanvasDirective,
    CanvasEditorComponent,
    PropsComponent,
    ToolbarComponent
  ],
  providers: [
    ToolService
  ],
  exports: [
    CanvasDirective,
    CanvasEditorComponent
  ]
})
export class CanvasModule { }
