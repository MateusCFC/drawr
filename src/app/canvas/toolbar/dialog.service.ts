import { Injectable } from '@angular/core';
import { PolygonVerticesHandler } from '../../data/polygon';
import Swal from 'sweetalert2'

/**
 * Service responsible for managing the dialog boxes' usage.
 */
@Injectable()
export class DialogService {
  constructor() {
  }

  /**
   * Opens a predefined dialog, asking for the polygon vertex counter.
   */
  openPolygonDialog() {
    Swal({
      title: 'How many vertices will the polygon have?',
      text: 'Remember, the polygon will be drawn based on the number of vertices as clicks!',
      input: 'number',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
    }).then((result) => {
      PolygonVerticesHandler.VERTEX_COUNTER = result.value;
    });
  }
}
