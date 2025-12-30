"use client"
import { navLinks } from "@/constants/layout";
import type { NavLink } from "@/constants/layout";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { CurrentUserAvatar } from '@/components/current-user-avatar'
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { createClient } from '@/lib/supabase/client';

export const Navbar = ({ user }: { user: string | null }) => {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleAuthAction = async () => {
        if (user) {
            // Logout
            const supabase = createClient();
            await supabase.auth.signOut();
            router.refresh();
        } else {
            // Login
            router.push('/auth/login');
        }
        setIsMobileMenuOpen(false);
    };
    const handleProfilePageNavigation = () => {
        if (user) {
            router.push('/profile/' + user);
        } else {
            router.push('/auth/login');
        }
        setIsMobileMenuOpen(false);
    }

    return (
        <div className="fixed top-4 left-0 right-0 z-50 mx-4 md:mx-8">
            <div className="rounded-3xl bg-white/50 backdrop-blur-sm border-b border-white/20 shadow-sm flex justify-between items-center h-16 py-4 px-4 md:px-6">
            {/* Logo */}
            <div className="cursor-pointer">
                <h1 className="text-lg md:text-xl font-bold text-primary">जीवनामृत</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
                <ul className="flex gap-4 cursor-pointer">
                    {navLinks.map((link: NavLink) => (
                        <li key={link.id}>
                            <p onClick={() => router.push(link.href)} className="hover:text-primary transition-colors">
                                {link.label}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden md:flex gap-4 items-center">
                {user && (
                    <div onClick={handleProfilePageNavigation} className="cursor-pointer">
                        <CurrentUserAvatar />
                    </div>
                )}
                <Button onClick={handleAuthAction} variant="default">
                    {user ? 'Logout' : 'Login'}
                </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
            <div className="md:hidden mt-2 rounded-3xl  bg-white/50 backdrop-blur-sm border-b border border-white/20 shadow-lg p-4">
                <ul className="flex flex-col gap-3 mb-4 justify-center items-center cursor-pointer">
                    {navLinks.map((link: NavLink) => (
                        <li key={link.id}>
                            <p 
                                onClick={() => {
                                    router.push(link.href);
                                    setIsMobileMenuOpen(false);
                                }}
                                className="hover:text-primary transition-colors cursor-pointer py-2"
                            >
                                {link.label}
                            </p>
                        </li>
                    ))}
                </ul>
                <div className="flex gap-3 items-center pt-3 border-t border-gray-200">
                    {user && (
                        <div onClick={handleProfilePageNavigation} className="cursor-pointer">
                            <CurrentUserAvatar />
                        </div>
                    )}
                    <Button 
                        onClick={handleAuthAction}
                        variant="default"
                        className="flex-1"
                    >
                        {user ? 'Logout' : 'Login'}
                    </Button>
                </div>
            </div>
        )}
        </div>
    )
}