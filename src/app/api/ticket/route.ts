import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions);
    if(!session || !session.user) {
        return NextResponse.json({ error: "Not authorized"}, { status: 401 });
    }

    const { id } = await request.json();

    const findTicket = await prisma.ticket.findFirst({
        where: {
            id: id as string
        }
    });

    if(!findTicket) {
        return NextResponse.json({ error: "Failed update ticket" }, { status: 400 });
    }

    try {
        await prisma.ticket.update({
            where: {
                id: id as string,
            },
            data: {
                status: "FECHADO"
            }
        });

        return NextResponse.json({ message: "Chamado atualizado com sucesso!" });
    }
    catch(error) {
        return NextResponse.json({ error: "Failed update ticket" }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if(!session || !session.user) {
        return NextResponse.json({ error: "Not authorized"}, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get("id");

    if(!ticketId) {
        return NextResponse.json({ error: "Failed to delete ticket" }, { status: 400 } );
    }

    try {
        await prisma.ticket.delete({
            where: {
                id: ticketId
            }
        });

        return NextResponse.json({ message: "Chamado deletado com sucesso!"})
    }
    catch(error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to delete ticket" }, { status: 400 } );
    }
}