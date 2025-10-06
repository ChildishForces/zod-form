import type { z } from 'zod';
import type { Key } from '../types';
import { Emitter } from './Emitter';

export class ErrorKeyCollection<Schema extends z.ZodObject> extends Emitter {
  private _keys: Key<Schema>[] = [];

  private set keys(keys: Key<Schema>[]) {
    this._keys = keys;
    this.broadcast();
  }

  private get keys() {
    return this._keys;
  }

  public addKey = (key: Key<Schema>) => {
    if (this.keys.includes(key)) return;
    this.keys = [...this.keys, key];
  };

  public resetKeys = () => {
    this.keys = [];
  };

  public getKeys = () => {
    return this.keys;
  };
}
