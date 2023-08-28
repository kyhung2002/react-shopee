import axios, { AxiosError } from 'axios'
import { config } from 'src/config'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  // eslint-disable-next-line import/no-named-as-default-member
  return axios.isAxiosError(error)
}

export function isAxiosEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export function formatCurrencyVND(price: number) {
  return price.toLocaleString('vi', { style: 'currency', currency: 'VND' })
}

export function formatSocial(number: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(number)
    .replace('.', ',')
    .toLowerCase()
}

export const removeSpecialCharacter = (str: string) =>
  // Remove special String
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

export const generateURL = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i-${id}`
}
export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i-')
  // -> [name , id]
  // get last string
  return arr[arr.length - 1]
}
export const countTotalEachProduct = (count: number, price: number) => {
  return price * count
}

export const generateConfigAvatar = (avatarName: string) => {
  return avatarName ? `${config.URL}images/${avatarName}` : 'vite.svg'
}
