import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default function Home() {
  const token = cookies().get('authToken')
  const isAuthenticated = token && token.value && token.value.length > 0

  if (isAuthenticated) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}
