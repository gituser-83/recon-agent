import { UploadCloud, type LucideIcon } from "lucide-react";

interface FileDropzoneProps {
  label: string;
  formatText: string;
  icon: LucideIcon;
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export default function FileDropzone({
  label,
  formatText,
  icon: Icon,
  file,
  onFileChange,
}: FileDropzoneProps) {
  return (
    <div className="relative group border-2 border-secondary bg-background p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:border-accent hover:shadow-[0_0_20px_var(--color-accent)] hover:-translate-y-1">
      <input
        type="file"
        accept=".csv"
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="w-14 h-14 border border-secondary bg-background shadow-[0_0_10px_var(--color-secondary)] flex items-center justify-center mb-4 group-hover:border-accent group-hover:shadow-[0_0_15px_var(--color-accent)] transition-all duration-300">
        <Icon className="w-6 h-6 text-text group-hover:text-accent transition-colors" />
      </div>
      <h3 className="font-heading text-xl font-bold text-text uppercase tracking-wider">
        {label}
      </h3>
      <p className="font-body text-sm text-text/60 mt-2 mb-4 leading-relaxed">
        {formatText}
      </p>
      {file ? (
        <span className="font-body text-base font-bold px-4 py-2 bg-primary text-background uppercase tracking-widest shadow-[0_0_15px_var(--color-primary)] truncate max-w-62.5">
          {file.name}
        </span>
      ) : (
        <div className="flex items-center gap-2 font-body text-base font-bold text-secondary uppercase tracking-widest group-hover:text-accent transition-colors">
          <UploadCloud className="w-5 h-5" /> Place Your Bets (Upload)
        </div>
      )}
    </div>
  );
}
