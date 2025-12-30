'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Maps from "@/components/Maps";
import { Loader2 } from 'lucide-react';

export default function MapsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/auth/login');
                return;
            }

            setLoading(false);
        };

        checkAuth();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen gap-6 pt-24 md:pt-32 pb-12 px-4 flex flex-col justify-center items-center w-full overflow-hidden">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold italic text-center mb-6 md:mb-8">
                Maps <span className="text-primary">जीवनामृत</span>
            </h1>
            <p className="text-lg text-center max-w-2xl px-4 md:px-0">
                Explore medicinal herbs across India with our interactive maps, helping you discover local Ayurvedic plants and their healing properties.
            </p>
            {/* Map component or content goes here */}
            <Maps />
        </div>
    );
}