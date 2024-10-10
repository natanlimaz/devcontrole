"use client"
import { useEffect, useState } from "react";
import { RegisterOptions, UseFormRegister } from "react-hook-form";

type InputProps = {
    type: string;
    placeholder: string;
    name: string;
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions;
    mask?: (value: string) => string;
}

export function Input({ type, placeholder, name, register, error, rules }: InputProps) {
    return(
       <>
            <input
                className="w-full border-2 rounded-md h-11 px-2"
                placeholder={placeholder}
                type={type}
                {...register(name, rules)}
                id={name}
                
            />
            {error && <p className="text-red-500 my-1">{error}</p>}
       </>
    );
}