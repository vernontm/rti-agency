import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import toast from 'react-hot-toast'

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

const RegisterPage = () => {
  const navigate = useNavigate()
  const { signUp, loading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    const { error } = await signUp(data.email, data.password, data.fullName)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Account created! Please check your email to verify.')
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md bg-blue-600 rounded-xl shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">RTI Agency</h1>
          <p className="text-blue-100 mt-2">Create your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Full Name</label>
            <input
              id="fullName"
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2 rounded-lg border border-blue-400 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              {...register('fullName')}
            />
            {errors.fullName && <p className="text-red-200 text-sm mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg border border-blue-400 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              {...register('email')}
            />
            {errors.email && <p className="text-red-200 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-white mb-1">Password</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg border border-blue-400 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-blue-600 hover:text-blue-800"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
            {errors.password && <p className="text-red-200 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg border border-blue-400 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <p className="text-red-200 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" className="w-full" loading={loading}>
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-blue-100">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:text-blue-200 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
