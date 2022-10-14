/**
 * @description checks if the number/length of string is below max
 * @param {string | number} element that will be checked
 * @param {number} max value that will be check against
 * @returns {boolean} true if element is greater than max
 */
export function moreThan(element: string | number, max: number) {
  if (max) {
    if (typeof element === 'string') {
      return max < element.length
    }
    return max < element
  }
}

/**
 * @description checks if the number/length of string is above min
 * @param {string | number} element that will be checked
 * @param {number} min value that will be check against
 * @returns {boolean} true if element is less than min
 */
export function lessThan(element: string | number, min: number) {
  if (min) {
    if (typeof element === 'string') {
      return min > element.length
    }
    return min > element
  }
}
