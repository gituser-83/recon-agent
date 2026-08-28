import { useState } from "react";
import {
  ShieldCheck,
  RotateCcw,
  Filter,
  CheckCircle2,
  Receipt,
} from "lucide-react";

const FlipCard = ({ match }: { match: any }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const hasFee = match.calculated_fee_percentage > 0;

  return (
    <div className="relative w-full h-55 perspective-[1000px] group">
      <div
        className={`w-full h-full transition-all duration-500 transform-3d ${isFlipped ? "transform-[rotateY(180deg)]" : ""}`}
      >
        <div className="absolute inset-0 backface-hidden bg-[#1a1a1c]/90 border border-white/10 hover:border-white/30 rounded-xl p-5 flex flex-col justify-between transition-colors shadow-lg">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#8e8e8e]" />
                <span className="font-display text-white text-sm truncate max-w-30">
                  {match.bank_id}
                </span>
              </div>
              <span
                className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-sm border ${hasFee ? "border-[#e13af1]/40 text-[#e13af1] bg-[#e13af1]/10" : "border-[#72f5b1]/40 text-[#72f5b1] bg-[#72f5b1]/10"}`}
              >
                {hasFee
                  ? `${match.calculated_fee_percentage}% Fee`
                  : "Direct Clear"}
              </span>
            </div>
            <p className="text-xs text-[#8e8e8e] uppercase tracking-wider mb-2">
              Matched Ledgers
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-15 overflow-hidden">
              {match.matched_ledger_ids?.map((id: string, i: number) => (
                <span
                  key={i}
                  className="bg-white/5 border border-white/10 text-[#c4c2c3] px-1.5 py-0.5 rounded font-sans text-[10px]"
                >
                  {id}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => setIsFlipped(true)}
            className="w-full py-2 flex items-center justify-center gap-2 bg-[#28282a] hover:bg-white text-white hover:text-black rounded-lg text-xs font-semibold uppercase tracking-widest transition-all"
          >
            Inspect Logic <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        <div className="absolute inset-0 backface-hidden transform-[rotateY(180deg)] bg-[#28282a] border border-white/30 rounded-xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
              <CheckCircle2 className="w-4 h-4 text-[#72f5b1]" />
              <span className="text-[11px] text-white uppercase tracking-widest font-semibold">
                AI Reasoning
              </span>
            </div>
            <p className="text-[12px] text-[#c4c2c3] leading-relaxed font-sans max-h-22.5 overflow-y-auto custom-scrollbar pr-2">
              {match.reasoning}
            </p>
          </div>
          <button
            onClick={() => setIsFlipped(false)}
            className="w-full py-2 flex items-center justify-center gap-2 bg-black/40 hover:bg-black text-white rounded-lg text-xs font-semibold uppercase tracking-widest border border-white/10 hover:border-white/30 transition-all"
          >
            <RotateCcw className="w-3 h-3" /> Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AuditTrail({ agentMatches }: { agentMatches: any[] }) {
  const [filter, setFilter] = useState<"all" | "fee" | "direct">("all");

  if (!agentMatches?.length) return null;

  const filteredMatches = agentMatches.filter((m) => {
    if (filter === "fee") return m.calculated_fee_percentage > 0;
    if (filter === "direct") return m.calculated_fee_percentage === 0;
    return true;
  });

  return (
    <div className="flex-1 min-h-100 h-[clamp(400px,50vh,600px)] bg-black/40 border border-white/20 backdrop-blur-xl rounded-2xl p-5 flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-4 mb-4 gap-4 shrink-0">
        <h3 className="font-display text-white text-lg flex items-center gap-2 tracking-wide">
          <ShieldCheck className="w-5 h-5" /> AI Audit Trail
        </h3>
        <div className="flex items-center gap-2 bg-[#1a1a1c] p-1 rounded-lg border border-white/10">
          <Filter className="w-3.5 h-3.5 text-[#8e8e8e] ml-2" />
          {["all", "fee", "direct"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-md transition-all ${filter === f ? "bg-white text-black" : "text-[#8e8e8e] hover:text-white hover:bg-white/5"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {filteredMatches.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[#8e8e8e] text-sm font-medium">
            No matches found for this filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
            {filteredMatches.map((match, idx) => (
              <FlipCard key={idx} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
