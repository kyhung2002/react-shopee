import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import purchaseApi from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import { toast } from 'react-toastify'
import { status } from 'src/constants/purchaseStatus'
import { ExtendedPurchases, Purchase } from 'src/types/purchase.type'
import { countTotalEachProduct, formatCurrencyVND, generateURL } from 'src/utils/utils'
import { keyBy } from 'lodash'
import purchaseAPI from 'src/apis/purchase.api'
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
import { AppContext } from 'src/contexts/app.context'

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})
export default function Cart() {
  const client = useQueryClient()

  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)
  const { data, refetch } = useQuery({
    queryKey: ['purchase', { status: status.inCart }],
    queryFn: (_) => purchaseApi.getPurchase({ status: status.inCart })
  })
  const location = useLocation()?.state?.purchaseId

  const PurchaseMutation = useMutation({
    mutationFn: (body: { product_id: string; buy_count: number }) => purchaseApi.updatePurchase(body),
    onSuccess: () => {
      toast.success('success'), refetch()
    }
  })

  const [isCheckAll, setIsCheckAll] = useState<boolean>(false)
  // Có thể thay thế bằng immerJS
  const handleChecked = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      extendedPurchases.map((item) => {
        if (item._id === extendedPurchases[index]._id) return { ...item, checked: e.target.checked }
        return item
      })
    )
  }
  const handleChangeQuantity = (index: number, value: number, enable: boolean) => {
    if (enable) {
      const currentPurchase = extendedPurchases[index]
      PurchaseMutation.mutate({ product_id: currentPurchase.product._id, buy_count: value })
    }
  }
  const handleTypeChange = (index: number) => (value: number) => {
    setExtendedPurchases(
      extendedPurchases.map((item) => {
        if (item._id === extendedPurchases[index]._id) {
          item.buy_count = value
        }
        return item
      })
    )
  }
  const handleCheckedAll = () => {
    setIsCheckAll(!isCheckAll)
    if (isCheckAll) {
      setExtendedPurchases(
        extendedPurchases.map((item) => {
          return { ...item, checked: false }
        })
      )
    } else {
      setExtendedPurchases(
        extendedPurchases.map((item) => {
          return { ...item, checked: true }
        })
      )
    }
  }
  const products = data?.data.data
  useEffect(() => {
    setExtendedPurchases((prev) => {
      const cloneArray = keyBy(prev, '_id')
      return (
        products?.map((item) => {
          const historyItem = item._id === location
          return {
            ...item,
            disabled: false,
            checked: historyItem || Boolean(cloneArray[item._id]?.checked)
          }
        }) || []
      )
    })
  }, [products, location, setExtendedPurchases])
  const totalCount = useMemo(
    () =>
      extendedPurchases.reduce((totalCount, currentValue) => {
        totalCount += countTotalEachProduct(currentValue.buy_count, currentValue.price)
        return totalCount
      }, 0),
    [extendedPurchases]
  )
  const DeleteItemMutation = useMutation({
    mutationFn: (ids: string[]) => purchaseAPI.deletePurchase(ids),
    onSuccess: () => {
      refetch()
      client.invalidateQueries(['cart', { status: status.inCart }])
    }
  })
  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])
  const handleDeleteSingle = (ids: string) => {
    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      })
      .then((result) => {
        if (result.isConfirmed) {
          DeleteItemMutation.mutate([ids], {
            onSuccess: () => {
              swalWithBootstrapButtons.fire('Deleted!', 'Your option has been deleted.', 'success')
            }
          })
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire('Cancelled', 'Your option  is safe :)', 'error')
        }
      })
  }
  const handleDeleteAll = () => {
    const arrayIDs: string[] = []
    extendedPurchases.forEach((item) => {
      if (item.checked) arrayIDs.push(item._id)
    })
    if (arrayIDs.length > 0) {
      DeleteItemMutation.mutate(arrayIDs, {
        onSuccess: () => {
          console.log('delete all success')
          setIsCheckAll(!isCheckAll)
        }
      })
    }
  }
  if (!products) return null

  return products.length > 0 ? (
    <div className='py-16 bg-neutral-100'>
      <div className='container'>
        <div className='overflow-auto'>
          <div className='min-w-[1000px]'>
            <div className='grid grid-cols-12 py-5 text-sm text-gray-500 capitalize bg-white rounded-sm shadow px-9'>
              <div className='col-span-6'>
                <div className='flex items-center'>
                  <div className='flex items-center justify-center flex-shrink-0 pr-3'>
                    <input
                      type='checkbox'
                      className='w-5 h-5 accent-orange'
                      checked={isCheckAll}
                      onChange={handleCheckedAll}
                    />
                  </div>
                  <div className='flex-grow text-black'>Sản phẩm</div>
                </div>
              </div>
              <div className='col-span-6'>
                <div className='grid grid-cols-5 text-center'>
                  <div className='col-span-2'>Đơn giá</div>
                  <div className='col-span-1'>Số lượng</div>
                  <div className='col-span-1'>Số tiền</div>
                  <div className='col-span-1'>Thao tác</div>
                </div>
              </div>
            </div>
            <div className='p-5 my-3 bg-white rounded-sm shadow'>
              {extendedPurchases.map((item, index) => (
                <div
                  key={item._id}
                  className='grid grid-cols-12 px-4 py-5 mb-5 text-sm text-center text-gray-500 bg-white border border-gray-200 rounded-sm first:mt-0'
                >
                  <div className='col-span-6'>
                    <div className='flex'>
                      <div className='flex items-center justify-center flex-shrink-0 pr-3'>
                        <input
                          type='checkbox'
                          onChange={handleChecked(index)}
                          checked={item.checked}
                          className='w-5 h-5 accent-orange'
                        />
                      </div>
                      <div className='flex-grow'>
                        <div className='flex'>
                          <Link className='flex-shrink-0 w-20 h-20' to=''>
                            <img alt={item.product.name} src={item.product.image} />
                          </Link>
                          <div className='flex-grow px-2 pt-1 pb-2'>
                            <Link
                              to={{
                                pathname: `${path.home}${generateURL({
                                  name: item.product.name,
                                  id: item.product._id
                                })}`
                              }}
                              className='line-clamp-2'
                            >
                              {item.product.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid items-center grid-cols-5'>
                      <div className='col-span-2'>
                        <div className='flex items-center justify-center'>
                          <span className='text-gray-300 line-through'>
                            ₫{formatCurrencyVND(item.product.price_before_discount)}
                          </span>
                          <span className='ml-3'> ₫{formatCurrencyVND(item.product.price)}</span>
                        </div>
                      </div>
                      <div className='col-span-1'>
                        <QuantityController
                          max={item.product.quantity}
                          value={Number(item.buy_count)}
                          classNameWrapper='flex items-center'
                          onDecrease={(value) => handleChangeQuantity(index, value, value >= 1)}
                          onIncrease={(value) => handleChangeQuantity(index, value, value < item.product.quantity)}
                          onType={handleTypeChange(index)}
                          onFocusOut={(value) => {
                            console.log(value, products[index].buy_count)
                            handleChangeQuantity(
                              index,
                              value,
                              value >= 1 && value < item.product.quantity && value != products[index].buy_count
                            )
                          }}
                        />
                      </div>
                      <div className='col-span-1'>
                        <span className='text-orange'>
                          {formatCurrencyVND(countTotalEachProduct(Number(item.buy_count), Number(item.price)))}
                        </span>
                      </div>
                      <div className='col-span-1'>
                        <button
                          className='text-black transition-colors bg-none hover:text-orange'
                          onClick={() => handleDeleteSingle(item._id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='sticky bottom-0 z-10 flex flex-col p-5 mt-8 bg-white border border-gray-100 rounded-sm shadow sm:flex-row sm:items-center'>
          <div className='flex items-center'>
            <div className='flex items-center justify-center flex-shrink-0 pr-3'>
              <input
                type='checkbox'
                className='w-5 h-5 accent-orange'
                checked={isCheckAll}
                onChange={handleCheckedAll}
              />
            </div>
            <button className='mx-3 border-none bg-none'>Chọn tất cả ({extendedPurchases.length})</button>
            <button className='mx-3 border-none bg-none' onClick={handleDeleteAll}>
              Xóa
            </button>
          </div>

          <div className='flex flex-col mt-5 sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
            <div>
              <div className='flex items-center sm:justify-end'>
                <div>Tổng thanh toán (0 sản phẩm):</div>
                <div className='ml-2 text-2xl text-orange'>₫{formatCurrencyVND(totalCount)}</div>
              </div>
              <div className='flex items-center text-sm sm:justify-end'>
                <div className='text-gray-500'>Tiết kiệm</div>
                <div className='ml-6 text-orange'>₫138000</div>
              </div>
            </div>
            <Button className='flex items-center justify-center h-10 mt-5 text-sm text-white uppercase bg-red-500 w-52 hover:bg-red-600 sm:ml-4 sm:mt-0'>
              Mua hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center p-10 mt-10 text-white bg-red-500'>
      Không có gì trong giỏ hàng
    </div>
  )
}
