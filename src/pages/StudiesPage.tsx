import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, FileText, Clock, ChevronRight, GraduationCap, Plus, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { mockSubjects, mockCourses } from "@/data/mockData";
import mascotIcon from "@/assets/mascot-icon.png";

type Tab = "faculdade" | "cursos" | "cronograma";

export default function StudiesPage() {
  const [tab, setTab] = useState<Tab>("faculdade");
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const tabs: { label: string; value: Tab }[] = [
    { label: "Faculdade", value: "faculdade" },
    { label: "Cursos", value: "cursos" },
    { label: "Cronograma", value: "cronograma" },
  ];

  const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex"];
  const schedule = [
    { day: "Seg", items: [{ time: "19h", name: "Banco de Dados" }, { time: "21h", name: "Eng. Software" }] },
    { day: "Ter", items: [{ time: "19h", name: "IHC" }, { time: "21h", name: "Dev Web" }] },
    { day: "Qua", items: [{ time: "19h", name: "Banco de Dados" }, { time: "21h", name: "Eng. Software" }] },
    { day: "Qui", items: [{ time: "19h", name: "IHC" }, { time: "21h", name: "Dev Web" }] },
    { day: "Sex", items: [{ time: "20h", name: "Inglês Avançado" }] },
  ];

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Estudos</h1>
        <button className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center active:scale-95 transition-transform">
          <Plus className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {tabs.map(t => (
          <button key={t.value} onClick={() => setTab(t.value)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${tab === t.value ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >{t.label}</button>
        ))}
      </div>

      {tab === "faculdade" && (
        <>
          {/* Upcoming exams */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-3">Próximas provas</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-primary/5 border border-primary/20">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Banco de Dados</p>
                  <p className="text-xs text-muted-foreground">Amanhã • Prova P2</p>
                </div>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">Urgente</span>
              </div>
            </div>
          </div>

          {/* Subjects */}
          <h2 className="text-sm font-semibold mb-3">Disciplinas</h2>
          <div className="space-y-2">
            {mockSubjects.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <button onClick={() => setExpandedSubject(expandedSubject === s.id ? null : s.id)}
                  className="w-full text-left p-4 rounded-2xl bg-card border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                      <BookOpen className="w-5 h-5" style={{ color: s.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.professor} • {s.schedule}</p>
                    </div>
                    {expandedSubject === s.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>

                  {expandedSubject === s.id && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 pt-3 border-t border-border/50">
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center p-2 rounded-xl bg-muted/50">
                          <p className="text-lg font-bold">{s.grade ?? "-"}</p>
                          <p className="text-[9px] text-muted-foreground">Nota</p>
                        </div>
                        <div className="text-center p-2 rounded-xl bg-muted/50">
                          <p className="text-lg font-bold">{s.absences ?? 0}</p>
                          <p className="text-[9px] text-muted-foreground">Faltas</p>
                        </div>
                        <div className="text-center p-2 rounded-xl bg-muted/50">
                          <p className="text-lg font-bold">{s.totalClasses ?? 0}</p>
                          <p className="text-[9px] text-muted-foreground">Aulas</p>
                        </div>
                      </div>
                      {s.activities && s.activities.length > 0 && (
                        <>
                          <p className="text-xs font-medium mb-2">Atividades</p>
                          {s.activities.map((a, j) => (
                            <div key={j} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 mb-1">
                              <span className={`text-xs ${a.done ? "line-through text-muted-foreground" : ""}`}>{a.name}</span>
                              <span className="text-[10px] text-muted-foreground">{a.due}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </motion.div>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {tab === "cursos" && (
        <div className="space-y-3">
          {mockCourses.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="p-4 rounded-2xl bg-card border border-border/50"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{c.type}</p>
                </div>
                <span className="text-xs font-semibold text-primary">{c.progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted mb-3">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${c.progress}%` }} />
              </div>
              {c.activities.map((a, j) => (
                <div key={j} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 mb-1">
                  <span className={`text-xs ${a.done ? "line-through text-muted-foreground" : ""}`}>{a.name}</span>
                  <span className="text-[10px] text-muted-foreground">{a.due}</span>
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      )}

      {tab === "cronograma" && (
        <div className="space-y-3">
          {schedule.map((day) => (
            <div key={day.day} className="p-4 rounded-2xl bg-card border border-border/50">
              <p className="text-sm font-semibold mb-2">{day.day}</p>
              {day.items.map((item, j) => (
                <div key={j} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 mb-1">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground w-8">{item.time}</span>
                  <span className="text-xs font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
