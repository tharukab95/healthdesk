import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    role: 'admin' | 'doctor' | 'dispenser';
    isActive: boolean;
  }
}
