# 🗄️ Banco de Dados - MVP Escola

## Tecnologia Utilizada

Este projeto utiliza **SQLite** como banco de dados, com a biblioteca `better-sqlite3` para Node.js.

### Por que SQLite?

- ✅ **Simplicidade**: Não requer instalação de servidor separado
- ✅ **Portabilidade**: Arquivo único, fácil de mover e fazer backup
- ✅ **Performance**: Excelente para aplicações pequenas/médias
- ✅ **Zero configuração**: Funciona imediatamente
- ✅ **ACID compliant**: Transações seguras
- ✅ **Ideal para MVP**: Perfeito para prototipagem e desenvolvimento

## 🚀 Instalação e Configuração

### 1. Instalar Dependências

As dependências já estão no `package.json`. Execute:

```bash
npm install
```

### 2. Inicializar o Banco

Execute o script de inicialização:

```bash
npm run init-db
```

Este comando irá:
- Criar o arquivo `database.sqlite` na raiz do projeto
- Criar as tabelas necessárias
- Inserir dados de teste
- Mostrar estatísticas do banco

### 3. Resetar o Banco (se necessário)

Para limpar e recriar o banco:

```bash
npm run reset-db
```

## 📊 Estrutura do Banco

### Tabela: `users`
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: `checkins`
```sql
CREATE TABLE checkins (
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
);
```

## 🔑 Dados de Teste

Após executar `npm run init-db`, você terá os seguintes usuários:

| Email | Senha | Papel |
|-------|-------|-------|
| admin@escola.com | admin123 | admin |
| prof@escola.com | prof123 | teacher |
| aluno@escola.com | aluno123 | student |
| maria@escola.com | maria123 | student |
| pedro@escola.com | pedro123 | student |

## 🛠️ Como Testar

1. **Inicializar o banco**:
   ```bash
   npm run init-db
   ```

2. **Iniciar o servidor**:
   ```bash
   npm run dev
   ```

3. **Acessar a aplicação**:
   ```
   http://localhost:3000
   ```

4. **Fazer login** com qualquer uma das credenciais acima

## 📁 Localização dos Arquivos

- **Banco de dados**: `database.sqlite` (raiz do projeto)
- **Script de inicialização**: `scripts/init-db.js`
- **Conexão do banco**: `src/lib/database.ts`
- **APIs**: `src/app/api/`

## 🔧 Comandos Úteis

```bash
# Inicializar banco com dados de teste
npm run init-db

# Resetar banco completamente
npm run reset-db

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📝 Notas Importantes

1. **Arquivo SQLite**: O arquivo `database.sqlite` é criado automaticamente na raiz do projeto
2. **Backup**: Para fazer backup, simplesmente copie o arquivo `database.sqlite`
3. **Desenvolvimento**: O banco é recriado sempre que você executar `npm run init-db`
4. **Produção**: Em produção, você pode usar o mesmo SQLite ou migrar para PostgreSQL/MySQL

## 🚨 Troubleshooting

### Erro: "Database is locked"
```bash
# Pare o servidor e execute:
npm run reset-db
```

### Erro: "better-sqlite3 not found"
```bash
npm install better-sqlite3
```

### Banco não inicializa
```bash
# Verifique se o diretório scripts existe
mkdir scripts
npm run init-db
```

## 🔄 Migração para Outros Bancos

Se futuramente quiser migrar para PostgreSQL ou MySQL:

1. Instale o driver apropriado (pg, mysql2)
2. Atualize `src/lib/database.ts`
3. Ajuste as queries SQL se necessário
4. Mantenha a mesma interface dos métodos

O SQLite é perfeito para desenvolvimento e MVPs, mas pode ser facilmente substituído quando necessário.