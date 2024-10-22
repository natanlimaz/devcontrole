import { Container } from "@/components/container";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TicketItem } from "./components/ticket";
import prisma from "@/lib/prisma";
import { ButtonRefresh } from "./components/ButtonRefresh";

export default async function Dashboard() {

    const session = await getServerSession(authOptions);
    if(!session || !session.user) {
        redirect("/");
    }

    const tickets = await prisma.ticket.findMany({
        where: {
            status: "ABERTO",
            customer: {
                userId: session.user.id
            }
        },
        include: {
            customer: true
        },
        orderBy: {
            created_at: "desc"
        }
    });

    const ticketsClosed = await prisma.ticket.findMany({
        where: {
            status: "FECHADO",
            customer: {
                userId: session.user.id
            }
        },
        include: {
            customer: true
        },
        orderBy: {
            created_at: "desc"
        }
    });

    return (
        <Container>
            <main className="mt-9 mb-2">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold">Chamados</h1>
                    <div className="flex items-center gap-3">
                        <ButtonRefresh />
                        <Link href="dashboard/new" className="bg-blue-500 px-4 py-1 rounded text-white">
                            Novo chamado
                        </Link>
                    </div>
                </div>

                {tickets.length === 0 && (
                    <h1 className="px-2 md:px-0 text-gray-600">Nenhum chamado aberto foi encontrado</h1>
                )}

                {tickets.length > 0 && (
                    <table className="min-w-full my-2">
                        <thead>
                            <tr>
                                <th className="font-medium text-left pl-1">CLIENTE</th>
                                <th className="font-medium text-left hidden sm:block">DATA CADASTRO</th>
                                <th className="font-medium text-left">STATUS</th>
                                <th className="font-medium text-left">#</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map( ticket => (
                                <TicketItem key={ticket.id} ticket={ticket} customer={ticket.customer}/>
                            ))}
                        </tbody>
                    </table>
                )}

                <section className="mt-7 mb-2">
                    <h1 className="text-3xl font-bold">Chamados fechados</h1>

                    {ticketsClosed.length === 0 && (
                        <h1 className="px-2 md:px-0 text-gray-600">Nenhum chamado fechado foi encontrado</h1>
                    )}

                    {ticketsClosed.length > 0 && (
                        <table className="min-w-full my-2">
                            <thead>
                                <tr>
                                    <th className="font-medium text-left pl-1">CLIENTE</th>
                                    <th className="font-medium text-left hidden sm:block">DATA CADASTRO</th>
                                    <th className="font-medium text-left">STATUS</th>
                                    <th className="font-medium text-left">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ticketsClosed.map( ticketClosed => (
                                    <TicketItem key={ticketClosed.id} ticket={ticketClosed} customer={ticketClosed.customer}/>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            </main>
        </Container>
    );
}