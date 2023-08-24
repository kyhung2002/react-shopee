import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import productApi from 'src/apis/product.api'
import purchaseAPI from 'src/apis/purchase.api'
import ProductRating from 'src/components/ProductRating'
import QuantityController from 'src/components/QuantityController'
import { status } from 'src/constants/purchaseStatus'
import { formatCurrencyVND, getIdFromNameId } from 'src/utils/utils'

export default function ProductDetail() {
  const queryClient = useQueryClient()
  const { id } = useParams()
  const currentId = getIdFromNameId(id as string)
  const [value, setValue] = useState(1)
  const handleChangeValue = (value: number) => {
    value && setValue(value)
  }
  const { data } = useQuery({
    queryKey: ['product', currentId],
    queryFn: (_) => productApi.getProductDetail(currentId as string),
    onSuccess: (data) => console.log(data)
  })
  const navigate = useNavigate()
  const addToCartMutation = useMutation({
    mutationFn: (body: { product_id: string; buy_count: number }) => purchaseAPI.addToCart(body),
    onSuccess: () => {
      toast.success('Them san pham thanh cong', { autoClose: 1000 })
      queryClient.invalidateQueries({ queryKey: ['cart', { status: status.inCart }] })
    }
  })
  const product = data?.data.data
  if (!product) return null
  const handleAddItem = () => {
    addToCartMutation.mutate({ buy_count: value, product_id: product._id })
  }
  const handleBuyNow = (body: { product_id: string; buy_count: number }) => {
    addToCartMutation.mutate(body, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['cart', { status: status.inCart }] })
        navigate('/cart', {
          state: {
            purchaseId: data.data.data._id
          }
        })
      }
    })
  }
  return (
    <div className='py-6 bg-gray-200'>
      <div className='p-4 bg-white shadow'>
        <div className='container'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div className='relative w-full pt-[100%] shadow'>
                <img
                  src={product.image}
                  alt={product.name}
                  className='absolute top-0 left-0 object-cover w-full h-full bg-white'
                />
              </div>
              <div className='relative grid grid-cols-5 gap-1 mt-4'>
                <button className='absolute left-0 z-10 w-5 text-white -translate-y-1/2 top-1/2 h-9 bg-black/20'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-5 h-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                  </svg>
                </button>
                {product.images.slice(0, 5).map((img, index) => {
                  const isActive = index === 0
                  return (
                    <div className='relative w-full pt-[100%]' key={img}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className='absolute top-0 left-0 object-cover w-full h-full bg-white cursor-pointer'
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-orange' />}
                    </div>
                  )
                })}
                <button className='absolute right-0 z-10 w-5 text-white -translate-y-1/2 top-1/2 h-9 bg-black/20'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-5 h-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              <div className='flex items-center mt-8'>
                <div className='flex items-center'>
                  <span className='mr-1 border-b border-b-orange text-orange'>{product.rating}</span>
                  <ProductRating rating={product.rating} />
                </div>
                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                <div>
                  <span>{product.sold}</span>
                  <span className='ml-1 text-gray-500'>Đã bán</span>
                </div>
              </div>
              <div className='flex items-center px-5 py-4 mt-8 bg-gray-50'>
                <div className='text-gray-500 line-through'>₫{product.price_before_discount}</div>
                <div className='ml-3 text-3xl font-medium text-orange'>₫{formatCurrencyVND(product.price)}</div>
                <div className='ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white'>
                  {Math.floor(((product.price_before_discount - product.price) / product.price_before_discount) * 100) +
                    '%'}
                </div>
              </div>
              <div className='flex items-center mt-8'>
                <div className='text-gray-500 capitalize'>Số lượng</div>
                <QuantityController
                  max={12}
                  value={value}
                  onDecrease={handleChangeValue}
                  onType={handleChangeValue}
                  onIncrease={handleChangeValue}
                ></QuantityController>
                <div className='ml-6 text-sm text-gray-500'>{product.quantity} sản phẩm có sẵn</div>
              </div>
              <div className='flex items-center mt-8'>
                <button
                  className='flex items-center justify-center h-12 px-5 capitalize border rounded-sm shadow-sm border-orange bg-orange/10 text-orange hover:bg-orange/5'
                  onClick={handleAddItem}
                >
                  <svg
                    enableBackground='new 0 0 15 15'
                    viewBox='0 0 15 15'
                    x={0}
                    y={0}
                    className='mr-[10px] h-5 w-5 fill-current stroke-orange text-orange'
                  >
                    <g>
                      <g>
                        <polyline
                          fill='none'
                          points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeMiterlimit={10}
                        />
                        <circle cx={6} cy='13.5' r={1} stroke='none' />
                        <circle cx='11.5' cy='13.5' r={1} stroke='none' />
                      </g>
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1='7.5' x2='10.5' y1={7} y2={7} />
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1={9} x2={9} y1='8.5' y2='5.5' />
                    </g>
                  </svg>
                  Thêm vào giỏ hàng
                </button>
                <button
                  className='fkex ml-4 h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90'
                  type='button'
                  onClick={() => handleBuyNow({ product_id: product._id, buy_count: value })}
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='p-4 mt-8 bg-white shadow'>
        <div className='container'>
          <div className='p-4 text-lg capitalize rounded bg-gray-50 text-slate-700'>Mô tả sản phẩm</div>
          <div className='mx-4 mt-12 mb-4 text-sm leading-loose'>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
