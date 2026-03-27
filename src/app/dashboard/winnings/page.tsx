import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { WinnerBanner } from "@/components/winner/WinnerBanner";
import { WinningsHistory } from "@/components/winner/WinningsHistory";
import { ProofUploadForm } from "@/components/winner/ProofUploadForm";
import { WinnerVerification } from "@/types";

export default async function WinningsPage() {
  const supabase = await createClient();

  // 1. Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // 2. Fetch verifications for this user
  const { data: verifications, error } = await supabase
    .from("winner_verifications")
    .select(`
      *,
      draw_entries (
        match_count,
        prize_amount_pence,
        matched_numbers,
        scores_snapshot,
        draws (
          draw_date,
          drawn_numbers,
          draw_mode
        )
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch winnings error:", error);
  }

  const typedVerifications = (verifications || []) as WinnerVerification[];
  
  // Calculate total winnings (already approved or paid)
  const totalWinnings = typedVerifications
    .filter(v => v.status === 'approved' || v.status === 'paid')
    .reduce((sum, v) => sum + (v.draw_entry?.prize_amount_pence || 0), 0);

  // Find if any proof is needed
  const activeProofRequest = typedVerifications.find(v => 
    v.status === 'awaiting_proof' || v.status === 'rejected'
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      {/* Header with Title */}
      <div className="space-y-2">
        <h1 className="text-5xl font-black italic tracking-tighter text-white">
          MY <span className="text-emerald-500">WINNINGS</span>
        </h1>
        <p className="text-zinc-500 font-medium">Track your prize history and verify tournament results.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {totalWinnings > 0 && (
            <WinnerBanner totalAmount={totalWinnings} />
          )}

          <WinningsHistory verifications={typedVerifications} />
        </div>

        <aside className="lg:col-span-1 space-y-8">
          {activeProofRequest ? (
            <ProofUploadForm 
              verificationId={activeProofRequest.id}
              drawDate={(activeProofRequest.draw_entry as any)?.draws?.draw_date || 'N/A'}
              prizeAmount={activeProofRequest.draw_entry?.prize_amount_pence || 0}
            />
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-600">
                <SearchIcon className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-white uppercase tracking-tighter leading-tight">No actions required</h4>
                <p className="text-zinc-500 text-sm font-medium">Verify your scores after each draw to claim potential prizes.</p>
              </div>
            </div>
          )}

          {/* Tips / Info Sidebar Extra */}
          <div className="p-8 bg-zinc-950/50 border border-zinc-800 rounded-3xl space-y-4">
             <h5 className="text-xs font-black text-white uppercase tracking-widest">Verification Tips</h5>
             <ul className="space-y-3">
                <li className="flex gap-2 text-xs text-zinc-500">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1 shrink-0" />
                   <span>Ensure your scorecard screenshot clearly shows the course name, date, and verified signature.</span>
                </li>
                <li className="flex gap-2 text-xs text-zinc-500">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1 shrink-0" />
                   <span>Payouts are typically processed within 5 business days after verification approval.</span>
                </li>
             </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      strokeWidth="2.5" 
      stroke="currentColor" 
      fill="none" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
      <path d="M21 21l-6 -6" />
    </svg>
  );
}
