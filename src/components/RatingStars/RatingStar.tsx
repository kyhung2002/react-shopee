import { createSearchParams, useNavigate } from 'react-router-dom'
import { GreyStar, YellowStar } from '../Star'
import path from 'src/constants/path'
import { QueryConfig } from 'src/pages/ProductList/ProductList'
interface IProps {
  queryConfig: QueryConfig
}
export default function RatingStar(props: IProps) {
  const navigate = useNavigate()
  const handleFilterStar = (star: number) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...props.queryConfig,
        rating_filter: star.toString()
      }).toString()
    })
  }
  return (
    <ul className='my-3'>
      {Array(5)
        .fill(0)
        .map((_, currentIndex) => (
          <li className='flex items-center py-1 pl-2' key={currentIndex}>
            <div
              className='flex items-center text-sm cursor-pointer'
              onClick={() => handleFilterStar(5 - currentIndex)}
              aria-hidden='true'
            >
              {Array(5)
                .fill(0)
                .map((_, index) => {
                  if (index < 5 - currentIndex) {
                    return <YellowStar key={index}></YellowStar>
                  }
                  return <GreyStar key={index}></GreyStar>
                })}
            </div>
            {currentIndex != 0 && <span className='block ml-2'>Trở lên</span>}
          </li>
        ))}
    </ul>
  )
}
