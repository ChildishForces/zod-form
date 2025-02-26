import { Listener } from '../types';
import { nanoid } from 'nanoid/non-secure';

export class Emitter {
  /**
   * Map of active listeners
   */
  protected listeners: Map<string, Listener> = new Map();

  /**
   * Add a subscription for state updates, has no arguments, it's simply a
   * notification for pulling the latest data.
   * @param listeners
   */
  subscribe = (listeners: Listener) => {
    const id = nanoid();
    this.listeners.set(id, listeners);
    return () => {
      this.listeners.delete(id);
    };
  };

  /**
   * Broadcast an update to emitter state
   */
  public broadcast = () => {
    for (const listener of this.listeners.values()) {
      listener();
    }
  };
}
