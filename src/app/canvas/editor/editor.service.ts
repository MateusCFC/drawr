import { Injectable } from "@angular/core";
import { Shape } from "../../data/shape";
import { Point } from "../../data/point";

@Injectable()
export class EditorService {
    selectedShape: Shape;

    //saves point list. used by the doodle tool.
    pointList: Point[] = [];
}