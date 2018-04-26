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

  createGroup(shapes: Shape[]): void {
    this.groups.push(new Group(('Group ' + String(this.currentGroupNumber)), shapes));
    this.currentGroupNumber += 1;
  }

  addToGroup(name: String, shapes: Shape[]) {
    for (let group of this.groups) {
      if (group.name === name) {
        group.add(shapes);
      }
    }
  }

  removeFromGroup(name: String, shapes: Shape[]) {
    for (let group of this.groups) {
      if (group.name === name) {
        group.remove(shapes);
      }
    }
  }
}
