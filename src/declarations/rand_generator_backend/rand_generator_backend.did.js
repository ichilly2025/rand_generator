export const idlFactory = ({ IDL }) => {
  const RandomNumbersResult = IDL.Record({
    'range_max' : IDL.Nat32,
    'generation_time_ns' : IDL.Nat64,
    'count' : IDL.Nat64,
    'seed' : IDL.Vec(IDL.Nat8),
    'numbers' : IDL.Vec(IDL.Nat32),
    'cycles_used' : IDL.Nat64,
  });
  return IDL.Service({
    'generate_random_numbers' : IDL.Func(
        [],
        [IDL.Variant({ 'Ok' : RandomNumbersResult, 'Err' : IDL.Text })],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
