export type TicketProps = {
    id: string;
    name: string;
    description: string;
    status: string;
    created_at: Date | null;
    updated_at: Date | null;
    customerId: string | null;
    userId: string | null;
    customer: {
        id: string;
        name: string;
        created_at: Date | null;
        updated_at: Date | null;
        userId: string | null;
        address: string | null;
        phone: string;
        email: string;
    } | null;
}