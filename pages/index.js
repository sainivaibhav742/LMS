import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login if not authenticated
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    } else {
      // Redirect based on role
      const role = localStorage.getItem('role')
      if (role === 'admin') {
        router.push('/admin/dashboard')
      } else if (role === 'instructor') {
        router.push('/instructor/dashboard')
      } else {
        router.push('/student/dashboard')
      }
    }
  }, [router])

  return <div>Loading...</div>
}
