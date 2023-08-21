// eslint-disable-next-line import/no-unresolved

import { Category } from 'src/types/category.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = 'categories'
const categoryApi = {
  getCategory: () => http.get<SuccessResponse<Category[]>>(URL)
}
export default categoryApi
