import { ProductListConfig, sortBy } from 'src/types/product.type'
import { QueryConfig } from '../ProductList'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import classNames from 'classnames'
import { omit } from 'lodash'
interface IProps {
  totalPage: number
  queryConfig: QueryConfig
}
export default function SortProductList({ totalPage, queryConfig }: IProps) {
  const navigate = useNavigate()
  const handleSwitchSort = (sortValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortValue
          },
          ['order', 'rating_filter']
        )
      ).toString()
    })
  }
  const handleSortPrice = (
    orderValue: Exclude<ProductListConfig['order'], undefined>,
    sortValue: Exclude<ProductListConfig['sort_by'], undefined>
  ) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortValue,
        order: orderValue
      }).toString()
    })
  }
  return (
    <div className='px-3 py-4 bg-gray-300/40'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <div>Sắp xếp theo</div>
          <button
            className={classNames(
              'h-8 px-4 text-sm text-center capitalize  text-black border border-1-black bg-white',
              {
                '!bg-orange  hover:bg-orange/80 text-white': sortBy.view == queryConfig.sort_by
              }
            )}
            onClick={() => handleSwitchSort(sortBy.view as Exclude<ProductListConfig['sort_by'], undefined>)}
          >
            Phổ biến
          </button>
          <button
            className={classNames(
              'h-8 px-4 text-sm text-center capitalize  text-black border border-1-black bg-white',
              {
                '!bg-orange  hover:bg-orange/80 text-white': sortBy.createdAt == queryConfig.sort_by
              }
            )}
            onClick={() => handleSwitchSort(sortBy.createdAt as Exclude<ProductListConfig['sort_by'], undefined>)}
          >
            Mới nhất
          </button>
          <button
            className={classNames(
              'h-8 px-4 text-sm text-center capitalize  text-black border border-1-black bg-white',
              {
                '!bg-orange  hover:bg-orange/80 text-white': sortBy.sold == queryConfig.sort_by
              }
            )}
            onClick={() => handleSwitchSort(sortBy.sold as Exclude<ProductListConfig['sort_by'], undefined>)}
          >
            Bán chạy
          </button>
          <select
            className={classNames(
              'h-8 px-4 text-sm text-center capitalize  text-black border border-1-black bg-white',
              {
                '!bg-orange  hover:bg-orange/80 text-white': sortBy.price == queryConfig.sort_by
              }
            )}
            value={queryConfig.order || ''}
            onChange={(e) =>
              handleSortPrice(
                e.target.value as Exclude<ProductListConfig['order'], undefined>,
                sortBy.price as Exclude<ProductListConfig['sort_by'], undefined>
              )
            }
          >
            <option value='' disabled className='text-black bg-white'>
              Giá
            </option>
            <option value='asc' className='text-black bg-white'>
              Giá: Thấp đến cao
            </option>
            <option value='desc' className='text-black bg-white'>
              Giá: Cao đến thấp
            </option>
          </select>
        </div>

        <div className='flex items-center'>
          <div>
            <span className='text-orange'>1</span>
            <span>/2</span>
          </div>
          <div className='ml-2'>
            <button className='h-8 px-3 rounded-tl-sm rounded-bl-sm shadow cursor-not-allowed bg-white/60 hover:bg-slate-100'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-3 h-3'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
              </svg>
            </button>
            <button className='h-8 px-3 bg-white rounded-tr-sm rounded-br-sm shadow hover:bg-slate-100 '>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-3 h-3'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
