import Link from "next/link";

export default function NotFound() {
    
    return (
        <div className="w-full h-full mt-52 flex items-center justify-center flex-col gap-4">
            <h1 className="text-3xl font-bold">Ops, esta página não foi encontrada!</h1>
            <Link href="/" className="bg-gray-900 text-white font-bold px-2 py-4 rounded">
                Página inicial
            </Link>
        </div>
    );
}