import { Container } from "@/components/container";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TicketItem } from "./components/ticket";
import prisma from "@/lib/prisma";

export default async function Dashboard() {

    const session = await getServerSession(authOptions);
    if(!session || !session.user) {
        redirect("/");
    }

    const tickets = await prisma.ticket.findMany({
        where: {
            userId: session.user.id
        }
    });

    return (
        <Container>
            <main className="mt-9 mb-2">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold">Chamados</h1>
                    <Link href="dashboard/new" className="bg-blue-500 px-4 py-1 rounded text-white">
                        Novo chamado
                    </Link>
                </div>

                {tickets.length === 0 && (
                    <h1 className="text-gray-600">Você ainda não possui nenhum chamado</h1>
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
                                <TicketItem key={ticket.id} data={ticket}/>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </Container>
    );
}