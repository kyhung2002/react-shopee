import classNames from 'classnames'
import { Link, createSearchParams } from 'react-router-dom'
import path from 'src/constants/path'
import { QueryConfig } from 'src/pages/ProductList/ProductList'

interface IProps {
  totalPage: number
  queryConfig: QueryConfig
}
const RANGE = 2
const Pagination = ({ queryConfig, totalPage }: IProps) => {
  const page = Number(queryConfig.page)
  let dotAfter = false
  let dotBefore = false
  function renderDotAfter(index: number) {
    if (!dotAfter) {
      dotAfter = true
      return (
        <span key={index} className='px-3 py-2 mx-2 bg-white border rounded shadow-sm cursor-pointer'>
          ...
        </span>
      )
    }
  }
  function renderDotBefore(index: number) {
    if (!dotBefore) {
      dotBefore = true
      return (
        <span key={index} className='px-3 py-2 mx-2 bg-white border rounded shadow-sm cursor-pointer'>
          ...
        </span>
      )
    }
  }
  return Array(totalPage)
    .fill(0)
    .map((_, index) => {
      const pageNumber = index + 1
      if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber <= totalPage - RANGE) {
        return renderDotAfter(index)
      } else if (page > RANGE * 2 + 1 && page < totalPage - RANGE * 2) {
        if (pageNumber < page - RANGE && pageNumber > RANGE) {
          return renderDotBefore(index)
        } else if (pageNumber > page + RANGE && pageNumber < totalPage - RANGE + 1) {
          return renderDotAfter(index)
        }
      } else if (page >= totalPage - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
        return renderDotBefore(index)
      }
      return (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: pageNumber.toString()
            }).toString()
          }}
          key={index}
          className={classNames('px-3 py-2 mx-2 bg-white border rounded shadow-sm cursor-pointer', {
            'border-red-500': pageNumber == page
          })}
        >
          {pageNumber}
        </Link>
      )
    })
}

export default Pagination
