import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface RandomNumbersResult {
  'range_max' : number,
  'generation_time_ns' : bigint,
  'count' : bigint,
  'seed' : Uint8Array | number[],
  'numbers' : Uint32Array | number[],
  'cycles_used' : bigint,
}
export interface _SERVICE {
  'generate_random_numbers' : ActorMethod<
    [],
    { 'Ok' : RandomNumbersResult } |
      { 'Err' : string }
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
