import { useState, useEffect } from "react";

interface HeaderProps {
  currentView: "home" | "contact";
  setCurrentView: (view: "home" | "contact") => void;
}

export default function Header({ currentView, setCurrentView }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "contact", label: "Contact" },
  ];

  const handleNav = (id: "home" | "contact") => {
    setCurrentView(id);
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full flex items-center justify-between px-4 md:px-8 py-4 md:py-6 max-w-350 mx-auto anim-header shrink-0 relative z-50">
      <button
        onClick={() => setCurrentView("home")}
        className="w-[clamp(40px,4.4vw,46px)] h-[clamp(40px,4.4vw,46px)] bg-white rounded-full flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.16)] hover:scale-105 transition-transform z-50"
      >
        <div className="font-display text-black text-lg leading-none tracking-tighter">
          RA
        </div>
      </button>

      <nav className="hidden md:flex items-center bg-white h-[clamp(44px,5.2vw,48px)] rounded-full px-2 shadow-[0_4px_14px_rgba(0,0,0,0.16)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNav(item.id as "home" | "contact")}
            className={`relative px-4 py-2 text-[clamp(13px,1.4vw,15px)] font-medium font-sans tracking-tight transition-opacity ${currentView === item.id ? "text-[#2e2e2e] opacity-100" : "text-[#2e2e2e] opacity-50 hover:opacity-75"}`}
          >
            {item.label}
            {currentView === item.id && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                <div className="w-0.75 h-0.75 bg-black rounded-full" />
                <div className="w-0.75 h-0.75 bg-black rounded-full" />
                <div className="w-0.75 h-0.75 bg-black rounded-full" />
              </div>
            )}
          </button>
        ))}
      </nav>

      <div className="hidden md:flex items-center gap-2 bg-[#28282a] h-[clamp(44px,5.2vw,48px)] px-5 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.16)] border border-white/10">
        <div className="relative flex h-2 w-2">
          <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></div>
          <div className="relative inline-flex h-2 w-2 rounded-full bg-white"></div>
        </div>
        <span className="text-[#c8c8c8] font-sans text-[clamp(13px,1.4vw,15px)] font-medium">
          System Online
        </span>
      </div>

      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden w-12 h-12 bg-[#28282a] rounded-full flex flex-col items-center justify-center gap-1.5 z-50 border border-white/10"
      >
        <span
          className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-[7.5px]" : ""}`}
        />
        <span
          className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
        />
        <span
          className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${isMenuOpen ? "-rotate-45 translate-y-[-7.5px]" : ""}`}
        />
      </button>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex flex-col justify-end p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-overlay-in"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="relative bg-white w-full rounded-[28px] p-6 pb-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] flex flex-col gap-4 animate-menu-in">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id as "home" | "contact")}
                className="text-left font-sans text-xl font-semibold text-[#2e2e2e] py-3 border-b border-black/5 last:border-0"
              >
                {item.label}
              </button>
            ))}
            <div className="mt-4 flex items-center justify-center gap-2 bg-[#28282a] py-4 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white font-sans font-medium">
                System Online
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
