import type { AnyZodObject } from 'zod';
import type { Key } from '../types';
import { Emitter } from './Emitter';

export class ErrorKeyCollection<Schema extends AnyZodObject> extends Emitter {
  private keys: Key<Schema>[] = [];

  public addKey = (key: Key<Schema>) => {
    if (this.keys.includes(key)) return;
    this.keys.push(key);
    this.broadcast();
  };

  public resetKeys = () => {
    this.keys = [];
    this.broadcast();
  };

  public getKeys = () => {
    return this.keys;
  };
}
