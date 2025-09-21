import { NextRequest, NextResponse } from 'next/server';
import { CheckIn } from '@/types';
import { checkinDb } from '@/lib/database';

// POST - Rejeitar check-in
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { checkInId, notes, approvedBy } = body;

    // Validações
    if (!checkInId) {
      return NextResponse.json(
        { success: false, error: 'ID do check-in é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar check-in
    const checkin = checkinDb.getById(checkInId);
    if (!checkin) {
      return NextResponse.json(
        { success: false, error: 'Check-in não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se está pendente
    if (checkin.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Check-in já foi processado' },
        { status: 400 }
      );
    }

    // Rejeitar check-in
    const updated = checkinDb.updateStatus(checkInId, 'rejected', notes, approvedBy);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Erro ao rejeitar check-in' },
        { status: 500 }
      );
    }

    const rejectedCheckin = checkinDb.getById(checkInId);
    return NextResponse.json({
      success: true,
      data: rejectedCheckin,
      message: 'Check-in rejeitado com sucesso'
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}