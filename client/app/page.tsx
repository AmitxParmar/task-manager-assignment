import dynamic from 'next/dynamic'

const LoginForm = dynamic(() => import('@/components/forms/login').then(m => m.LoginForm))

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <LoginForm />
    </div>
  )
}

