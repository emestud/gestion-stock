import {Item} from './types';

/**
 * This function prints nicely proxy objects
 * @param object object to print
 */
export function proxyPrint(object: any) {
  if (object === undefined || object === null) {
    return;
  }
  console.log(JSON.parse(JSON.stringify(object)));
}

export function itemIsInArray(array: Array<any>, name: string) {
  for (const item of array) {
    if (item.name === name) {
      return item;
    }
  }
  return null;
}
