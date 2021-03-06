import * as getRandomValues from 'get-random-values'

/**
 * Return values in the range of [0, 1)
 */
export const randomFloatFromCrypto = function () {
  const int = getRandomValues(new Uint32Array(1))[0]
  return int / 2**32
}
 
// Generate a random integer r with equal chance in  min <= r < max.
export function randRange(min: number, max: number) {
  var range = max - min;
  if (range <= 0) {
      throw new Error('max must be larger than min');
  }
  var requestBytes = Math.ceil(Math.log2(range) / 8);
  if (!requestBytes) { // No randomness required
      return min;
  }
  var maxNum = Math.pow(256, requestBytes);
  var ar = new Uint8Array(requestBytes);

  while (true) {
      getRandomValues(ar);

      var val = 0;
      for (var i = 0;i < requestBytes;i++) {
          val = (val << 8) + ar[i];
      }

      if (val < maxNum - maxNum % range) {
          return min + (val % range);
      }
  }
}