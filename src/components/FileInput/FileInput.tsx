import React from 'react'
import { useFormContext } from 'react-hook-form'
interface IProps {
  onChange?: (file?: File) => void
}
export default function FileInput({ onChange }: IProps) {
  const { setError } = useFormContext()
  const handleChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = e.target.files?.[0]
    if (fileFromLocal && fileFromLocal.type != 'image/png' && fileFromLocal.size >= 1000000) {
      setError('avatar', { message: 'Ảnh đưa vào không hợp lệ' })
    } else {
      setError('avatar', { message: '' })
      fileFromLocal && onChange && onChange(fileFromLocal)
    }
  }
  return (
    <label htmlFor='image' className='cursor-pointer'>
      <input
        className='hidden'
        type='file'
        accept='.jpg,.jpeg,.png'
        id='image'
        name='avatar'
        onChange={handleChangeAvatar}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick={(e) => ((e.target as any).value = null)}
      />
      <div className='flex items-center justify-end h-10 px-6 text-sm text-gray-600 bg-white border rounded-sm shadow-sm'>
        Chọn ảnh
      </div>
    </label>
  )
}
