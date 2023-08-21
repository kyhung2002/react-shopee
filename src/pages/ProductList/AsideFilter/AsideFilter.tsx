import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import path from 'src/constants/path'
import { Category } from 'src/types/category.type'

import { QueryConfig } from '../ProductList'
import classNames from 'classnames'
import InputNumber from 'src/components/InputNumber'
import { useForm, Controller } from 'react-hook-form'
import RatingStar from 'src/components/RatingStars'
import { omit } from 'lodash'
interface IProp {
  categories: Category[]
  queryConfig: QueryConfig
}
type FormData = {
  price_min: string
  price_max: string
}
export default function AsideFilter(props: IProp) {
  const { categories, queryConfig } = props
  const navigate = useNavigate()
  const { control, watch } = useForm<FormData>({
    defaultValues: {
      price_max: '',
      price_min: ''
    }
  })
  const valueForm = watch()
  const handleRemoveFilter = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['rating_filter', 'price_max', 'price_min', 'category'])).toString()
    })
  }
  return (
    <div className='py-4'>
      <Link to={path.home} className='flex items-center font-bold'>
        <svg viewBox='0 0 12 10' className='w-3 h-4 mr-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        Tất cả danh mục
      </Link>
      <div className='bg-gray-300 h-[1px] my-4' />
      <ul>
        {categories.map((item, index) => (
          <li className='py-2 pl-2' key={item._id}>
            <Link
              to={{
                pathname: path.home,
                search: createSearchParams({
                  ...queryConfig,
                  category: item._id
                }).toString()
              }}
              className={classNames('relative px-2', {
                'font-semibold text-orange': queryConfig.category == item._id
              })}
            >
              {queryConfig.category == item._id && (
                <svg viewBox='0 0 4 7' className='fill-orange h-2 w-2 absolute top-1 left-[-10px]'>
                  <polygon points='4 3.5 0 0 0 7' />
                </svg>
              )}
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
      <Link to={path.home} className='flex items-center mt-4 font-bold uppercase'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='w-3 h-4 mr-3 fill-current stroke-current'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        Bộ lọc tìm kiếm
      </Link>
      <div className='bg-gray-300 h-[1px] my-4' />
      <div className='my-5'>
        <div>Khoản giá</div>
        <form className='mt-2'>
          <div className='flex items-start'>
            <Controller
              name='price_min'
              control={control}
              render={({ field }) => (
                <InputNumber
                  type='text'
                  className='grow'
                  name='from'
                  placeholder='₫ TỪ'
                  classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
            <div className='mx-2 mt-2 shrink-0'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => (
                <InputNumber
                  type='text'
                  className='grow'
                  name='from'
                  placeholder='₫ ĐẾN'
                  classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
          </div>
          <Button className='flex items-center justify-center w-full p-2 text-sm text-white uppercase bg-orange hover:bg-orange/80'>
            Áp dụng
          </Button>
        </form>
      </div>
      <div className='bg-gray-300 h-[1px] my-4' />
      <div className='text-sm'>Đánh giá</div>
      <RatingStar queryConfig={queryConfig}></RatingStar>
      <div className='bg-gray-300 h-[1px] my-4' />
      <Button
        className='flex items-center justify-center w-full p-2 text-sm text-white uppercase bg-orange hover:bg-orange/80'
        onClick={handleRemoveFilter}
      >
        Xóa tất cả
      </Button>
    </div>
  )
}
