import { useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import HeroIngestion from "./components/HeroIngestion";
import ExceptionQueue from "./components/ExceptionQueue";
import AuditTrail from "./components/AuditTrail";
import StatsFooter from "./components/StatsFooter";
import Contact from "./components/Contact";

export default function App() {
  const [currentView, setCurrentView] = useState<"home" | "contact">("home");
  const [ledgerFile, setLedgerFile] = useState<File | null>(null);
  const [bankFile, setBankFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleReconcile = async () => {
    if (!ledgerFile || !bankFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("ledger", ledgerFile);
    formData.append("bank", bankFile);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

      const response = await axios.post(`${API_URL}/api/reconcile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResults(response.data);
    } catch (error) {
      console.error("Reconciliation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-dvh w-full overflow-hidden relative flex flex-col bg-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4"
      />

      <div className="relative z-10 flex flex-col h-full w-full">
        <Header currentView={currentView} setCurrentView={setCurrentView} />

        <main className="flex-1 flex flex-col items-center justify-start px-4 w-full max-w-350 mx-auto overflow-y-auto min-h-0 py-6 custom-scrollbar">
          {currentView === "contact" ? (
            <Contact />
          ) : (
            <>
              <div className="flex flex-col items-center mb-8 text-center shrink-0">
                <h1 className="font-display text-[clamp(28px,5.6vw,72px)] text-black tracking-[-0.08em] md:tracking-[-0.04em] leading-[1.12]">
                  <span
                    className="anim-headline-line block"
                    style={{ animationDelay: "120ms" }}
                  >
                    Intelligence
                  </span>
                  <span
                    className="anim-headline-line text-black min-[1900px]:text-white"
                    style={{ animationDelay: "300ms" }}
                  >
                    Designed To Evolve
                  </span>
                </h1>
              </div>

              <div
                className="w-full flex justify-center anim-reveal shrink-0"
                style={{ animationDelay: "400ms" }}
              >
                {!results ? (
                  <HeroIngestion
                    onLedgerDrop={setLedgerFile}
                    onBankDrop={setBankFile}
                    ledgerFile={ledgerFile}
                    bankFile={bankFile}
                    onRun={handleReconcile}
                    isLoading={isLoading}
                  />
                ) : (
                  <div className="flex flex-col lg:flex-row w-full gap-4 md:gap-6 px-0 sm:px-4 pb-8 items-start justify-center">
                    <AuditTrail agentMatches={results.data.agent_matched} />
                    <ExceptionQueue exceptions={results.data.exceptions} />
                  </div>
                )}
              </div>
            </>
          )}
        </main>

        {results && currentView === "home" && <StatsFooter results={results} />}
      </div>
    </div>
  );
}
