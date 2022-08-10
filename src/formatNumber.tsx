export interface FormatNumberOptions{
  /**
   * Use comma as separator between integer and decimal part
   */
  comma?: boolean;

  /**
   * Number of characters decimal part will split.
   * - If `true`, decimal part keep all characters passed.
   * - If `false`, decimal part is skip.
   */
  decimal?: number | boolean;

  /**
   * Trim the separator character if decimal part is not exist.
   */
  trim?: boolean;
}

/**
 * Format the number to string with separator
 */
export default function formatNumber(
  value: number | string, 
  options?: FormatNumberOptions
){
  let _value = value.toString();

  const match = _value.match(/^(\d*\.?)\d*/);
  if (match) _value = match[0];

  const arr = _value.split('.');
  const exist = arr.length > 1;

  const [ _int, _dec ] = arr;
  if (_int.length < 4) return _value;

  const { comma, decimal = true, trim } = options ?? {};
  const separator = comma ? ',' : '.';
  let formatted;

  if (_int.length < 16){
    formatted = new Intl.NumberFormat(comma ? 'de-DE': 'en-EN').format(+_int);
  }
  else{
    formatted = Array.from(_int)
      .reverse()
      .map((char, index) => index % 3 === 2 ? `,${ char }` : char)
      .reverse()
      .join('')
      .replace(/^,/, '');

    if (comma) formatted = formatted.replace(/,/g, '.');
  }

  const trimDecimal = (decimal === false || decimal <= 0);
  const addDecimal = exist && !trimDecimal && (!trim || _dec.length);
  const decimalVal = _dec.substring(0, typeof decimal === 'number' ? decimal : undefined);

  formatted = [ formatted ].concat(addDecimal ? [ decimalVal ] : []).join(separator);
  return formatted;
}

/**
 * Revert the value formatted by `formatNumber` function.
 * - If length of the value out of number size, return value wrong.
 */
export function revertNumber(
  value: string, keepString = true
): typeof keepString extends true ? string : number{
  let val;

  if (value.match(/^\d+$/)) {
    val = value;
  }

  else if (value.match(/^\d{1,3}(,\d{3})*(\.\d*)?$/)){
    val = value.replace(/,/g, '');
  }

  else if (value.match(/^\d{1,3}(\.\d{3})*(,\d*)?$/)){
    val = value.replace(/\./g, '');
  }

  else{
    val = parseFloat(value);
  }

  if (!keepString){
    val = +val;
  }
  
  return val as typeof keepString extends true ? string : number;
}

formatNumber.revert = revertNumber;