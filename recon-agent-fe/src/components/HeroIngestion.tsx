import { UploadCloud, Loader2 } from "lucide-react";

interface Props {
  onLedgerDrop: (file: File) => void;
  onBankDrop: (file: File) => void;
  ledgerFile: File | null;
  bankFile: File | null;
  onRun: () => void;
  isLoading: boolean;
}

export default function HeroIngestion({
  onLedgerDrop,
  onBankDrop,
  ledgerFile,
  bankFile,
  onRun,
  isLoading,
}: Props) {
  const FileDropZone = ({
    label,
    file,
    onDrop,
  }: {
    label: string;
    file: File | null;
    onDrop: (f: File) => void;
  }) => (
    <div className="relative flex flex-col items-center justify-center w-full max-w-85 md:max-w-none md:w-64 h-[clamp(100px,15vh,160px)] bg-[#28282a] border border-white/40 backdrop-blur-md rounded-2xl p-4 text-center cursor-pointer hover:bg-white/10 transition-all">
      <input
        type="file"
        accept=".csv"
        onChange={(e) => e.target.files?.[0] && onDrop(e.target.files[0])}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <UploadCloud className="w-8 h-8 text-white mb-2" />
      <p className="text-sm font-medium text-white truncate w-full px-2">
        {file ? file.name : `Drop ${label} CSV`}
      </p>
      <p className="text-xs text-[#8e8e8e] mt-1">
        {file ? "Ready" : "Click or drag file"}
      </p>
    </div>
  );

  return (
    <div
      className="flex flex-col items-center gap-[clamp(16px,3vh,32px)] w-full px-4 anim-reveal"
      style={{ animationDelay: "0.28s" }}
    >
      <p className="max-w-[min(500px,100%)] text-center text-[#d0d0d0] opacity-80 leading-[1.55] font-sans text-[clamp(14px,calc(1.55vw+2px),18.5px)]">
        Build applications that reason, adapt and collaborate using a modular AI
        platform designed for production.
      </p>

      <div className="flex flex-col sm:flex-row gap-[clamp(12px,2vh,24px)] w-full justify-center items-center">
        <FileDropZone label="Ledger" file={ledgerFile} onDrop={onLedgerDrop} />
        <FileDropZone
          label="Bank Statement"
          file={bankFile}
          onDrop={onBankDrop}
        />
      </div>

      <button
        onClick={onRun}
        disabled={isLoading || !ledgerFile || !bankFile}
        className="group relative flex items-center justify-center bg-white text-black font-semibold rounded-full min-w-50 shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_0_22px_rgba(255,255,255,0.32),0_0_44px_rgba(255,255,255,0.12)] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 hover:scale-[1.02] p-[clamp(11px,1.6vh,13px)_clamp(22px,3vw,28px)] text-[clamp(13.5px,1.5vw,14.5px)] anim-reveal"
        style={{ animationDelay: "0.4s" }}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Run Reconciliation"
        )}
      </button>
    </div>
  );
}
