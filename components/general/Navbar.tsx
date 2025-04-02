import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { UserDropdown } from "./UserDropdown";
import { auth } from "@/app/utils/auth";
import { prisma } from "@/app/utils/db";


export async function Navbar() {
    const session = await auth();

    let userType = null;

    if (session?.user?.email) {
        // Fetch userType from the database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { useType: true },
        });

        userType = user?.useType;
    }

    return (
        <nav className="flex items-center justify-between py-5">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1">
                <Image 
                    src="/logo1.jpg" 
                    alt="logo" 
                    width={55} 
                    height={55}
                    priority 
                />
                <h1 className="text-2xl font-bold">
                    Hire<span className="text-primary">Way</span>
                </h1>
            </Link>
            
            {/* Right Section */}
            <div className="hidden md:flex items-center gap-5">
                <ThemeToggle />
                
                {/* Always show Interview Prep button */}
                <Link href="/interview-resources">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors">
                        Interview Prep
                    </button>
                </Link>

                {/* Post Job Button (Only for Companies) */}
                {userType === "COMPANY" && (
                    <Link 
                        className={buttonVariants({ size: "lg" })} 
                        href="/post-job"
                    >
                        Post Job
                    </Link>
                )}
                
                {/* Auth: Show login if not logged in, dropdown if logged in */}
                {session?.user ? (
                    <UserDropdown
                        email={session.user.email || ""}
                        image={session.user.image || ""}
                        name={session.user.name || ""}
                    />
                ) : (
                    <Link 
                        href="/login" 
                        className={buttonVariants({ variant: "outline", size: "lg" })}
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}
