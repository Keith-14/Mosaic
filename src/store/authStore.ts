import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Address = { id: string; fullName: string; phone: string; line1: string; line2?: string; pincode: string; city: string; state: string }
export type User = { id: string; name: string; email: string; phone: string; password: string; addresses: Address[] }

type AuthState = {
  users: User[]
  currentUser: User | null
  signup: (name: string, email: string, phone: string, password: string) => User
  login: (email: string, password: string) => User
  logout: () => void
  addAddress: (address: Omit<Address, 'id'>) => void
  removeAddress: (addressId: string) => void
  loginDemo: () => User
}

const demoUser: User = { id: 'demo-user', name: 'Demo User', email: 'demo@bodywise.test', phone: '9876543210', password: 'demo123', addresses: [] }
const newId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

// Demo only: passwords are deliberately plain text in localStorage. Never do this in production.
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [demoUser],
      currentUser: null,
      signup: (name, email, phone, password) => {
        const cleanEmail = email.trim().toLowerCase()
        if (password.length < 6) throw new Error('Password must be at least 6 characters.')
        if (get().users.some((user) => user.email === cleanEmail)) throw new Error('An account already exists for this email.')
        const user: User = { id: newId('user'), name: name.trim(), email: cleanEmail, phone: phone.trim(), password, addresses: [] }
        set((state) => ({ users: [...state.users, user], currentUser: user }))
        return user
      },
      login: (email, password) => {
        const user = get().users.find((candidate) => candidate.email === email.trim().toLowerCase())
        if (!user || user.password !== password) throw new Error('Incorrect email or password.')
        set({ currentUser: user })
        return user
      },
      logout: () => set({ currentUser: null }),
      addAddress: (address) => {
        const user = get().currentUser
        if (!user) return
        const nextUser = { ...user, addresses: [...user.addresses, { ...address, id: newId('address') }] }
        set((state) => ({ currentUser: nextUser, users: state.users.map((item) => item.id === user.id ? nextUser : item) }))
      },
      removeAddress: (addressId) => {
        const user = get().currentUser
        if (!user) return
        const nextUser = { ...user, addresses: user.addresses.filter((address) => address.id !== addressId) }
        set((state) => ({ currentUser: nextUser, users: state.users.map((item) => item.id === user.id ? nextUser : item) }))
      },
      loginDemo: () => {
        const user = get().users.find((item) => item.email === demoUser.email) ?? demoUser
        set((state) => ({ users: state.users.some((item) => item.email === demoUser.email) ? state.users : [...state.users, demoUser], currentUser: user }))
        return user
      },
    }),
    { name: 'bodywise-demo-auth' },
  ),
)
