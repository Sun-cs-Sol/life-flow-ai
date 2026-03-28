import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import mascotIcon from "@/assets/mascot-icon.png";

const slides = [
  {
    title: "Sua vida organizada\ncom inteligência",
    description: "O Astra entende o que você fala e organiza automaticamente nos módulos certos.",
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < slides.length - 1) setStep(step + 1);
    else navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center max-w-sm"
          >
            <img
              src={mascotIcon}
              alt="Astra mascot"
              className="mascot-img w-28 h-28 mb-6"
            />
            <h1 className="text-3xl font-bold leading-tight whitespace-pre-line mb-4">{slides[step].title}</h1>
            <p className="text-muted-foreground text-base leading-relaxed">{slides[step].description}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 pb-10">
        <div className="flex items-center justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-8 bg-primary" : "w-2 bg-border"}`} />
          ))}
        </div>
        <button onClick={handleNext}
          className="w-full h-14 rounded-2xl gradient-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          {step < slides.length - 1 ? "Continuar" : "Começar agora"}
          <ArrowRight className="w-5 h-5" />
        </button>
        {step < slides.length - 1 && (
          <button onClick={() => navigate("/login")} className="w-full mt-3 text-muted-foreground text-sm py-2">
            Pular
          </button>
        )}
      </div>
    </div>
  );
}
