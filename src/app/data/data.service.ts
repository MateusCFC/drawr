import { Component, Injectable } from '@angular/core';
import { Figure } from './figure';
import * as jsPDF from 'jspdf';

/**
 * Simple service to provide app data access.
 * For the moment, it only creates new figures.
 */
@Injectable()
export class DataService {

  createFigure(): Figure {
    return new Figure();
  }

  /**
   * Function responsible for forcing the browser to download
   * 
   * @param image_ 
   * @param filename_ 
   */
  download(image_, filename_) {
    // Create a virtual link <a>
    var a = document.createElement("a");

    // Set its exportation object
    a.href = image_;

    // Set the filename
    a['download'] = filename_;

    // Attach a mouse event
    var e = document.createEvent("MouseEvents");

    // Use of deprecated function to satisfy TypeScript.
    e.initMouseEvent("click", true, false,
        document.defaultView, 0, 0, 0, 0, 0,
        false, false, false, false, 0, null);
    a.dispatchEvent(e);
    //a.removeNode();
  }

  /**
   * Function responsible for saving the draw as image
   * 
   * @param canvas_ 
   */
  saveAsImage(canvas_) {
    // Convert the canvas to image
    let imgData = canvas_.toDataURL("image/png;base64;");

    // Force download
    this.download(imgData, 'desenho.png');
  }

  /**
   * Function responsible for saving the draw as pdf
   * 
   * @param canvas_ 
   */
  saveAsPDF(canvas_) {
    // Only jpeg is supported by jsPDF
    let imgData = canvas_.toDataURL("image/jpeg", 1.0);
    let pdf = new jsPDF();

    pdf.addImage(imgData, 'JPEG', 0, 0);
    pdf.save("desenho.pdf");
  }
}