import { Link } from 'react-router-dom'
import ProductRating from 'src/components/ProductRating'
import { IProduct } from 'src/types/product.type'
import { formatCurrencyVND, formatSocial } from 'src/utils/utils'

export default function Product(props: IProduct) {
  return (
    <Link to='/'>
      <div className='bg-white shadow rounded-sm hover:translate-y-[-0.04rem] hover:shadow-md duration-100 transition-transform overflow-hidden'>
        <div className='w-full pt-[100%] relative'>
          <img
            src={props.image}
            alt={props.name}
            className='absolute top-0 left-0 object-cover w-full h-full bg-white'
          />
        </div>
        <div className='p-2 overflow-hidden'>
          <div className='min-h-[2rem] line-clamp-2 text-xs'>{props.name}</div>
          <div className='flex items-center mt-3'>
            <div className='line-through max-w-[50%] text-gray-500 truncate text-sm'>
              <span className='text-xs'>₫</span>
              <span>{props.price_before_discount}</span>
            </div>
            <div className='ml-1 text-sm truncate text-orange'>
              <span className='text-xs'>₫</span>
              <span>{formatCurrencyVND(props.price)}</span>
            </div>
          </div>
          <div className='flex items-center justify-end mt-3'>
            <div className='flex items-center'>
              <ProductRating rating={props.rating}></ProductRating>
            </div>
            <div className='ml-2 text-sm'>
              <span>{formatSocial(props.sold)}</span>
              <span className='ml-1'>Đã bán</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
