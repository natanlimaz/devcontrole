"use client"
import { CustomerProps } from "@/utils/customer.type";
import { TicketProps } from "@/utils/ticket.type";
import { FiTrash2, FiFile, FiCheckSquare } from "react-icons/fi";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { ModalContext } from "@/providers/modal";

type TicketItemPops = {
    ticket: TicketProps;
    customer: CustomerProps | null;
}

export function TicketItem( {  ticket, customer }: TicketItemPops ) {

    const { handleModalVisible, setDetailTicket } = useContext(ModalContext);

    const router = useRouter();

    async function handleChangeStatus() {
        try {
            const response = await api.patch("/api/ticket", {
                id: ticket.id
            });

            router.refresh();
        }
        catch(error) {
            console.log(error);
        }
    }

    async function handleDeleteTicketItem() {
        try {
            const response = await api.delete("/api/ticket", {
                params: {
                    id: ticket.id
                }
            });
            
            router.refresh();
        }
        catch(error) {
            console.log(error);
        }
    }

    function handleOpenModal() {
        setDetailTicket({
            ticket: ticket,
            customer: customer
        });
        handleModalVisible();
    }

    return (
        <>
            <tr className="border-b-2 border-b-slate-200 h-16 last:border-b-0 bg-slate-100 hover:bg-gray-200 duration-300">
                <td className="text-left pl-1">
                    {customer?.name}
                </td>
                <td className="text-left hidden sm:table-cell">
                    {ticket.created_at?.toLocaleDateString("pt-br")}
                </td>
                <td className="text-left">
                    <span className="bg-green-500 px-2 py-1 rounded">{ticket.status}</span>
                </td>
                <td className="text-left">
                    <button className="mr-3" onClick={handleChangeStatus}>
                        <FiCheckSquare size={24} color="#131313"/>
                    </button>
                    <button className="mr-3" onClick={handleDeleteTicketItem}>
                        <FiTrash2 size={24} color="#ef4444"/>
                    </button>
                    <button onClick={handleOpenModal}>
                        <FiFile size={24} color="#3b82f6"/>
                    </button>
                </td>
            </tr>
        </>
    );
}