import { Component, OnInit, Input } from '@angular/core';
import { EditorService } from '../editor/editor.service';
import { CanvasDirective } from '../canvas.directive';
import { Gradient, Pattern } from '../../data/shape';

@Component({
  selector: 'app-canvas-props',
  templateUrl: './props.component.html',
  styleUrls: ['./props.component.css']
})
export class PropsComponent implements OnInit {

  x: number;
  y: number;
  height: number;
  width: number;
  rotation: number;
  transparency: number;

  //auxiliares para definição da cor de preenchimento
  red: number;
  green: number;
  blue: number;

  fill: string | Gradient | Pattern;
  stroke: string | Gradient;
  lineWidth: number;


  @Input() canvas: CanvasDirective;

  constructor(private editorService: EditorService) {
  }

  ngOnInit() {
    this.editorService.shapeSelectionChanged.subscribe(() => {
      if (this.editorService.selectedShape) {
        this.x = this.editorService.selectedShape.x;
        this.y = this.editorService.selectedShape.y;
        this.width = this.editorService.selectedShape.width;
        this.height = this.editorService.selectedShape.height;
        this.rotation = this.editorService.selectedShape.rotation;
        this.transparency = this.editorService.selectedShape.style.transparency * 100;

        let rgb = this.hexToRgb(this.editorService.selectedShape.properties.style.fill);
        this.red = rgb.r;
        this.green = rgb.g;
        this.blue = rgb.b;

        this.fill = this.editorService.selectedShape.properties.style.fill;

        this.lineWidth = this.editorService.selectedShape.properties.style.lineWidth;
        this.stroke = this.editorService.selectedShape.properties.style.stroke;
      } else {
        this.x = 0;
        this.y = 0;
      }
    });
  }

  updateShape(){
    this.editorService.selectedShape.moveTo(Number(this.x), Number(this.y));
    this.editorService.selectedShape.width = this.width;
    this.editorService.selectedShape.height = this.height;
    this.editorService.selectedShape.rotation = this.rotation;
    this.editorService.selectedShape.style.transparency = this.transparency / 100;

    this.fill = this.rgbToHex(this.red, this.green, this.blue);
    this.editorService.selectedShape.properties.style.fill = this.fill;

    this.editorService.selectedShape.properties.style.lineWidth = this.lineWidth;
    this.editorService.selectedShape.properties.style.stroke = this.stroke;

    this.canvas.figure.refresh();
    console.log("updated shape");
  }

  /**
   * Converte valores RGB em seu correspondente Hexadecimal
   * https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
   * @param r
   * @param g
   * @param b
   */
  rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /**
   * Converte um valor em Hexadecimal no seu objeto correspondente RGB
   * https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
   * @param hex
   */
  hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }

}
