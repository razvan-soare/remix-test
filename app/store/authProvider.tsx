import * as React from 'react';
import type { User } from '~/types';
import { createSimpleContext } from './createContext';

type AuthState = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}
const {
  Provider: AuthProviderRoot,
  useValue: useAuth,
} = createSimpleContext<AuthState>('Auth')

function AuthProvider({ children }: { children: React.ReactNode | Array<React.ReactNode> }) {
  const [user, setUser] = React.useState<User | null>(null)

  return (
    <AuthProviderRoot value={{ user, setUser }} >
      {children}
    </AuthProviderRoot>
  )
}

export {
  AuthProvider,
  useAuth,
}