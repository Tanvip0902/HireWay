import Image from "next/image";
import Link from "next/link";
import logo1 from '@/public/logo1.jpg'
import { LoginForm } from "@/components/forms/LoginForm";

export default function Login(){
    return(
        <div className="min-h-screen w-screen flex items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6 ">
        <Link href='/' className="flex items-center gap-1 self-center">
        <Image src={logo1} alt="logo" className="size-10"/>
        <h1 className="text-2xl font-bold">Hire<span className="text-primary">Way</span></h1>
        </Link>
        <LoginForm/>
      </div>
        </div>
    )
}