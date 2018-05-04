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
   * Function responsible for saving the draw as image
   * 
   * @param canvas_ 
   */
  saveAsImage(canvas_) {
    // Convert the canvas to image
    let imgData = canvas_.toDataURL("image/png;base64;");

    // Force download
    imgData = imgData.replace("image/png","image/octet-stream");
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