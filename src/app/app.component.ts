import { Component } from '@angular/core';
import { DataService } from './data/data.service';
import { Figure } from './data/figure';

/**
 * Main component. It demonstrates the use of the other components. 
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  fig1: Figure;
  fig2: Figure;

  /**
   * Create two figures to illustrate how to create figures and how to add shapes to them.
   * @param dataServ Service responsible for managing app data (the figures in our case).
   */
  constructor(private dataServ: DataService) {
    this.fig1 = dataServ.createFigure();
    this.fig2 = dataServ.createFigure()
      .addShape('rect', {
        top: 10,
        left: 10
      })
      .addShape('rect', {
        top: 50,
        left: 50
      });
  }

  clicked(fig: Figure, event: MouseEvent) {
    fig.addShape('rect', {
      top: event.offsetY,
      left: event.offsetX
    });
}
}
