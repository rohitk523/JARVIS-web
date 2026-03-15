import { useNavigate } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";
import { supabase } from "../lib/supabase";

export function SettingsPage() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-[#0a0a0a]">
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-[rgba(0,212,255,0.1)]">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="p-2 rounded-lg text-[#94a3b8] hover:text-[#00d4ff] hover:bg-[#1a1a2e]/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold tracking-wider text-[#e2e8f0]">Settings</h1>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4">
        <div className="glass rounded-2xl p-8 max-w-sm w-full text-center">
          <Construction className="w-12 h-12 text-[#00d4ff]/40 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-[#e2e8f0] mb-2">Settings coming soon.</h2>
          <p className="text-sm text-[#94a3b8]">
            Configuration options for voice, appearance, and integrations will be available here.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="text-sm text-[#94a3b8] hover:text-red-400 transition-colors"
        >
          Sign Out
        </button>
      </main>
    </div>
  );
}
