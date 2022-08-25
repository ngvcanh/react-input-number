import { KeyboardEvent } from "react";
import BigNumber from "@kensoni/big-number";

const WHITELIST_KEYS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Backspace'
];

const COMMAND_KEYS = ['a', 'c', 'x', 'v', 'z', 'r']

export function isWhiteKeys(key: string, value: BigNumber, comma?: boolean, disableNegative?: boolean, integer?: boolean){
  const sep = comma ? ',' : '.';

  return WHITELIST_KEYS
  .concat((integer || existSep(value)) ? [] : [ sep ])
  .concat(!disableNegative && value.value === '' ? ['-'] : [])
  .includes(key);
}

export function existSep(value: BigNumber){
  return value.toString().includes('.');
}

export function revertByChange(value: string, comma?: boolean){
  if (comma){
    return value.replace(/\./g, '').replace(',', '.');
  }
  return value.replace(/,/g, '');
}

export function isCommandKey(e: KeyboardEvent){
  if (!e.ctrlKey && !e.metaKey) return false;
  return COMMAND_KEYS.includes(e.key);
}