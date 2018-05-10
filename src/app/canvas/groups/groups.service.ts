import { Subject } from 'rxjs/Subject';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { Group } from '../../data/group';
import { Shape } from '../../data/shape';

/**
 * Service to provide app group access.
 *
 */
@Injectable()
export class GroupsService {
  private groupCreated: Subject<Group> = new Subject<Group>();
  groupCreated$ = this.groupCreated.asObservable();
  // private groupCreatedObservable:

  // groupCreated: EventEmitter<Group>;

  private groups: Group[] = [];

  private currentGroupNumber = 1;

  public createGroup(shape: Shape): void {
    const g = new Group(('Group ' + String(this.currentGroupNumber)), shape);
    this.groups.push(g);
    this.currentGroupNumber += 1;
    this.groupCreated.next(g);
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
    // console.log('get groups');
    // console.log(this.groups);
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
    const list: Group[] = [];
    for (const group of this.groups) {
      if (group.has_shape(shape)) {
        list.push(group);
      }
    }
    // console.log('list groups from shape');
    // console.log(list);
    return list;
  }
}
