import { motion } from "framer-motion";
import { FolderKanban, CheckCircle2, Circle } from "lucide-react";
import { mockProjects } from "@/data/mockData";

export default function ProjectsPage() {
  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-5">Projetos</h1>

      <div className="space-y-4">
        {mockProjects.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl bg-card border border-border/50"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <FolderKanban className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.description}</p>
              </div>
            </div>
            <div className="w-full h-2 rounded-full bg-muted mb-2">
              <div className="h-full rounded-full bg-primary" style={{ width: `${p.progress}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground mb-3">{p.progress}% concluído • {p.completedTasks}/{p.tasks.length} tarefas</p>
            <div className="space-y-1.5">
              {p.tasks.map((t, ti) => (
                <div key={ti} className="flex items-center gap-2">
                  {ti < p.completedTasks
                    ? <CheckCircle2 className="w-4 h-4 text-primary" />
                    : <Circle className="w-4 h-4 text-muted-foreground" />
                  }
                  <span className={`text-xs ${ti < p.completedTasks ? "text-muted-foreground line-through" : ""}`}>{t}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
