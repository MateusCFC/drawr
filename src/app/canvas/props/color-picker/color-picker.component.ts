import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


const MAX_SATURATION = 100;
const MAX_BRIGHTNESS = 100;
const MAX_HUE = 360;

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css']
})
export class ColorPickerComponent implements OnInit {

  /*auxiliares para definição da cor nos sliders RGB*/
  red: number;
  green: number;
  blue: number;

  /*auxiliares para definição da cor nos sliders HSB*/
  hue: number;
  saturation: number;
  brightness: number;

  /*seletor de brilho e saturação*/
  @ViewChild ('SBcontrol') SBcontrol;

  /*seletor de hue (matiz)*/
  @ViewChild ('Hcontrol') Hcontrol;

  saturationLimit;

  brightnessLimit;

  hueLimit;

  /**
   * API cara conversão entre formatos de cores
   * https://www.npmjs.com/package/colorsys
   * */
  colorsy = require('colorsys');

  constructor(
    public dialogRef: MatDialogRef<ColorPickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    const rgb = this.hexToRgb(this.data.hex);
    this.red = rgb.r;
    this.green = rgb.g;
    this.blue = rgb.b;

    const hsb = this.colorsy.rgb_to_hsl(rgb);
    this.hue = hsb.h;
    this.saturation = hsb.s;
    this.brightness = hsb.l;

    this.saturationLimit = this.SBcontrol.nativeElement.offsetWidth;
    this.brightnessLimit = this.SBcontrol.nativeElement.offsetHeight;
    this.hueLimit = this.Hcontrol.nativeElement.offsetHeight;
  }

  updateRGB() {
    const rgb = this.colorsy.hsl_to_rgb(this.hue, this.saturation, this.brightness);
    this.red = rgb.r;
    this.green = rgb.g;
    this.blue = rgb.b;
  }

  updateHSB() {
    const hsb = this.colorsy.rgb_to_hsl(this.red, this.green, this.blue);
    this.hue = hsb.h;
    this.saturation = hsb.s;
    this.brightness = hsb.l;
  }

  save() {
    this.dialogRef.close(this.rgbToHex(this.red, this.green, this.blue));
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
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Converte um valor em rgb para seu correspondente em HSB
   */
  rgbToHsb(r, g, b) {
    const hsb = this.colorsy.rgb_to_hsl(r, g, b);
    return hsb.h + ' ' + hsb.s + ' ' + hsb.l;
  }

  /**
   * Event handler to mouse down event.
   * @param event mouse down event
   */
  SBmouseDown(event: MouseEvent) {
    /*const x = event.offsetX;
    const y = event.offsetY;
    this.dragOrigin = { x, y };*/
    this.SBcontrol.nativeElement.children[0].style.left = (event.offsetX - 5) + "px";
    this.SBcontrol.nativeElement.children[0].style.top = (event.offsetY - 5) + "px";

    this.saturation = Math.round(event.offsetX * MAX_SATURATION / this.saturationLimit);
    this.brightness = MAX_BRIGHTNESS - Math.round(event.offsetY * MAX_BRIGHTNESS / this.brightnessLimit);
    this.updateRGB();
  }

    /**
   * Event handler to mouse down event.
   * @param event mouse down event
   */
  HmouseDown(event: MouseEvent) {
    /*const x = event.offsetX;
    const y = event.offsetY;
    this.dragOrigin = { x, y };*/
    this.Hcontrol.nativeElement.children[0].style.top = (event.offsetY - 5) + "px";

    this.hue = MAX_HUE - Math.round(event.offsetY * MAX_HUE / this.hueLimit);
    this.updateRGB();
  }

  /**
   * Event handler to mouse up event.
   * @param event mouse up event
   */
  SBmouseUp(event: MouseEvent) {
   /* const x = event.offsetX;
    const y = event.offsetY;
    const tool = this.toolService.selected;
    if (this.isDragging) {
      if (tool && tool.dragEnd) {
        tool.dragEnd(this.canvas, this.layer, this.editorService, this.dragOrigin, { x, y });
      }
    } else {
      if (tool && tool.click) {
        tool.click(this.canvas, this.layer, this.editorService, this.dragOrigin, null, this.canvas.context);
      }
    }
    this.resetMouseEvent();
    */
  }

  /**
   * Event handler to mouse move event.
   * @param event mouse move event
   */
  SBmouseMove(event: MouseEvent) {
    /*const x = event.offsetX;
    const y = event.offsetY;

    // reset cursor
    document.body.style.cursor = 'default';

    // if dragOrigin is not undefined, then the user has pressed the mouse button.
    if (this.dragOrigin) {
      const tool = this.toolService.selected;
      if (!this.isDragging) {
        const movedUpDown = Math.abs(y - this.dragOrigin.y) > MOVE_THRESHOLD;
        const movedLeftRight = Math.abs(x - this.dragOrigin.x) > MOVE_THRESHOLD;
        if (movedUpDown || movedLeftRight) {
          this.isDragging = true;
          if (tool && tool.dragStart) {
            tool.dragStart(this.canvas, this.layer, this.editorService, this.dragOrigin);
          }
        }
      } else {
        if (tool && tool.drag) {
          tool.drag(this.canvas, this.layer, this.editorService, this.dragOrigin, { x, y });
        }
      }
    } else {

      // If there is a selected shape, then show custom cursor on controls
      if (this.editorService.selectedShape) {
        // code here
        const obj = new ObjectController(this.editorService);

        if (obj.isTopLeftScaleController({x, y})) {
          console.log('ok');
          document.body.style.cursor = 'nwse-resize';
        }
      }

    }
    */
  }

  /**
   * Called when the mouse gets out from the canvas or when some interaction has finished.
   * @param event mouse out event
   */
  SBresetMouseEvent(event?: MouseEvent) {
    /*if (this.isDragging && event && event.type === 'mouseout') {
      const x = event.offsetX;
      const y = event.offsetY;
      const tool = this.toolService.selected;
      if (tool && tool.dragEnd) {
        tool.dragEnd(this.canvas, this.layer, this.editorService, this.dragOrigin, { x, y });
      }
    }
    this.dragOrigin = undefined;
    this.isDragging = false;
    */
  }

}
