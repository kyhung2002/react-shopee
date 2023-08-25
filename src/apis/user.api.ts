import { User } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'
export interface BodyUpdateProfile extends Pick<User, 'address' | 'date_of_birth' | 'name' | 'phone' | 'avatar'> {
  password?: string
  new_password?: string
}

const URL = 'user'
const userAPI = {
  getCurrentUser: () => http.get<SuccessResponse<User>>('me'),
  updateCurrentUser: (body: BodyUpdateProfile) => http.put(URL, body),
  uploadAvatar: (body: FormData) =>
    http.post<SuccessResponse<string>>(`${URL}/upload-avatar`, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
}
export default userAPI
