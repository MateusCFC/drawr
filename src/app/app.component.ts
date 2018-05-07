import { Component, HostListener } from '@angular/core';
import { DataService } from './data/data.service';
import { Figure } from './data/figure';
import { Rect } from './data/rect';
import { Gradient, Style, Shadow } from './data/shape';
import { Group } from './data/group';

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
  // fig2: Figure;

  /**
   * Create two figures to illustrate how to create figures and how to add shapes to them.
   * @param dataServ Service responsible for managing app data (the figures in our case).
   */
  constructor(private dataServ: DataService) {
    const grad: Gradient = {
      type: 'linear',
      start: { x: 0, y: 0 },
      end:   { x: 1, y: 1 },
      colors: [
        { position: 0, color: 'red'  },
        { position: 1, color: 'blue' }
      ]
    };

    const style: Partial<Style> = {
      fill: grad,
      lineWidth: 5
    };

    const shadow: Shadow = {
      offsetX: 5,
      offsetY: 5,
      blur: 3,
      color: 'green'
    };

    const r1 = new Rect({
      x: 100,
      y: 100,
      width: 50,
      height: 50,
      style,
      shadow,
    });

    r1.rotation = 45;
    r1.scale(0.5, 0.5, 0.5, 0.5);

    const r2 = new Rect({
      x: 50,
      y: 50,
      width: 50,
      height: 50,
      style: {
        fill: grad,
        lineWidth: 1
      }
    });

    r2.moveTo(100, 100);
    r2.style.transparency = 0.5;

    this.fig1 = dataServ.createFigure()
      .add(r1)
      .add(r2)
      .up(r1);
  }

  clicked(fig: Figure, event: MouseEvent) {
    const r = new Rect({
      x: event.offsetX,
      y: event.offsetY,
      style: {
        stroke: '#000',
        lineWidth: 1
      }
    });
    fig.add(r);
    fig.refresh();
  }
}
