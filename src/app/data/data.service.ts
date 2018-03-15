import { Injectable } from '@angular/core';
import { Figure } from './figure';

/**
 * Simple service to provide app data access.
 * For the moment, it only creates new figures.
 */
@Injectable()
export class DataService {

  createFigure(): Figure {
    return new Figure();
  }
}
