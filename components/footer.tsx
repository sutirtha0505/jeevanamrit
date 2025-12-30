"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { MessageSquare, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { User } from "@supabase/supabase-js";

export default function Footer() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      setUser(authUser);
    };
    checkUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to send a message", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      // Get user profile for name
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      const { error } = await supabase.from("contact_messages").insert({
        user_id: user.id,
        user_email: user.email || "",
        user_name: profile?.full_name || user.email || "Anonymous",
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        status: "unread",
      });

      if (error) throw error;

      toast.success("Message sent successfully! We'll get back to you soon.", {
        position: "top-right",
        autoClose: 3000,
      });

      // Reset form and close dialog
      setFormData({ subject: "", message: "" });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = async () => {
    // Check current user session before opening dialog
    const supabase = createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      toast.error("Please login to contact us", {
        position: "top-right",
        autoClose: 3000,
      });
      setUser(null); // Update state to reflect logged out status
      return;
    }
    
    setUser(currentUser); // Update user state with fresh data
    setIsDialogOpen(true);
  };

  return (
    <>
      {/* Floating Contact Button */}
      <Button
        onClick={handleOpenDialog}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
        size="icon"
      >
        <MessageSquare size={24} />
      </Button>
      
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex w-full justify-between items-start">
              <div>
                <AlertDialogTitle className="text-2xl font-bold text-center">
                  Contact Us
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-center mt-1 text-gray-600">
                  Send us a message and we&apos;ll get back to you soon.
                </AlertDialogDescription>
              </div>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </AlertDialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* User Info Display */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                Sending as:{" "}
                <span className="font-semibold">{user?.email}</span>
              </p>
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subject
              </label>
              <Input
                id="subject"
                type="text"
                placeholder="Enter subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Enter your message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
                disabled={loading}
                rows={5}
                className="w-full resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={16} />
                  Sending...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2" size={16} />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {/* Footer */}
      <footer className="w-full border-t bg-primary/10 px-6 py-8 text-center text-sm text-color-foreground/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div onClick={() => router.push('https://github.com/sutirtha0505/jeevanamrit')} className="cursor-pointer flex justify-center items-center">
            <Image
              src="/android-chrome-192x192.png"
              alt="Jeevanamrit Logo"
              width={24}
              height={24}
              className="inline-block mb-1"
            />
            <span className="ml-2">
              © {new Date().getFullYear()} जीवनामृत. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
