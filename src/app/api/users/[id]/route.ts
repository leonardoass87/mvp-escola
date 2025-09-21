import { NextRequest, NextResponse } from 'next/server';
import { SystemUser } from '@/types';
import { userDb } from '@/lib/database';

// GET - Buscar usuário por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = userDb.getById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar usuário
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, email, password, role } = body;

    const existingUser = userDb.getById(id);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

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

    // Verificar se email já existe (exceto para o próprio usuário)
    const emailUser = userDb.getByEmail(email);
    if (emailUser && emailUser.id !== id) {
      return NextResponse.json(
        { success: false, error: 'Email já está em uso' },
        { status: 409 }
      );
    }

    // Atualizar usuário
    const updated = userDb.update(id, { name, email, password, role });
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Erro ao atualizar usuário' },
        { status: 500 }
      );
    }

    const updatedUser = userDb.getById(id);
    return NextResponse.json({
      success: true,
      data: updatedUser
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar usuário
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const existingUser = userDb.getById(id);

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Remover usuário
    const deleted = userDb.delete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Erro ao deletar usuário' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: existingUser,
      message: 'Usuário deletado com sucesso'
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}