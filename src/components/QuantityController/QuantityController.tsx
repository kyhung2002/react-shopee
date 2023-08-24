import InputNumber from '../InputNumber'
import { InputNumberType } from '../InputNumber/InputNumber'
interface IProps extends InputNumberType {
  max?: number
  onDecrease?: (value: number) => void
  onIncrease?: (value: number) => void
  onType?: (value: number) => void
  onFocusOut?: (value: number) => void
  value: number
  classNameWrapper?: string
}
export default function QuantityController({
  classNameWrapper = ' ml-10',
  value,
  max,
  onDecrease,
  onIncrease,
  onType,
  onFocusOut
}: IProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(e.target.value)
    if (max && _value >= max) {
      _value = max
    } else if (_value < 1) _value = 1
    onType && onType(_value)
  }
  const handleIncrease = () => {
    if (max && value >= max) {
      value = max
    } else {
      value++
    }
    onIncrease && onIncrease(value)
  }

  const handleDecrease = () => {
    if (value < 1) {
      value == 1
    } else {
      value--
    }
    onDecrease && onDecrease(value)
  }
  const handleFocusOut = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    const _value = Number(e.target.value)
    onFocusOut && onFocusOut(_value)
  }
  return (
    <div className={`flex items-center ${classNameWrapper}`}>
      <button
        className='flex items-center justify-center w-8 h-8 text-gray-600 border border-gray-300 rounded-l-sm'
        onClick={() => handleDecrease()}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-4 h-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15' />
        </svg>
      </button>
      <InputNumber
        className=''
        classNameError='hidden'
        value={value}
        classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
        onChange={(e) => handleChange(e)}
        onBlur={handleFocusOut}
      />
      <button
        className='flex items-center justify-center w-8 h-8 text-gray-600 border border-gray-300 rounded-r-sm'
        onClick={() => handleIncrease()}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-4 h-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
        </svg>
      </button>
    </div>
  )
}
