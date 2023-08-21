import { useQuery } from '@tanstack/react-query'
import AsideFilter from './AsideFilter'
import Product from './Product/Product'
import SortProductList from './SortProductList'
import useParamsVariables from 'src/hooks/useParams'
import productApi from 'src/apis/product.api'
import Pagination from 'src/components/Pagination/Pagination'
import { ProductListConfig, sortBy } from 'src/types/product.type'
import { isUndefined, omitBy } from 'lodash'
import categoryApi from 'src/apis/category.api'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}
export default function ProductList() {
  const queryParams: QueryConfig = useParamsVariables()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      exclude: queryParams.exclude,
      limit: queryParams.limit || '10',
      name: queryParams.name,
      order: queryParams.order,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      rating_filter: queryParams.rating_filter,
      sort_by: queryParams.sort_by || sortBy.createdAt,
      category: queryParams.category
    },
    isUndefined
  )
  const { data } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProduct(queryConfig as ProductListConfig)
    },
    keepPreviousData: true
  })
  const { data: categoryData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getCategory
  })
  console.log(categoryData)
  return (
    <div className='py-6 bg-gray-200'>
      <div className='container'>
        {data && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              {categoryData && <AsideFilter categories={categoryData.data.data} queryConfig={queryConfig} />}
            </div>
            <div className='col-span-9'>
              <SortProductList queryConfig={queryConfig} totalPage={data.data.data.pagination.page_size} />
              <div className='grid grid-cols-2 gap-3 mt-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {data &&
                  data.data.data.products.map((item, index) => (
                    <div className='col-span-1' key={index}>
                      <Product {...item} />
                    </div>
                  ))}
              </div>
              <div className='flex justify-center my-10'>
                <Pagination queryConfig={queryConfig} totalPage={data.data.data.pagination.page_size} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
