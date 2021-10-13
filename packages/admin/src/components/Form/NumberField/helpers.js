function toggleNegative(value, abs) {
  const isNegative = (value.match(/\-/g) || []).length % 2
  const negative = !abs && isNegative ? '-' : ''
  value = value.replaceAll('-', '')
  value = value.replace(new RegExp('^0+', 'g'), '')
  return negative + value
}

function fixDecimal(value, decimal, decimals, cursor) {
  if (!decimals) {
    return value.replaceAll(decimal, '')
  }

  cursor = cursor || value.lastIndexOf(decimal)
  //if more than one decimal, then make it only one
  const allDecimals = new RegExp(`\\${decimal}`, 'g')
  if ((value.match(allDecimals) || []).length > 1) {
    //split up the text from where the cursor is
    value = [
      value.substring(0, cursor).replaceAll(decimal, ''), 
      value.substring(cursor + 1).replaceAll(decimal, '')
    ].join(decimal)
  }

  //if more decimals than allowed
  if ((value.split(decimal)[1] || '').length > decimals) {
    //remove the number before the cursor
    value = value.substring(0, value.length - 1)
  }

  return value
}

function between(value, min, max) {
  if (!isNaN(min) && parseFloat(value) < min) value = String(min)
  if (!isNaN(max) && parseFloat(value) > max) value = String(max)
  return value
}

function padDecimals(value, decimal, decimals) {
  if (!decimals || !value.length) {
    return value
  }

  //if the decimal is the last (with no number)
  if (value[value.length - 1] === decimal) {
    //remove it
    value = value.substr(0, value.length - 1)
  }
  //if no decimals
  const allDecimals = new RegExp(`\\${decimal}`, 'g')
  if (!(value.match(allDecimals) || []).length) {
    value += decimal + '0'.repeat(decimals)
  } 
  //if the first one is a positive decimal
  if (value[0] === decimal) {
    value = '0' + value
  }
  //if the first one is a negative decimal
  if (value.indexOf(`-${decimal}`) === 0) {
    value = '-0.' + value.substr(decimal.length + 1)
  }

  value += '0'.repeat(decimals - value.split(decimal)[1].length)

  return value
}

function prettify(value, separator, decimal) {
  const placeCommas = new RegExp(
    `\\B(?<!\\${separator}\\d*)(?=(\\d{3})+(?!\\d))`, 'g'
  )

  //Separate thousands
  if (separator) {
    if (value.indexOf(decimal) !== -1) {
      let [numerator, denominator] = value.split(decimal)
      numerator = numerator.replace(placeCommas, separator)
      value = [numerator, denominator].join(decimal)
    } else {
      value = value.replace(placeCommas, separator)
    }
  }

  return value
}

function getFormats(value, options) {
  //expand options
  const {
    min,     max,      separator, 
    decimal, decimals, abs, 
    cursor = 0
  } = options

  const dec = decimal || '.'
  //1. Remove any non number related
  const notNumberRelated = new RegExp(`[^0-9\-\\${dec}]`, 'g')
  let formatted = value.replace(notNumberRelated, '')
  //2. Toggle negatives
  formatted = toggleNegative(formatted, abs)
  //3. Format decimals
  formatted = fixDecimal(formatted, dec, decimals, cursor)
  //4. consider min max
  formatted = between(formatted, min, max)

  return {
    value: padDecimals(formatted, dec, decimals),
    display: prettify(formatted, separator, decimal)
  }
}

function getFormatsFromInput(input, options) {
  options.cursor = input.selectionStart - 1
  return getFormats(input.value, options)
}

export { getFormatsFromInput, getFormats, padDecimals }