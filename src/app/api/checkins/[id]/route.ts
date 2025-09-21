import { NextRequest, NextResponse } from 'next/server';
import { CheckIn } from '@/types';
import { checkinDb } from '@/lib/database';

// GET - Buscar check-in por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const checkIn = checkinDb.getById(id);

    if (!checkIn) {
      return NextResponse.json(
        { success: false, error: 'Check-in não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: checkIn
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar status do check-in (aprovar/rejeitar)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes, approvedBy } = body;

    const existingCheckin = checkinDb.getById(id);
    if (!existingCheckin) {
      return NextResponse.json(
        { success: false, error: 'Check-in não encontrado' },
        { status: 404 }
      );
    }

    // Validações
    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status é obrigatório' },
        { status: 400 }
      );
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status inválido' },
        { status: 400 }
      );
    }

    // Verificar se o check-in está pendente
    if (existingCheckin.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Apenas check-ins pendentes podem ser atualizados' },
        { status: 400 }
      );
    }

    // Atualizar check-in
    const updated = checkinDb.updateStatus(id, status, notes, approvedBy);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Erro ao atualizar check-in' },
        { status: 500 }
      );
    }

    const updatedCheckin = checkinDb.getById(id);
    return NextResponse.json({
      success: true,
      data: updatedCheckin
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar check-in
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existingCheckin = checkinDb.getById(id);

    if (!existingCheckin) {
      return NextResponse.json(
        { success: false, error: 'Check-in não encontrado' },
        { status: 404 }
      );
    }

    // Remover check-in
    const deleted = checkinDb.delete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Erro ao deletar check-in' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: existingCheckin,
      message: 'Check-in deletado com sucesso'
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}