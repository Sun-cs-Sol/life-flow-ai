import { motion } from "framer-motion";
import { BookOpen, FileText, Clock, ChevronRight } from "lucide-react";
import { mockSubjects } from "@/data/mockData";

export default function StudiesPage() {
  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-5">Estudos</h1>

      {/* Upcoming exams */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-3">Próximas provas</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-warning/5 border border-warning/20">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Banco de Dados</p>
              <p className="text-xs text-muted-foreground">Amanhã • Prova P2</p>
            </div>
            <span className="text-xs font-medium text-warning bg-warning/10 px-2 py-1 rounded-full">Urgente</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border/50">
            <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-info" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">IHC</p>
              <p className="text-xs text-muted-foreground">Em 10 dias • Trabalho final</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subjects */}
      <h2 className="text-sm font-semibold mb-3">Disciplinas</h2>
      <div className="space-y-2">
        {mockSubjects.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
              <BookOpen className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{s.name}</p>
              <p className="text-xs text-muted-foreground">{s.professor} • {s.schedule}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">Próxima prova</p>
              <p className="text-xs font-semibold">{s.nextExam}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Study sessions */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold mb-3">Sessões de estudo recentes</h2>
        <div className="space-y-2">
          {["Banco de Dados — 2h de revisão", "IHC — Leitura do capítulo 5", "Dev Web — Prática de React"].map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
