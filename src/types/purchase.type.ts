import { IProduct } from './product.type'
import { User } from './user.type'

export interface AddToCartBody {
  product_id: string
  buy_count: number
}
export type PurchaseStatus = -1 | 1 | 2 | 3 | 4 | 5
export type PurchaseListStatus = PurchaseStatus | 0
export type Purchase = {
  _id: string
  buy_count: number
  price: number
  price_before_discount: string
  status: number
  user: User
  product: IProduct
  createdAt: string
  updatedAt: string
}
export interface ExtendedPurchases extends Purchase {
  disabled: boolean
  checked: boolean
}
