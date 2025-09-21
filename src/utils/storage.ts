export interface Student {
  id: string;
  name: string;
  checkinTime: string;
}

export interface User {
  email: string;
  isLoggedIn: boolean;
}

export const storage = {
  // Funções para gerenciar usuário
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setUser: (user: User): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user', JSON.stringify(user));
  },

  removeUser: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('user');
  },

  // Funções para gerenciar estudantes
  getStudents: (): Student[] => {
    if (typeof window === 'undefined') return [];
    const students = localStorage.getItem('students');
    return students ? JSON.parse(students) : [];
  },

  setStudents: (students: Student[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('students', JSON.stringify(students));
  },

  addStudent: (student: Student): void => {
    const students = storage.getStudents();
    students.push(student);
    storage.setStudents(students);
  },

  clearAll: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('user');
    localStorage.removeItem('students');
  }
};