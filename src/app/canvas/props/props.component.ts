import { Component, OnInit } from '@angular/core';
import { EditorService } from '../editor/editor.service';

@Component({
  selector: 'app-canvas-props',
  templateUrl: './props.component.html',
  styleUrls: ['./props.component.css']
})
export class PropsComponent implements OnInit {

  constructor(private propsService: EditorService) {

  }

  ngOnInit() {
  }

}
