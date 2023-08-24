import { User } from 'src/types/user.type'

export const EvenTargetLocalStorage = new EventTarget()
export const saveAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}
export const clearTokenFromLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
  const event = new Event('localStorage')
  EvenTargetLocalStorage.dispatchEvent(event)
}
export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''

export const saveProfileToLS = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user))
}
export const getProfile = () => {
  const result = localStorage.getItem('user')
  return result ? JSON.parse(result) : null
}
