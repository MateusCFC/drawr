import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

/**
 * Service responsible for managing the snackbar usage.
 */
@Injectable()
export class SnackBarService {
  constructor(public snackBar: MatSnackBar) { }

  /**
   * Opens a predefined snackbar for the triangle tool.
   */
  openTriangleSnackBar() {
    this.snackBar.open("Triangle will be drawn based on three clicks!", "", {
      duration: 2000
    });
  }
}
