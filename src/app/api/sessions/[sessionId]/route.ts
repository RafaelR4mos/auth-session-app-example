import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;

    if (!sessionId) {
      return NextResponse.json(
        { error: "ID da sessão é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se a sessão existe
    const session = db
      .prepare("SELECT id FROM sessions WHERE id = ?")
      .get(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: "Sessão não encontrada" },
        { status: 404 }
      );
    }

    // Deletar a sessão
    const result = db
      .prepare("DELETE FROM sessions WHERE id = ?")
      .run(sessionId);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Erro ao deletar sessão" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Sessão deletada com sucesso" 
    });

  } catch (error) {
    console.error("Erro ao deletar sessão:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
