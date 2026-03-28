import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Award, ChevronDown, ChevronUp, Plus, Globe, Code, FileText, Upload } from "lucide-react";
import { mockCareerGoals, mockSkills, mockLanguages, mockCertifications, mockFutureGoals } from "@/data/mockData";
import mascotIcon from "@/assets/mascot-icon.png";

export default function CareerPage() {
  const [showGoals, setShowGoals] = useState(true);
  const [showSkills, setShowSkills] = useState(true);
  const [showLangs, setShowLangs] = useState(true);
  const [showCerts, setShowCerts] = useState(true);
  const [showFuture, setShowFuture] = useState(true);
  const [newAction, setNewAction] = useState("");
  const [actions, setActions] = useState(["Estudar SQL avançado", "Atualizar currículo", "Aplicar para 3 vagas", "Concluir projeto portfólio"]);

  const addAction = () => {
    if (!newAction.trim()) return;
    setActions(prev => [...prev, newAction.trim()]);
    setNewAction("");
  };

  const Section = ({ title, icon: Icon, open, toggle, children }: { title: string; icon: any; open: boolean; toggle: () => void; children: React.ReactNode }) => (
    <div className="mb-4">
      <button onClick={toggle} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">{title}</h2>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <img src={mascotIcon} alt="Astra" className="w-8 h-8 mascot-img" />
        <h1 className="text-2xl font-bold">Carreira</h1>
      </div>

      {/* Import resume */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/30 border border-border/50 mb-5 cursor-pointer hover:bg-secondary/50 transition-colors"
      >
        <Upload className="w-5 h-5 text-secondary-foreground" />
        <div className="flex-1">
          <p className="text-sm font-medium">Importar currículo</p>
          <p className="text-[10px] text-muted-foreground">PDF ou DOCX para preencher automaticamente</p>
        </div>
      </motion.div>

      {/* Goals */}
      <Section title="Metas profissionais" icon={Target} open={showGoals} toggle={() => setShowGoals(!showGoals)}>
        <div className="space-y-2">
          {mockCareerGoals.map((g, i) => (
            <motion.div key={g.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="p-4 rounded-2xl bg-card border border-border/50"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">{g.title}</p>
                {g.progress === 100 && <Award className="w-4 h-4 text-warning" />}
              </div>
              <div className="w-full h-2 rounded-full bg-muted">
                <div className={`h-full rounded-full transition-all ${g.progress === 100 ? "bg-accent" : "bg-primary"}`} style={{ width: `${g.progress}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">{g.progress}% • {g.status}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Skills */}
      <Section title="Competências" icon={Code} open={showSkills} toggle={() => setShowSkills(!showSkills)}>
        <div className="space-y-3">
          {mockSkills.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="text-xs font-medium w-12">{s.name}</span>
              <div className="flex-1 h-2 rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${s.level}%` }} />
              </div>
              <span className="text-[10px] text-muted-foreground w-8 text-right">{s.level}%</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Languages */}
      <Section title="Idiomas" icon={Globe} open={showLangs} toggle={() => setShowLangs(!showLangs)}>
        <div className="space-y-2">
          {mockLanguages.map((l) => (
            <div key={l.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <span className="text-sm font-medium">{l.name}</span>
              <span className="text-xs text-muted-foreground">{l.level}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Certifications */}
      <Section title="Certificações" icon={Award} open={showCerts} toggle={() => setShowCerts(!showCerts)}>
        <div className="space-y-2">
          {mockCertifications.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/50">
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                {c.deadline && <p className="text-[10px] text-muted-foreground">Prazo: {c.deadline}</p>}
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${c.status === "concluído" ? "bg-accent/20 text-accent-foreground" : "bg-primary/10 text-primary"}`}>
                {c.status}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Future goals */}
      <Section title="Objetivos futuros" icon={Target} open={showFuture} toggle={() => setShowFuture(!showFuture)}>
        <div className="space-y-2">
          {mockFutureGoals.map((g, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <span className="text-primary">•</span>
              <span className="text-sm">{g}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Quick actions */}
      <h2 className="text-sm font-semibold mb-3 mt-2">Próximas ações</h2>
      <div className="flex gap-2 mb-3">
        <input placeholder="Nova ação..." value={newAction} onChange={e => setNewAction(e.target.value)} onKeyDown={e => e.key === "Enter" && addAction()}
          className="flex-1 text-sm p-2.5 rounded-xl bg-muted/50 border border-border/50 outline-none focus:ring-1 focus:ring-primary" />
        <button onClick={addAction} className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
          <Plus className="w-4 h-4 text-primary-foreground" />
        </button>
      </div>
      {actions.map((a, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 mb-2">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-sm">{a}</span>
        </div>
      ))}
    </div>
  );
}
