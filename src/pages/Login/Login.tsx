import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { loginAccount } from 'src/apis/auth.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { path } from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponse } from 'src/types/utils.type'
import { schemaNoConfirm } from 'src/utils/rules'
import { isAxiosEntityError } from 'src/utils/utils'

export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<schemaNoConfirm>({
    resolver: yupResolver(schemaNoConfirm)
  })
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const LoginMutation = useMutation({
    mutationFn: (body: Omit<schemaNoConfirm, 'confirm_password'>) => loginAccount(body),
    onSuccess: (data) => {
      toast.success('Login Success')
      setIsAuthenticated(true)
      setProfile(data.data.data.user)
      navigate('/')
    },
    onError: (err) => {
      if (isAxiosEntityError<ErrorResponse<Omit<schemaNoConfirm, 'confirm_password'>>>(err)) {
        const formError = err.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) =>
            setError(key as keyof schemaNoConfirm, {
              message: formError[key as keyof schemaNoConfirm],
              type: 'Server'
            })
          )
        }
      }
    }
  })
  const onSubmit = handleSubmit((data: schemaNoConfirm) => {
    LoginMutation.mutate(data)
  })
  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 bg-white rounded shadow-sm' onSubmit={onSubmit}>
              <div className='text-2xl'>Đăng nhập</div>
              <Input
                name='email'
                register={register}
                type='text'
                placeholder='Email'
                errorMessage={errors.email ? errors.email.message : ''}
              ></Input>
              <Input
                name='password'
                register={register}
                type='password'
                placeholder='Password'
                errorMessage={errors.password ? errors.password.message : ''}
                autoComplete='on'
              ></Input>
              <div className='mt-3'>
                <Button
                  className='flex items-center justify-center w-full px-2 py-4 text-sm text-center text-white uppercase bg-red-500 hover:bg-red-600'
                  isLoading={LoginMutation.isLoading}
                  disabled={LoginMutation.isLoading}
                >
                  Đăng Nhập
                </Button>
              </div>
              <div className='flex items-center justify-center mt-8'>
                <span className='text-gray-400'>Bạn chưa có tài khoản?</span>
                <Link className='ml-1 text-red-400' to={path.register}>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
