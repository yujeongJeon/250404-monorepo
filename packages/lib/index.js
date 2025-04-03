import isFunction from '@naverpay/hidash/isFunction'
import isNull from '@naverpay/hidash/isNull'
import isPlainObject from '@naverpay/hidash/isPlainObject'
import isString from '@naverpay/hidash/isString'

export const isPositiveNum = (num) => !!num && num > 0

export const numberFilter = (str) => (isString(str) ? str.replace(/[^0-9]/g, '') : '')

export const isValidObject = (value) => isPlainObject(value) && !isNull(isPlainObject)

export const isValidEvent = (value) => isFunction(value)
