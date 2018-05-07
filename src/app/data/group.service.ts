import { Injectable } from '@angular/core';
import { Group } from './group';
import { Shape } from './shape';

/**
 * Service to provide app group access.
 *
 */
@Injectable()
export class GroupService {
  private groups: Group[];

  private currentGroupNumber: number;

  public createGroup(shape: Shape): Group {
    const g = new Group(('Group ' + String(this.currentGroupNumber)), shape);
    this.groups.push(g);
    this.currentGroupNumber += 1;
    return g;
  }

  public addToGroup(name: String, shape: Shape): void {
    for (const group of this.groups) {
      if (group.name === name) {
        group.add(shape);
      }
    }
  }

  public removeFromGroup(name: String, shape: Shape): void {
    for (const group of this.groups) {
      if (group.name === name) {
        group.remove(shape);
      }
    }
  }

  public getGroupFromName(name: String): Group {
    for (const group of this.groups) {
      if (group.name === name) {
        return group;
      }
    }
  }

  public getGroupsFromShape(shape: Shape): Group[] {
    const list = [];
    for (const group of this.groups) {
      if (group.has_shape(shape)) {
        list.push(group);
      }
    }
    return list;
  }

}
