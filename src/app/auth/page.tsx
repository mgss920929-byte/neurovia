"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, ArrowLeft, Lock, Mail, User as UserIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!supabase) {
      setErrorMsg("Supabase client is not configured in this environment.");
      return;
    }

    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });
      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg(
          "Account created successfully! Please check your email for verification."
        );
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push("/");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#080D1A] text-[#F4F7FF] flex flex-col justify-center items-center px-4 py-12">
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#98A6BD] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3988EF] to-[#8065F5] mx-auto flex items-center justify-center shadow-xl shadow-[#3988EF]/20">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            {isSignUp ? "Create Your Neurovia Account" : "Welcome Back"}
          </h1>
          <p className="text-xs text-[#98A6BD]">
            Your mind. Your records. Your global competitive journey.
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-[#10182A] border border-[#26344C] rounded-2xl p-8 shadow-2xl space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#98A6BD]">
                  Username
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-[#98A6BD]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. NeuralSprinter"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#080D1A] border border-[#26344C] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#98A6BD] focus:outline-none focus:border-[#3988EF]"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#98A6BD]">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#98A6BD]" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#080D1A] border border-[#26344C] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#98A6BD] focus:outline-none focus:border-[#3988EF]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#98A6BD]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#98A6BD]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#080D1A] border border-[#26344C] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#98A6BD] focus:outline-none focus:border-[#3988EF]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3988EF] to-[#8065F5] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-[#3988EF]/20 transition-all disabled:opacity-50"
            >
              {loading ? "Processing..." : isSignUp ? "Create Free Account" : "Sign In"}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-[#98A6BD] hover:text-white transition-colors"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}