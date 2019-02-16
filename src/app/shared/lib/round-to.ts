export function roundTo(value, decimals, f = Math.round) {
  return Number(f(Number(value + 'e' + (-decimals))) + 'e' + decimals);
}
