import { motion } from "framer-motion";
import { User, Bell, Clock, Palette, Shield, ChevronRight, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const sections = [
  { icon: User, label: "Dados pessoais", desc: "Nome, email, foto" },
  { icon: Bell, label: "Notificações", desc: "Lembretes e alertas" },
  { icon: Clock, label: "Rotina", desc: "Horários e preferências" },
  { icon: Palette, label: "Aparência", desc: "Tema e personalização" },
  { icon: Shield, label: "Privacidade", desc: "Dados e segurança" },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Perfil</h1>

      {/* User card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50 mb-6"
      >
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">L</div>
        <div>
          <p className="font-bold text-lg">Lucas Silva</p>
          <p className="text-sm text-muted-foreground">lucas@email.com</p>
          <p className="text-xs text-primary mt-1">Plano Premium ✨</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { label: "Tarefas", value: "142" },
          { label: "Hábitos", value: "15 dias" },
          { label: "Desde", value: "Jan/25" },
        ].map((s) => (
          <div key={s.label} className="text-center p-3 rounded-2xl bg-muted/50">
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="space-y-1">
        {sections.map((s, i) => (
          <motion.button key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-muted/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <s.icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </motion.button>
        ))}
      </div>

      <button onClick={() => navigate("/")} className="w-full flex items-center justify-center gap-2 mt-6 py-3 rounded-2xl text-destructive text-sm font-medium hover:bg-destructive/5 transition-colors">
        <LogOut className="w-4 h-4" />
        Sair da conta
      </button>
    </div>
  );
}
