import type { AnyZodObject } from 'zod';
import type { Key } from '../types';
import { Emitter } from './Emitter';

export class ErrorKeyCollection<Schema extends AnyZodObject> extends Emitter {
  private keys: Set<Key<Schema>> = new Set();

  public addKey = (key: Key<Schema>) => {
    this.keys.add(key);
  };

  public resetKeys = () => {
    this.keys.clear();
  };

  public getKeys = () => {
    return this.keys;
  };
}
