import isFunction from '@naverpay/hidash/isFunction'
import isNull from '@naverpay/hidash/isNull'
import isPlainObject from '@naverpay/hidash/isPlainObject'
import isString from '@naverpay/hidash/isString'

export const isPositiveNum = (num: number) => !!num && num > 0

export const numberFilter = (str: string) => (isString(str) ? str.replace(/[^0-9]/g, '') : '')

export const isValidObject = (value: unknown): value is Object => isPlainObject(value) && !isNull(isPlainObject)

export const isValidEvent = (value: unknown): value is Function => isFunction(value)
