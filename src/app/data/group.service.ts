import { Injectable } from '@angular/core';
import { Group } from './group';
import { Shape } from './shape';

/**
 * Service to provide app group access.
 *
 */
@Injectable()
export class GroupService {
  private groups: Group[] = [];

  private currentGroupNumber = 1;

  private selectedShape: Shape;

  public selectedGroups: Group[] = [];

  public createGroup(shape: Shape): Group {
    const g = new Group(('Group ' + String(this.currentGroupNumber)), shape);
    this.groups.push(g);
    this.currentGroupNumber += 1;
    // console.log('groups: ');
    // console.log(this.groups);
    // console.log('new group: ');
    // console.log(g);
    return g;
  }

  public createGroupFromSelectedShape(): void {
    this.createGroup(this.selectedShape);
    this.updateSelectedGroups();
  }

  public addToGroup(id: String, shape: Shape): void {
    // console.log('add to group');
    for (const group of this.groups) {
      if (group.id === id) {
        group.add(shape);
      }
    }
  }

  public removeFromGroup(id: String, shape: Shape): void {
    // console.log('remove from group');
    for (const group of this.groups) {
      if (group.id === id) {
        group.remove(shape);
      }
    }
  }

  public getGroups(): Group[] {
    console.log('get groups');
    console.log(this.groups);
    return this.groups;
  }

  public getGroupFromName(name: String): Group {
    for (const group of this.groups) {
      if (group.name === name) {
        return group;
      }
    }
  }

  public getGroupsFromShape(shape: Shape): Group[] {
    let list: Group[] = [];
    for (let group of this.groups) {
      if (group.has_shape(shape)) {
        list.push(group);
      }
    }
    console.log('list groups from shape');
    console.log(list);
    return list;
  }

  public setSelectedShape(shape: Shape): void {
    this.selectedShape = shape;
    this.updateSelectedGroups();
  }

  public updateSelectedGroups(): void {
    this.selectedGroups = this.getGroupsFromShape(this.selectedShape);
  }

  public processSelectedGroups(): void {
    for (const group of this.selectedGroups) {
      if (!group.has_shape(this.selectedShape)) {
        this.addToGroup(group.id, this.selectedShape);
      }
    }

    const shapeGroups = this.getGroupsFromShape(this.selectedShape);
    for (const old_group of shapeGroups) {
      let present = false;
      for (const group of this.selectedGroups) {
        if (this.compare(group, old_group)) {
          present = true;
        }
      }
      if (!present) {
        this.removeFromGroup(old_group.id, this.selectedShape);
        // old_group.remove(this.shape);
      }
    }

    this.updateSelectedGroups();
  }

  public compare(g1: Group, g2?: Group): boolean {
    console.log('comparer');
    if (!g2) {
      return false;
    }
    if (g1.id === g2.id) {
      return true;
    }
    return false;
  }

}
