import { Injectable } from "@angular/core";
import { tools } from './tools';

/**
 * Service responsible for managing the current drawing tool.
 */
@Injectable()
export class ToolService {
  private currentIndex: number;

  /**
   * Get the set of registered tools.
   */
  get tools() {
    return tools;
  }

  /**
   * Returns the current selected tool. If there is no selected tool, it returns the
   * first tool.
   * @return The current tool.
   */
  get selected() {
    return tools[this.currentIndex] || tools[0];
  }

  /**
   * Define a tool as the current one according to its name.
   * @param name the name (identifier) of the tool.
   */
  select(name: string) {
    this.currentIndex = tools.findIndex(tool => tool.name === name);
  }
}