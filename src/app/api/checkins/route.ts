import { NextRequest, NextResponse } from 'next/server';
import { CheckIn } from '@/types';
import { checkinDb } from '@/lib/database';

// GET - Listar todos os check-ins
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const studentId = searchParams.get('studentId');

    let filteredCheckins: CheckIn[];

    // Filtrar por status e/ou studentId
    if (status && studentId) {
      // Se ambos os filtros estão presentes, buscar por studentId e filtrar por status
      const studentCheckins = checkinDb.getByStudentId(studentId);
      filteredCheckins = studentCheckins.filter(checkin => checkin.status === status);
    } else if (status) {
      filteredCheckins = checkinDb.getByStatus(status);
    } else if (studentId) {
      filteredCheckins = checkinDb.getByStudentId(studentId);
    } else {
      filteredCheckins = checkinDb.getAll();
    }

    return NextResponse.json({
      success: true,
      data: filteredCheckins
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar novo check-in
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, studentName, timestamp, notes } = body;

    // Validações
    if (!studentId || !studentName || !timestamp) {
      return NextResponse.json(
        { success: false, error: 'StudentId, studentName e timestamp são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se já existe check-in para o mesmo aluno no mesmo dia
    const date = new Date(timestamp).toISOString().split('T')[0];
    const existingCheckins = checkinDb.getByStudentAndDate(studentId, date);

    if (existingCheckins.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Já existe um check-in para este aluno hoje' },
        { status: 409 }
      );
    }

    // Criar novo check-in
    const newCheckin: CheckIn = {
      id: Date.now().toString(),
      studentId,
      studentName,
      timestamp,
      status: 'pending',
      notes
    };

    checkinDb.create(newCheckin);

    return NextResponse.json({
      success: true,
      data: newCheckin
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}