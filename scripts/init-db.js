const Database = require('better-sqlite3');
const path = require('path');

// Caminho do banco de dados
const dbPath = path.join(process.cwd(), 'database.sqlite');

console.log('🗄️  Inicializando banco de dados SQLite...');
console.log(`📍 Localização: ${dbPath}`);

// Criar/conectar ao banco
const db = new Database(dbPath);

// Habilitar WAL mode
db.pragma('journal_mode = WAL');

console.log('✅ Banco de dados conectado com sucesso!');

// Criar tabelas
console.log('📋 Criando tabelas...');

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

// Criar índices
console.log('🔍 Criando índices...');

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  CREATE INDEX IF NOT EXISTS idx_checkins_student_id ON checkins(student_id);
  CREATE INDEX IF NOT EXISTS idx_checkins_status ON checkins(status);
  CREATE INDEX IF NOT EXISTS idx_checkins_timestamp ON checkins(timestamp);
`);

// Verificar se já existem dados
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;

if (userCount === 0) {
  console.log('👥 Inserindo usuários iniciais...');
  
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password, role)
    VALUES (?, ?, ?, ?, ?)
  `);

  // Usuários iniciais
  const users = [
    ['1', 'Administrador', 'admin@escola.com', 'admin123', 'admin'],
    ['2', 'Professor Silva', 'prof@escola.com', 'prof123', 'teacher'],
    ['3', 'João Aluno', 'aluno@escola.com', 'aluno123', 'student'],
    ['4', 'Maria Aluna', 'maria@escola.com', 'maria123', 'student'],
    ['5', 'Pedro Aluno', 'pedro@escola.com', 'pedro123', 'student']
  ];

  users.forEach(user => {
    insertUser.run(...user);
  });

  console.log(`✅ ${users.length} usuários inseridos!`);

  // Inserir alguns check-ins de exemplo
  console.log('📝 Inserindo check-ins de exemplo...');
  
  const insertCheckin = db.prepare(`
    INSERT INTO checkins (id, student_id, student_name, timestamp, status, notes, approved_by, approved_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  const checkins = [
    ['1', '3', 'João Aluno', now.toISOString(), 'pending', null, null, null],
    ['2', '4', 'Maria Aluna', yesterday.toISOString(), 'approved', 'Chegada pontual', 'Professor Silva', yesterday.toISOString()],
    ['3', '5', 'Pedro Aluno', twoDaysAgo.toISOString(), 'rejected', 'Chegada muito atrasada', 'Professor Silva', twoDaysAgo.toISOString()],
    ['4', '3', 'João Aluno', yesterday.toISOString(), 'approved', 'OK', 'Professor Silva', yesterday.toISOString()]
  ];

  checkins.forEach(checkin => {
    insertCheckin.run(...checkin);
  });

  console.log(`✅ ${checkins.length} check-ins de exemplo inseridos!`);
} else {
  console.log(`ℹ️  Banco já contém ${userCount} usuários. Pulando inserção inicial.`);
}

// Mostrar estatísticas
const stats = {
  users: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
  checkins: db.prepare('SELECT COUNT(*) as count FROM checkins').get().count,
  pending: db.prepare("SELECT COUNT(*) as count FROM checkins WHERE status = 'pending'").get().count,
  approved: db.prepare("SELECT COUNT(*) as count FROM checkins WHERE status = 'approved'").get().count,
  rejected: db.prepare("SELECT COUNT(*) as count FROM checkins WHERE status = 'rejected'").get().count
};

console.log('\n📊 Estatísticas do banco:');
console.log(`👥 Usuários: ${stats.users}`);
console.log(`📝 Check-ins: ${stats.checkins}`);
console.log(`⏳ Pendentes: ${stats.pending}`);
console.log(`✅ Aprovados: ${stats.approved}`);
console.log(`❌ Rejeitados: ${stats.rejected}`);

db.close();
console.log('\n🎉 Banco de dados inicializado com sucesso!');
console.log('\n💡 Para testar:');
console.log('   npm run dev');
console.log('   Acesse: http://localhost:3000');
console.log('\n🔑 Credenciais de teste:');
console.log('   Admin: admin@escola.com / admin123');
console.log('   Professor: prof@escola.com / prof123');
console.log('   Aluno: aluno@escola.com / aluno123');