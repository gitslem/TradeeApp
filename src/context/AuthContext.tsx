import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface User {
  email: string
  createdAt: string
  lastLogin: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, code: string) => Promise<boolean>
  sendVerificationCode: (email: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('tradee_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('tradee_user')
      }
    }
    setLoading(false)
  }, [])

  const sendVerificationCode = async (email: string): Promise<boolean> => {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return false
      }

      // Generate a 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString()

      // Store the code temporarily (in real app, this would be sent via email and stored server-side)
      const verificationData = {
        email,
        code,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
      }

      localStorage.setItem('tradee_verification', JSON.stringify(verificationData))

      // In a real app, send email here
      console.log(`Verification code for ${email}: ${code}`)
      alert(`Demo Mode: Your verification code is ${code}\n\nIn production, this would be sent to your email.`)

      return true
    } catch (error) {
      console.error('Error sending verification code:', error)
      return false
    }
  }

  const login = async (email: string, code: string): Promise<boolean> => {
    try {
      // Retrieve stored verification data
      const storedData = localStorage.getItem('tradee_verification')
      if (!storedData) {
        return false
      }

      const verificationData = JSON.parse(storedData)

      // Check if code matches and hasn't expired
      if (
        verificationData.email !== email ||
        verificationData.code !== code ||
        Date.now() > verificationData.expiresAt
      ) {
        return false
      }

      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('tradee_users') || '[]')
      let userData = existingUsers.find((u: User) => u.email === email)

      if (!userData) {
        // Create new user
        userData = {
          email,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        }
        existingUsers.push(userData)
        localStorage.setItem('tradee_users', JSON.stringify(existingUsers))
      } else {
        // Update last login
        userData.lastLogin = new Date().toISOString()
        const updatedUsers = existingUsers.map((u: User) =>
          u.email === email ? userData : u
        )
        localStorage.setItem('tradee_users', JSON.stringify(updatedUsers))
      }

      // Set current user
      setUser(userData)
      localStorage.setItem('tradee_user', JSON.stringify(userData))

      // Clear verification data
      localStorage.removeItem('tradee_verification')

      return true
    } catch (error) {
      console.error('Error during login:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('tradee_user')
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    sendVerificationCode,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
