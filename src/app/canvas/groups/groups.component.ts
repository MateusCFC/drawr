import { Component, OnInit } from '@angular/core';
import { EditorService } from '../editor/editor.service';
import { Group } from '../../data/group';
import { GroupsService } from './groups.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  // private selectedShape: Shape;

  public selectedGroups: Group[] = [];


  constructor(public editorService: EditorService, public groupsService: GroupsService) { }

  ngOnInit() {
  }

  public createGroupFromSelectedShape(): void {
    this.groupsService.createGroup(this.editorService.selectedShape);
    this.updateSelectedGroups();
  }

  // public setSelectedShape(shape: Shape): void {
  //   // this.selectedShape = shape;
  //   this.updateSelectedGroups();
  // }

  public updateSelectedGroups(): void {
    this.selectedGroups = this.groupsService.getGroupsFromShape(this.editorService.selectedShape);
  }

  public compare(g1: Group, g2?: Group): boolean {
    // console.log('comparer');
    if (!g2) {
      return false;
    }
    if (g1.id === g2.id) {
      return true;
    }
    return false;
  }

  public processSelectedGroups(): void {
    for (const group of this.selectedGroups) {
      if (!group.has_shape(this.editorService.selectedShape)) {
        this.groupsService.addToGroup(group.id, this.editorService.selectedShape);
      }
    }

    const shapeGroups = this.groupsService.getGroupsFromShape(this.editorService.selectedShape);
    for (const old_group of shapeGroups) {
      let present = false;
      for (const group of this.selectedGroups) {
        if (this.compare(group, old_group)) {
          present = true;
        }
      }
      if (!present) {
        this.groupsService.removeFromGroup(old_group.id, this.editorService.selectedShape);
        // old_group.remove(this.shape);
      }
    }
    this.updateSelectedGroups();
  }
}
