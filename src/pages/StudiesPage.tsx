import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, GraduationCap, BookOpen, Clock, Trash2, Calendar,
  ChevronRight, Layers, Zap
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useStudiesStore, type CourseKind, type CourseArea } from "@/stores/studiesStore";
import { useFocusModeStore } from "@/stores/focusModeStore";

type Tab = "cursos" | "cronograma";

const COURSE_AREAS: { value: CourseArea; label: string }[] = [
  { value: "tecnologia", label: "Tecnologia" },
  { value: "saúde", label: "Saúde" },
  { value: "negócios", label: "Negócios" },
  { value: "idiomas", label: "Idiomas" },
  { value: "design", label: "Design" },
  { value: "outro", label: "Outro" },
];

const WEEK_DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export default function StudiesPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("cursos");
  const { courses, schedule, addCourse, deleteCourse, addScheduleItem, deleteScheduleItem } = useStudiesStore();

  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", kind: "" as CourseKind, area: "" as CourseArea });

  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [newScheduleItem, setNewScheduleItem] = useState({ day: "", time: "", courseName: "", topic: "" });

  const handleCreateCourse = () => {
    if (!newCourse.name.trim() || !newCourse.kind || !newCourse.area) {
      toast.error("Preencha todos os campos");
      return;
    }
    const id = addCourse({ name: newCourse.name.trim(), kind: newCourse.kind, area: newCourse.area });
    setNewCourse({ name: "", kind: "" as CourseKind, area: "" as CourseArea });
    setCourseDialogOpen(false);
    toast.success(`Curso "${newCourse.name}" criado!`);
    navigate(`/studies/${id}`);
  };

  const handleCreateScheduleItem = () => {
    if (!newScheduleItem.day || !newScheduleItem.time || !newScheduleItem.courseName.trim()) {
      toast.error("Preencha dia, horário e curso");
      return;
    }
    addScheduleItem(newScheduleItem);
    setNewScheduleItem({ day: "", time: "", courseName: "", topic: "" });
    setScheduleDialogOpen(false);
    toast.success("Horário adicionado!");
  };

  const groupedSchedule = WEEK_DAYS.map(day => ({
    day,
    items: schedule.filter(s => s.day === day).sort((a, b) => a.time.localeCompare(b.time)),
  })).filter(g => g.items.length > 0);

  const totalPending = courses.reduce(
    (sum, c) => sum + c.components.reduce((s2, comp) => s2 + comp.activities.filter(a => !a.done).length, 0), 0
  );

  return (
    <div className="px-4 py-5 max-w-lg mx-auto pb-28">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Estudos</h1>

        {tab === "cursos" ? (
          <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
            <DialogTrigger asChild>
              <button className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center active:scale-95 transition-transform">
                <Plus className="w-5 h-5 text-primary-foreground" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-sm mx-auto">
              <DialogHeader>
                <DialogTitle>Novo Curso</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-2">
                <Input
                  placeholder="Nome do curso"
                  value={newCourse.name}
                  onChange={e => setNewCourse(p => ({ ...p, name: e.target.value }))}
                />
                <Select value={newCourse.kind} onValueChange={v => setNewCourse(p => ({ ...p, kind: v as CourseKind }))}>
                  <SelectTrigger><SelectValue placeholder="Tipo de curso" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formação">Curso de Formação</SelectItem>
                    <SelectItem value="extensão">Curso de Extensão</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={newCourse.area} onValueChange={v => setNewCourse(p => ({ ...p, area: v as CourseArea }))}>
                  <SelectTrigger><SelectValue placeholder="Área / Temática" /></SelectTrigger>
                  <SelectContent>
                    {COURSE_AREAS.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <button
                  onClick={handleCreateCourse}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold active:scale-[0.98] transition-transform"
                >
                  Criar Curso
                </button>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
            <DialogTrigger asChild>
              <button className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center active:scale-95 transition-transform">
                <Plus className="w-5 h-5 text-primary-foreground" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-sm mx-auto">
              <DialogHeader>
                <DialogTitle>Novo Horário</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-2">
                <Select value={newScheduleItem.day} onValueChange={v => setNewScheduleItem(p => ({ ...p, day: v }))}>
                  <SelectTrigger><SelectValue placeholder="Dia da semana" /></SelectTrigger>
                  <SelectContent>
                    {WEEK_DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input type="time" value={newScheduleItem.time} onChange={e => setNewScheduleItem(p => ({ ...p, time: e.target.value }))} />
                <Input placeholder="Nome do curso" value={newScheduleItem.courseName} onChange={e => setNewScheduleItem(p => ({ ...p, courseName: e.target.value }))} />
                <Input placeholder="Tópico (opcional)" value={newScheduleItem.topic} onChange={e => setNewScheduleItem(p => ({ ...p, topic: e.target.value }))} />
                <button onClick={handleCreateScheduleItem} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold active:scale-[0.98] transition-transform">
                  Adicionar ao Cronograma
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 rounded-xl bg-primary/10 p-3 text-center">
          <p className="text-2xl font-bold text-primary">{courses.length}</p>
          <p className="text-[10px] text-muted-foreground">Cursos</p>
        </div>
        <div className="flex-1 rounded-xl bg-secondary/30 p-3 text-center">
          <p className="text-2xl font-bold text-foreground">{courses.reduce((s, c) => s + c.components.length, 0)}</p>
          <p className="text-[10px] text-muted-foreground">Componentes</p>
        </div>
        <div className="flex-1 rounded-xl bg-destructive/10 p-3 text-center">
          <p className="text-2xl font-bold text-destructive">{totalPending}</p>
          <p className="text-[10px] text-muted-foreground">Pendentes</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {([
          { label: "Cursos", value: "cursos" as Tab, icon: BookOpen },
          { label: "Cronograma", value: "cronograma" as Tab, icon: Calendar },
        ]).map(t => (
          <button key={t.value} onClick={() => setTab(t.value)}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold transition-colors ${tab === t.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "cursos" && (
          <motion.div key="cursos" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-3">
            {courses.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Nenhum curso cadastrado</p>
                <p className="text-xs mt-1">Toque no + para criar seu primeiro curso</p>
              </div>
            )}

            {courses.map((course, i) => {
              const pendingCount = course.components.reduce((s, c) => s + c.activities.filter(a => !a.done).length, 0);
              const totalActivities = course.components.reduce((s, c) => s + c.activities.length, 0);
              const doneActivities = course.components.reduce((s, c) => s + c.activities.filter(a => a.done).length, 0);
              const progress = totalActivities > 0 ? Math.round((doneActivities / totalActivities) * 100) : 0;

              return (
                <motion.div key={course.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="rounded-2xl bg-card border border-border/50 overflow-hidden group"
                >
                  {/* Cover image area */}
                  {course.coverUrl && (
                    <div className="h-24 w-full bg-muted overflow-hidden">
                      <img src={course.coverUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <button onClick={() => navigate(`/studies/${course.id}`)} className="w-full text-left p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${course.kind === "formação" ? "bg-primary/10" : "bg-accent/20"}`}>
                        {course.kind === "formação" ? (
                          <GraduationCap className="w-5 h-5 text-primary" />
                        ) : (
                          <Layers className="w-5 h-5 text-accent-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{course.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {course.kind === "formação" ? "Formação" : "Extensão"} • {course.area}
                          {course.components.length > 0 && ` • ${course.components.length} ${course.kind === "formação" ? "disciplinas" : "módulos"}`}
                          {pendingCount > 0 && <span className="text-primary font-medium"> • {pendingCount} pendente{pendingCount > 1 ? "s" : ""}</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary">{progress}%</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-muted mt-3">
                      <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {tab === "cronograma" && (
          <motion.div key="cronograma" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            {groupedSchedule.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Cronograma vazio</p>
              </div>
            )}

            {groupedSchedule.map(group => (
              <div key={group.day}>
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{group.day}</p>
                <div className="space-y-2">
                  {group.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50">
                      <div className="w-12 text-center">
                        <p className="text-xs font-bold">{item.time}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.courseName}</p>
                        {item.topic && <p className="text-[10px] text-muted-foreground truncate">{item.topic}</p>}
                      </div>
                      <button onClick={() => { deleteScheduleItem(item.id); toast.success("Removido"); }}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
