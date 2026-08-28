import { AlertTriangle, ChevronRight, XCircle } from "lucide-react";

export default function ExceptionQueue({ exceptions }: { exceptions: any[] }) {
  if (!exceptions?.length) return null;

  return (
    <div className="w-full lg:w-95 shrink-0 min-h-100 h-[clamp(400px,50vh,600px)] bg-black/40 border border-white/20 backdrop-blur-xl rounded-2xl p-5 flex flex-col">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 shrink-0">
        <h3 className="font-display text-white text-lg flex items-center gap-2 tracking-wide">
          <AlertTriangle className="w-5 h-5 text-white" /> Manual Review
        </h3>
        <span className="text-[10px] font-bold text-black bg-white px-2 py-0.5 rounded-sm uppercase tracking-widest">
          {exceptions.length} Pending
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div className="flex flex-col gap-3 pb-4">
          {exceptions.map((exc, idx) => (
            <div
              key={idx}
              className="group relative bg-[#1a1a1c]/80 border border-white/10 hover:border-white/30 rounded-xl p-4 flex flex-col gap-3 transition-all duration-300 hover:bg-[#28282a]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="w-3.5 h-3.5 text-[#e13af1]" />
                  <span className="text-[10px] text-[#8e8e8e] uppercase tracking-widest font-bold">
                    Bank Ref
                  </span>
                </div>
                <span className="font-display text-white text-xs px-2 py-1 bg-white/5 rounded border border-white/10">
                  {exc.bank_id}
                </span>
              </div>
              <div className="bg-black/30 rounded-lg p-2.5 border border-white/5">
                <p className="text-[11px] text-[#c4c2c3] leading-relaxed font-sans">
                  {exc.hypothesis}
                </p>
              </div>
              <button className="w-full flex items-center justify-between text-[#8e8e8e] hover:text-white text-[10px] uppercase font-bold tracking-widest transition-colors mt-1">
                <span>Investigate Case</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
