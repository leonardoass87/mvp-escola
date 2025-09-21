import { NextRequest, NextResponse } from 'next/server';
import { SystemUser } from '@/types';
import { userDb } from '@/lib/database';

// GET - Listar todos os usuários
export async function GET() {
  try {
    const users = userDb.getAll();
    return NextResponse.json({
      success: true,
      data: users
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar novo usuário
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    // Validações
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    if (!['admin', 'teacher', 'student'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Role inválido' },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    const existingUser = userDb.getByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email já está em uso' },
        { status: 409 }
      );
    }

    // Criar novo usuário
    const newUser: SystemUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role
    };

    userDb.create(newUser);

    return NextResponse.json({
      success: true,
      data: newUser
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}