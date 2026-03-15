import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";

type AuthMode = "login" | "signup";

export function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
      }
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setError(null);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#0a0a0a] px-4">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(0, 212, 255, 0.06), transparent)",
        }}
      />

      <div className="glass relative w-full max-w-sm rounded-2xl p-8">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-wider text-[#e2e8f0]">
            <span className="text-[#00d4ff]">J</span>ARVIS
          </h1>
          <p className="mt-2 text-sm text-[#94a3b8]">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-[#94a3b8] mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg bg-[#0a0a0a]/60 border border-[rgba(0,212,255,0.15)] px-4 py-2.5 text-sm text-[#e2e8f0] placeholder-[#4a5568] outline-none transition-colors focus:border-[#00d4ff]/40 focus:ring-1 focus:ring-[#00d4ff]/20"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-[#94a3b8] mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={6}
              className="w-full rounded-lg bg-[#0a0a0a]/60 border border-[rgba(0,212,255,0.15)] px-4 py-2.5 text-sm text-[#e2e8f0] placeholder-[#4a5568] outline-none transition-colors focus:border-[#00d4ff]/40 focus:ring-1 focus:ring-[#00d4ff]/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-[#00d4ff]/15 border border-[#00d4ff]/30 px-4 py-2.5 text-sm font-medium text-[#00d4ff] transition-all hover:bg-[#00d4ff]/25 hover:border-[#00d4ff]/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === "login" ? (
              <LogIn className="w-4 h-4" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            {mode === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        {/* Toggle mode */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-xs text-[#94a3b8] hover:text-[#00d4ff] transition-colors"
          >
            {mode === "login"
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
