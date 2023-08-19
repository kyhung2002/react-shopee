import { User } from 'src/types/user.type'

export const saveAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}
export const clearTokenFromLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
}
export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''

export const saveProfileToLS = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user))
}
export const getProfile = () => {
  const result = localStorage.getItem('user')
  return result ? JSON.parse(result) : null
}
