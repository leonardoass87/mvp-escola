import Database from 'better-sqlite3';
import path from 'path';
import { SystemUser, CheckIn } from '@/types';

// Caminho do banco de dados
const dbPath = path.join(process.cwd(), 'database.sqlite');

// Inicializar banco de dados
const db = new Database(dbPath);

// Habilitar WAL mode para melhor performance
db.pragma('journal_mode = WAL');

// Criar tabelas se não existirem
const initDatabase = () => {
  // Tabela de usuários
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de check-ins
  db.exec(`
    CREATE TABLE IF NOT EXISTS checkins (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      student_name TEXT NOT NULL,
      timestamp DATETIME NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
      notes TEXT,
      approved_by TEXT,
      approved_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES users(id)
    )
  `);

  // Índices para melhor performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE INDEX IF NOT EXISTS idx_checkins_student_id ON checkins(student_id);
    CREATE INDEX IF NOT EXISTS idx_checkins_status ON checkins(status);
    CREATE INDEX IF NOT EXISTS idx_checkins_timestamp ON checkins(timestamp);
  `);
};

// Preparar statements para melhor performance
const statements = {
  // Users
  getUserById: db.prepare('SELECT * FROM users WHERE id = ?'),
  getUserByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  getAllUsers: db.prepare('SELECT * FROM users ORDER BY name'),
  insertUser: db.prepare(`
    INSERT INTO users (id, name, email, password, role)
    VALUES (?, ?, ?, ?, ?)
  `),
  updateUser: db.prepare(`
    UPDATE users 
    SET name = ?, email = ?, password = ?, role = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  deleteUser: db.prepare('DELETE FROM users WHERE id = ?'),

  // Check-ins
  getCheckinById: db.prepare('SELECT * FROM checkins WHERE id = ?'),
  getAllCheckins: db.prepare(`
    SELECT * FROM checkins 
    ORDER BY timestamp DESC
  `),
  getCheckinsByStatus: db.prepare(`
    SELECT * FROM checkins 
    WHERE status = ? 
    ORDER BY timestamp DESC
  `),
  getCheckinsByStudentId: db.prepare(`
    SELECT * FROM checkins 
    WHERE student_id = ? 
    ORDER BY timestamp DESC
  `),
  getCheckinsByStudentAndDate: db.prepare(`
    SELECT * FROM checkins 
    WHERE student_id = ? AND DATE(timestamp) = DATE(?)
  `),
  insertCheckin: db.prepare(`
    INSERT INTO checkins (id, student_id, student_name, timestamp, status, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `),
  updateCheckinStatus: db.prepare(`
    UPDATE checkins 
    SET status = ?, notes = ?, approved_by = ?, approved_at = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  deleteCheckin: db.prepare('DELETE FROM checkins WHERE id = ?'),
};

// Funções de usuário
export const userDb = {
  getById: (id: string): SystemUser | null => {
    const row = statements.getUserById.get(id) as SystemUser | undefined;
    return row || null;
  },

  getByEmail: (email: string): SystemUser | null => {
    const row = statements.getUserByEmail.get(email) as SystemUser | undefined;
    return row || null;
  },

  getAll: (): SystemUser[] => {
    return statements.getAllUsers.all() as SystemUser[];
  },

  create: (user: SystemUser): void => {
    statements.insertUser.run(user.id, user.name, user.email, user.password, user.role);
  },

  update: (id: string, user: Partial<SystemUser>): boolean => {
    const existing = userDb.getById(id);
    if (!existing) return false;

    const updated = { ...existing, ...user };
    const result = statements.updateUser.run(
      updated.name,
      updated.email,
      updated.password,
      updated.role,
      id
    );
    return result.changes > 0;
  },

  delete: (id: string): boolean => {
    const result = statements.deleteUser.run(id);
    return result.changes > 0;
  }
};

// Funções de check-in
export const checkinDb = {
  getById: (id: string): CheckIn | null => {
    const row = statements.getCheckinById.get(id) as CheckIn | undefined;
    return row || null;
  },

  getAll: (): CheckIn[] => {
    return statements.getAllCheckins.all() as CheckIn[];
  },

  getByStatus: (status: string): CheckIn[] => {
    return statements.getCheckinsByStatus.all(status) as CheckIn[];
  },

  getByStudentId: (studentId: string): CheckIn[] => {
    return statements.getCheckinsByStudentId.all(studentId) as CheckIn[];
  },

  getByStudentAndDate: (studentId: string, date: string): CheckIn[] => {
    return statements.getCheckinsByStudentAndDate.all(studentId, date) as CheckIn[];
  },

  create: (checkin: CheckIn): void => {
    statements.insertCheckin.run(
      checkin.id,
      checkin.studentId,
      checkin.studentName,
      checkin.timestamp,
      checkin.status,
      checkin.notes || null
    );
  },

  updateStatus: (id: string, status: string, notes?: string, approvedBy?: string): boolean => {
    const approvedAt = status !== 'pending' ? new Date().toISOString() : null;
    const result = statements.updateCheckinStatus.run(
      status,
      notes || null,
      approvedBy || null,
      approvedAt,
      id
    );
    return result.changes > 0;
  },

  delete: (id: string): boolean => {
    const result = statements.deleteCheckin.run(id);
    return result.changes > 0;
  }
};

// Inicializar banco de dados
initDatabase();

// Inserir dados iniciais se não existirem
const seedDatabase = () => {
  const existingUsers = userDb.getAll();
  
  if (existingUsers.length === 0) {
    // Usuários iniciais
    const initialUsers: SystemUser[] = [
      {
        id: '1',
        name: 'Administrador',
        email: 'admin@escola.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        id: '2',
        name: 'Professor Silva',
        email: 'prof@escola.com',
        password: 'prof123',
        role: 'teacher'
      },
      {
        id: '3',
        name: 'João Aluno',
        email: 'aluno@escola.com',
        password: 'aluno123',
        role: 'student'
      }
    ];

    initialUsers.forEach(user => userDb.create(user));
    console.log('✅ Dados iniciais inseridos no banco de dados');
  }
};

// Executar seed na inicialização
seedDatabase();

export default db;