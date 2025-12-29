"use client"
import { Navbar } from "@/components/ui/navbar";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function NavbarWrapper() {
  const supabase = createClient();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
        return;
      }
      setUser(data.user?.email ?? null);
    };

    getUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user?.email ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return <Navbar user={user} />;
}
