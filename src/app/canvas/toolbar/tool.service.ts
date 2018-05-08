import { Injectable } from '@angular/core';
import { tools } from './tools';
import { Subject } from 'rxjs/Subject';
import { SnackBarService } from './snackbar.service';
import { DialogService } from './dialog.service';

/**
 * Service responsible for managing the current drawing tool.
 */
@Injectable()
export class ToolService {
  constructor(private snackBarService: SnackBarService, private dialogService: DialogService) { }

  private currentIndex: number;

  private pointListSubject = new Subject<boolean>();

  $plUpdate = this.pointListSubject.asObservable();

  /**
   * Get the set of registered tools.
   */
  get tools() {
    return tools;
  }

  /**
   * Returns the current selected tool. If there is no selected tool, it returns the
   * first tool.
   * @return The current tool.
   */
  get selected() {
    return tools[this.currentIndex] || tools[0];
  }

  /**
   * Define a tool as the current one according to its name.
   * @param name the name (identifier) of the tool.
   */
  select(name: string) {
    this.currentIndex = tools.findIndex(tool => tool.name === name);
    if (tools[this.currentIndex].name != 'polygon') {
      this.pointListSubject.next(true);
    }
    if (tools[this.currentIndex].name == 'triangle') {
      this.snackBarService.openTriangleSnackBar();
    }
    if (tools[this.currentIndex].name == 'polygon'){
      this.dialogService.openPolygonDialog();
    }
  }
}
