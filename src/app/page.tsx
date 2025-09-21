'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import LoginForm from '@/components/LoginForm';

export default function Home() {
  const { currentUser } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      // Redirecionar baseado no tipo de usuário
      switch (currentUser.role) {
        case 'student':
          router.push('/dashboard/student');
          break;
        case 'teacher':
          router.push('/dashboard/teacher');
          break;
        case 'admin':
          router.push('/dashboard/admin');
          break;
        default:
          router.push('/dashboard');
      }
    }
  }, [currentUser, router]);

  if (currentUser) {
    return null; // Ou um loading spinner
  }

  return <LoginForm />;
}
