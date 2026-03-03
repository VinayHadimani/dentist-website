import { cookies } from 'next/headers'

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('admin-session')
    return session?.value === 'authenticated'
  } catch {
    return false
  }
}
