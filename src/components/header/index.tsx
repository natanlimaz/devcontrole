"use client"
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { FiUser, FiLogOut, FiLoader, FiLock } from "react-icons/fi";

export function Header() {

    const { status, data: session } = useSession();

    async function handleLogin() {
        await signIn();
    }

    async function handleLogout() {
        await signOut();
    }

    return (
        <header className="w-full h-20 flex items-center px-2 py-4 bg-white shadow-sm">
            <div className="w-full flex items-center justify-between max-w-7xl mx-auto">
                <Link href="/">
                    <h1 className="font-bold text-2xl pl-1 hover:tracking-widest duration-300">
                        <span className="text-blue-500">DEV</span> CONTROLE
                    </h1>
                </Link>

                {status === "loading" && (
                    <button className="animate-spin">
                        <FiLoader size={26} color="#4b5563"/>
                    </button>
                )}

                {status === "unauthenticated" && (
                    <button onClick={ handleLogin }>
                        <FiLock size={26} color="#4b5563"/>
                    </button>
                )}
  
                {status === "authenticated" && (
                    <div className="flex items-baseline gap-4">
                        <Link href="/dashboard">
                            <FiUser size={26} color="#4b5563"/>
                        </Link>
                    
                        <button onClick={ handleLogout }>
                            <FiLogOut size={26} color="#ff2313"/>
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}