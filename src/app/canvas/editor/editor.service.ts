import { Injectable } from "@angular/core";
import { Shape } from "../../data/shape";

@Injectable()
export class EditorService {
    selectedShape: Shape;
}