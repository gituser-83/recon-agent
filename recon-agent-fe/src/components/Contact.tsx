import { useState } from "react";
import { Mail, Send, MessageSquare, User } from "lucide-react";
import axios from "axios";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

      if (!WEB3FORMS_ACCESS_KEY) {
        throw new Error("Missing Web3Forms Access Key");
      }

      await axios.post("https://api.web3forms.com/submit", {
        access_key: WEB3FORMS_ACCESS_KEY,
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Transmission failed:", error);
      alert(
        "Transmission failed. Please check your configuration and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="w-full max-w-xl mx-auto flex flex-col items-center justify-center anim-reveal shrink-0"
      style={{ animationDelay: "200ms" }}
    >
      <div className="w-full bg-[#1a1a1c]/80 border border-white/20 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="font-display text-[clamp(20px,3vw,30px)] text-white mb-2 tracking-wide">
            Initiate Contact
          </h2>
          <p className="text-[#8e8e8e] font-sans text-xs md:text-sm leading-relaxed">
            Thank you for your precious time.
          </p>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center anim-reveal">
            <div className="w-12 h-12 bg-white/10 border border-white/30 rounded-full flex items-center justify-center mb-4">
              <Send className="w-5 h-5 text-white ml-1" />
            </div>
            <h3 className="font-display text-white text-xl mb-2">
              Transmission Sent
            </h3>
            <p className="text-[#8e8e8e] font-sans text-sm">
              Our systems have logged your inquiry.
              <br />
              We will respond shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-white/40" />
              </div>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Designation / Name"
                className="w-full bg-black/40 border border-white/10 text-white placeholder-white/40 rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:border-white/40 transition-colors font-sans text-sm"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-white/40" />
              </div>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enterprise Email"
                className="w-full bg-black/40 border border-white/10 text-white placeholder-white/40 rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:border-white/40 transition-colors font-sans text-sm"
              />
            </div>

            <div className="relative">
              <div className="absolute top-3 left-4 pointer-events-none">
                <MessageSquare className="w-4 h-4 text-white/40" />
              </div>
              <textarea
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="System Requirements..."
                rows={3}
                className="w-full bg-black/40 border border-white/10 text-white placeholder-white/40 rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:border-white/40 transition-colors font-sans text-sm resize-none custom-scrollbar"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 group relative flex items-center justify-center bg-white text-black font-semibold rounded-full w-full shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_0_22px_rgba(255,255,255,0.32),0_0_44px_rgba(255,255,255,0.12)] disabled:opacity-50 transition-all hover:-translate-y-0.5 hover:scale-[1.02] p-[clamp(8px,1.2vh,11px)_clamp(22px,3vw,28px)] text-[clamp(12.5px,1.5vw,13.5px)]"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Transmitting...</span>
              ) : (
                "Transmit Request"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
