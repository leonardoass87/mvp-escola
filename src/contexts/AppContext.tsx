'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CheckIn, UserRole, SystemUser } from '@/types/user';

interface AppContextType {
  currentUser: User | null;
  users: SystemUser[];
  checkIns: CheckIn[];
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  addCheckIn: (checkIn: Omit<CheckIn, 'id' | 'timestamp'>) => void;
  approveCheckIn: (checkInId: string, notes?: string) => void;
  rejectCheckIn: (checkInId: string, notes?: string) => void;
  addUser: (userData: Omit<SystemUser, 'id'>) => void;
  updateUser: (userId: string, userData: Partial<SystemUser>) => void;
  deleteUser: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Dados iniciais do sistema
const initialUsers: SystemUser[] = [
  {
    id: '1',
    email: 'admin@escola.com',
    name: 'Administrador',
    role: 'admin',
    password: 'admin123'
  },
  {
    id: '2',
    email: 'prof@escola.com',
    name: 'Professor Silva',
    role: 'teacher',
    password: 'prof123'
  },
  {
    id: '3',
    email: 'aluno@escola.com',
    name: 'João Aluno',
    role: 'student',
    password: 'aluno123'
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<SystemUser[]>(initialUsers);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);

  useEffect(() => {
    // Carregar dados do localStorage
    const savedUser = localStorage.getItem('currentUser');
    const savedUsers = localStorage.getItem('systemUsers');
    const savedCheckIns = localStorage.getItem('checkIns');
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      localStorage.setItem('systemUsers', JSON.stringify(initialUsers));
    }
    
    if (savedCheckIns) {
      setCheckIns(JSON.parse(savedCheckIns));
    }
  }, []);

  const login = (email: string, password: string, role: UserRole): boolean => {
    // Verificar se o usuário existe no sistema
    const systemUser = users.find(u => u.email === email && u.role === role);
    
    if (systemUser && password) {
      const userData: User = {
        id: systemUser.id,
        email: systemUser.email,
        name: systemUser.name,
        role: systemUser.role,
        isActive: true,
        createdAt: new Date().toISOString()
      };
      
      setCurrentUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const addCheckIn = (checkIn: Omit<CheckIn, 'id' | 'timestamp'>) => {
    const newCheckIn: CheckIn = {
      ...checkIn,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    const updatedCheckIns = [...checkIns, newCheckIn];
    setCheckIns(updatedCheckIns);
    localStorage.setItem('checkIns', JSON.stringify(updatedCheckIns));
  };

  const approveCheckIn = (checkInId: string, notes?: string) => {
    const updatedCheckIns = checkIns.map(checkIn =>
      checkIn.id === checkInId
        ? { ...checkIn, status: 'approved' as const, notes, approvedBy: currentUser?.id }
        : checkIn
    );
    setCheckIns(updatedCheckIns);
    localStorage.setItem('checkIns', JSON.stringify(updatedCheckIns));
  };

  const rejectCheckIn = (checkInId: string, notes?: string) => {
    const updatedCheckIns = checkIns.map(checkIn =>
      checkIn.id === checkInId
        ? { ...checkIn, status: 'rejected' as const, notes, approvedBy: currentUser?.id }
        : checkIn
    );
    setCheckIns(updatedCheckIns);
    localStorage.setItem('checkIns', JSON.stringify(updatedCheckIns));
  };

  const addUser = (userData: Omit<SystemUser, 'id'>) => {
    const newUser: SystemUser = {
      ...userData,
      id: Date.now().toString()
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
  };

  const updateUser = (userId: string, userData: Partial<SystemUser>) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, ...userData } : user
    );
    
    setUsers(updatedUsers);
    localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
  };

  const deleteUser = (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      checkIns,
      login,
      logout,
      addCheckIn,
      approveCheckIn,
      rejectCheckIn,
      addUser,
      updateUser,
      deleteUser
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};