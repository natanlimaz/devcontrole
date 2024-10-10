"use client"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/input";
import api from "@/lib/api"
import { useRouter } from "next/navigation"

const schema = z.object({
    name: z.string().min(1, "O campo nome é obrigatório"),
    email: z.string().email("Digite um email válido").min(1, "O campo email é obrigatório"),
    phone: z.string().refine( (value) => {
        return /^(?:\(\d{2}\)\s?)?\d{9}$/.test(value) || /^\d{2}\s\d{9}$/.test(value) || /^\d{11}$/.test(value)
    }, {
        message: "O numero de telefone deve estar no formato (dd) xxxxx-xxxx"
    }),
    address: z.string(),
})

type FormData = z.infer<typeof schema>

export function NewCustomerForm({ userId }: { userId: string }) {

    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema)
    });

    async function handleRegisterCustomer(data: FormData) {
        await api.post("/api/customer", {
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            userId: userId
        });

        router.replace("/dashboard/customer");
    }

    return (
        <form className="flex flex-col mt-6" onSubmit={handleSubmit(handleRegisterCustomer)}>
            <label className="mb-1 text-lg font-medium">Nome completo:</label>
            <Input
                type="text"
                name="name"
                placeholder="Digite o nome completo"
                register={register}
                error={errors.name?.message}
            />

            <section className="flex flex-col gap-2 my-2 sm:flex-row">
                <div className="flex-1">
                    <label className="mb-1 text-lg font-medium">Telefone:</label>
                    <Input
                        type="string"
                        name="phone"
                        placeholder="(12) 3456-7891"
                        register={register}
                        error={errors.phone?.message}
                    />
                </div>

                <div className="flex-1">
                    <label className="mb-1 text-lg font-medium">Email:</label>
                    <Input
                        type="email"
                        name="email"
                        placeholder="Digite o email"
                        register={register}
                        error={errors.email?.message}
                    />
                </div>
            </section>

            <label className="mb-1 text-lg font-medium">Endereço:</label>
            <Input
                type="text"
                name="address"
                placeholder="Digite o endereço do cliente"
                register={register}
                error={errors.address?.message}
            />

            <button
                className="bg-blue-500 my-4 px-2 h-11 rounded text-white font-bold"
                type="submit"
            >
                Cadastrar
            </button>
        </form>
    );
}