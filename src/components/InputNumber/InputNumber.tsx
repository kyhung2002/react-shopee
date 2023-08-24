import { InputHTMLAttributes } from 'react'

export interface InputNumberType extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}
export default function InputNumber({
  type,
  errorMessage,
  className,
  classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
  classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
  onChange,
  ...rest
}: InputNumberType) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    // Kí tự là số hoặc value = ' '
    if ((/^\d+$/.test(value) || value === '') && onChange) {
      onChange(e)
    }
  }
  return (
    <div className={className}>
      <input type={type} className={classNameInput} {...rest} onChange={handleChange} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}
