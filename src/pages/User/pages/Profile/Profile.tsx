import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { UserSchema, userSchema } from 'src/utils/rules'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import userAPI, { BodyUpdateProfile } from 'src/apis/user.api'
import InputNumber from 'src/components/InputNumber'
import { useContext, useEffect } from 'react'
import DateSelect from '../../components/DateSelect'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'
import { saveProfileToLS } from 'src/utils/auth'
type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'avatar' | 'date_of_birth'>

const profileSchema = userSchema.pick(['name', 'address', 'phone', 'avatar', 'date_of_birth'])
export default function Profile() {
  const { profile: mainProfile, setProfile } = useContext(AppContext)
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userAPI.getCurrentUser
  })
  const profile = profileData?.data.data
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    setValue,
    setError,
    watch
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })
  const queryClient = useQueryClient()
  const updateMutation = useMutation({
    mutationFn: userAPI.updateCurrentUser,
    onSuccess: (data) => {
      toast.success('Cập nhật thành công !')
      setProfile((prev) => ({ ...prev, ...data.data.data }))
      saveProfileToLS({ ...mainProfile, ...data.data.data })
      refetch()
    }
  })
  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('address', profile.address)
      setValue('avatar', profile.avatar)
      setValue('phone', profile.phone)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])
  const onSubmit = handleSubmit((value) => {
    if (value) {
      updateMutation.mutate({
        ...value,
        date_of_birth: (value.date_of_birth as unknown as Date).toISOString()
      })
    }
  })
  console.log(errors)
  return (
    <div className='px-2 pb-10 bg-white rounded-sm shadow md:px-7 md:pb-20'>
      <div className='py-6 border-b border-b-gray-200'>
        <h1 className='text-lg font-medium text-gray-900 capitalize'>Hồ Sơ Của Tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form className='flex flex-col-reverse mt-8 md:flex-row md:items-start' onSubmit={onSubmit}>
        <div className='flex-grow mt-6 md:mt-0 md:pr-12'>
          <div className='flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Email</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <div className='pt-3 text-gray-700'>{profile?.email}</div>
            </div>
          </div>
          <div className='flex flex-col flex-wrap mt-6 sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Tên</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='name'
                placeholder='Name'
                errorMessage={errors.name?.message}
              />
            </div>
          </div>
          <div className='flex flex-col flex-wrap mt-2 sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Số điện thoại</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    onChange={field.onChange}
                    errorMessage={errors.phone?.message}
                    classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                  />
                )}
              ></Controller>
            </div>
          </div>
          <div className='flex flex-col flex-wrap mt-2 sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Địa chỉ</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                register={register}
                name='address'
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                errorMessage={errors.address?.message}
              />
            </div>
          </div>
          <Controller
            control={control}
            name='date_of_birth'
            render={({ field }) => {
              return (
                <DateSelect
                  errorMessage={errors.date_of_birth?.message}
                  value={field.value}
                  onChange={field.onChange}
                />
              )
            }}
          />
          <div className='flex flex-col flex-wrap mt-2 sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>
              <div className='sm:w-[80%] sm:pl-5'>
                <Button
                  className='flex items-center justify-center px-5 mx-auto text-sm text-center text-white h-9 bg-orange'
                  type='submit'
                >
                  Lưu
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='w-24 h-24 my-5'>
              <img src={profile?.avatar} alt='' className='object-cover w-full h-full rounded-full' />
            </div>
            <input className='hidden' type='file' accept='.jpg,.jpeg,.png' />
            <button className='flex items-center justify-end h-10 px-6 text-sm text-gray-600 bg-white border rounded-sm shadow-sm'>
              Chọn ảnh
            </button>
            <div className='mt-3 text-gray-400'>
              <div>Dụng lượng file tối đa 1 MB</div>
              <div>Định dạng:.JPEG, .PNG</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
