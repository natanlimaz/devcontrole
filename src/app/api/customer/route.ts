import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const customerEmail = searchParams.get("email");

    if(!customerEmail || customerEmail === "") {
        return NextResponse.json({ error: "Customer not found"}, { status: 400 });
    }

    try {
        const customer = await prisma.customer.findFirst({
            where: {
                email: customerEmail
            }
        });

        return NextResponse.json(customer);
    }
    catch(error) {
        return NextResponse.json({ error: "Customer not found"}, { status: 400 });
    }

    return NextResponse.json({ message: "RECEBIDO"});
}

export async function POST(request: Request) {
    
    const session = await getServerSession(authOptions);
    if(!session || !session.user) {
        return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const { name, email, phone, address, userId } = await request.json();

    try {

        await prisma.customer.create({
            data: {
                name,
                phone,
                email,
                address: address ? address : "",
                userId
            }
        });

        return NextResponse.json({ message: "Cliente cadastrado com sucesso!" });

    }
    catch(error) {
        return NextResponse.json({ error: "Failed create new customer" }, { status: 400 });
    }
}

export async function DELETE(request: Request) {

    const session = await getServerSession(authOptions);

    if(!session || !session.user) {
        return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if(!userId) {
        return NextResponse.json({ error: "Failed to delete customer" }, { status: 400 } );
    }

    const ticketsByUser = await prisma.ticket.findMany({
        where: {
            userId: userId 
        }
    });

    if(ticketsByUser) {
        await prisma.ticket.deleteMany({
            where: {
                customerId: userId
            }
        });
    }

    try {
        await prisma.customer.delete({
            where: {
                id: userId as string
            }
        });

        return NextResponse.json({ message: "Cliente deletado com sucesso!"})
    }
    catch(error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to delete customer" }, { status: 400 } );
    } 
    
}
