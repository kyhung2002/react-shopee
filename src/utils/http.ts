import axios, { AxiosError, AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import { clearTokenFromLS, getAccessTokenFromLS, saveAccessTokenToLS, saveProfileToLS } from './auth'
import { AuthResponse } from 'src/types/auth.type'

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    ;(this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 1000,
      headers: {
        'Content-Type': 'application/json'
      }
    })),
      this.instance.interceptors.request.use(
        (config) => {
          if (this.accessToken && config.headers) {
            config.headers.authorization = this.accessToken
          }
          return config
        },
        (error) => {
          return Promise.reject(error)
        }
      ),
      this.instance.interceptors.response.use(
        (response) => {
          const { url } = response.config
          if (url == 'login' || url == 'register') {
            const data = response.data as AuthResponse
            this.accessToken = data.data.access_token
            saveAccessTokenToLS(this.accessToken)
            saveProfileToLS(data.data.user)
          } else if (url == '/logout') {
            this.accessToken = ''
            clearTokenFromLS()
          }
          return response
        },
        function (error: AxiosError) {
          if (error.response?.status != HttpStatusCode.UnprocessableEntity) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any | undefined = error.response?.data
            const message = data.message || error.message
            toast.error(message)
          }
        }
      )
  }
}
const http = new Http().instance
export default http