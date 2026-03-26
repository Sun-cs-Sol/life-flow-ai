import { motion } from "framer-motion";
import { Target, TrendingUp, Award, ChevronRight } from "lucide-react";
import { mockCareerGoals } from "@/data/mockData";

const skills = [
  { name: "SQL", level: 60 }, { name: "React", level: 75 }, { name: "Python", level: 40 },
  { name: "Git", level: 80 }, { name: "AWS", level: 20 },
];

export default function CareerPage() {
  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-5">Carreira</h1>

      {/* Goals */}
      <h2 className="text-sm font-semibold mb-3">Metas profissionais</h2>
      <div className="space-y-2 mb-6">
        {mockCareerGoals.map((g, i) => (
          <motion.div key={g.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="p-4 rounded-2xl bg-card border border-border/50"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">{g.title}</p>
              {g.progress === 100 && <Award className="w-4 h-4 text-warning" />}
            </div>
            <div className="w-full h-2 rounded-full bg-muted">
              <div className={`h-full rounded-full transition-all ${g.progress === 100 ? "bg-success" : "bg-primary"}`}
                style={{ width: `${g.progress}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">{g.progress}% • {g.status}</p>
          </motion.div>
        ))}
      </div>

      {/* Skills */}
      <h2 className="text-sm font-semibold mb-3">Competências</h2>
      <div className="space-y-3 mb-6">
        {skills.map((s) => (
          <div key={s.name} className="flex items-center gap-3">
            <span className="text-xs font-medium w-12">{s.name}</span>
            <div className="flex-1 h-2 rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${s.level}%` }} />
            </div>
            <span className="text-[10px] text-muted-foreground w-8 text-right">{s.level}%</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <h2 className="text-sm font-semibold mb-3">Próximas ações</h2>
      {["Estudar SQL avançado", "Atualizar currículo", "Aplicar para 3 vagas", "Concluir projeto portfólio"].map((a, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 mb-2">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-sm">{a}</span>
        </div>
      ))}
    </div>
  );
}
