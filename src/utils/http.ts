import axios, { AxiosError, type AxiosInstance } from 'axios'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import { toast } from 'react-toastify'
import { AuthResponse } from 'src/types/auth.type'
import { getAccessTokenFromLS, saveAccessTokenToLS, saveProfileToLS, clearTokenFromLS } from './auth'
import path from 'src/constants/path'
import { config } from 'src/config'

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.instance = axios.create({
      baseURL: config.URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = this.accessToken
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === 'login' || url === 'register') {
          const data = response.data as AuthResponse
          this.accessToken = data.data.access_token
          saveAccessTokenToLS(this.accessToken)
          saveProfileToLS(data.data.user)
        } else if (url === path.logout) {
          this.accessToken = ''
          clearTokenFromLS()
        }
        return response
      },
      function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          toast.error(message)
        }
        if (error?.response?.status === HttpStatusCode.Unauthorized) {
          clearTokenFromLS()
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
