import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Plus, ChevronDown, ChevronUp, Clock, GraduationCap,
  Trash2, Check, X, Calendar, FileText, PenLine, Layers
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Tab = "cursos" | "cronograma";

type CourseType = "graduação" | "livre" | "certificação" | "online";
type CourseArea = "tecnologia" | "saúde" | "negócios" | "idiomas" | "design" | "outro";

interface Activity {
  id: string;
  name: string;
  type: "atividade" | "prova" | "estudo" | "tarefa";
  due: string;
  done: boolean;
}

interface Course {
  id: string;
  name: string;
  type: CourseType;
  area: CourseArea;
  progress: number;
  activities: Activity[];
}

interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  courseName: string;
  topic: string;
}

const COURSE_TYPES: { value: CourseType; label: string }[] = [
  { value: "graduação", label: "Graduação" },
  { value: "livre", label: "Curso Livre" },
  { value: "certificação", label: "Certificação" },
  { value: "online", label: "Curso Online" },
];

const COURSE_AREAS: { value: CourseArea; label: string }[] = [
  { value: "tecnologia", label: "Tecnologia" },
  { value: "saúde", label: "Saúde" },
  { value: "negócios", label: "Negócios" },
  { value: "idiomas", label: "Idiomas" },
  { value: "design", label: "Design" },
  { value: "outro", label: "Outro" },
];

const WEEK_DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

const ACTIVITY_TYPES: { value: Activity["type"]; label: string; icon: typeof FileText }[] = [
  { value: "atividade", label: "Atividade", icon: FileText },
  { value: "prova", label: "Prova", icon: PenLine },
  { value: "estudo", label: "Sessão de Estudo", icon: BookOpen },
  { value: "tarefa", label: "Tarefa", icon: Layers },
];

const initialCourses: Course[] = [
  {
    id: "1", name: "Banco de Dados", type: "graduação", area: "tecnologia", progress: 65,
    activities: [
      { id: "a1", name: "Trabalho ER", type: "atividade", due: "2026-04-02", done: false },
      { id: "a2", name: "Lista SQL", type: "tarefa", due: "2026-03-30", done: true },
      { id: "a3", name: "Prova P2", type: "prova", due: "2026-03-29", done: false },
    ],
  },
  {
    id: "2", name: "AWS Cloud Practitioner", type: "certificação", area: "tecnologia", progress: 40,
    activities: [
      { id: "a4", name: "Módulo 5 - Networking", type: "estudo", due: "2026-04-01", done: false },
    ],
  },
  {
    id: "3", name: "Inglês Avançado", type: "livre", area: "idiomas", progress: 72,
    activities: [
      { id: "a5", name: "Speaking practice", type: "atividade", due: "2026-03-29", done: false },
    ],
  },
];

const initialSchedule: ScheduleItem[] = [
  { id: "s1", day: "Segunda", time: "19:00", courseName: "Banco de Dados", topic: "Normalização" },
  { id: "s2", day: "Segunda", time: "21:00", courseName: "AWS Cloud Practitioner", topic: "IAM e Segurança" },
  { id: "s3", day: "Terça", time: "19:00", courseName: "Inglês Avançado", topic: "Listening B2" },
  { id: "s4", day: "Quarta", time: "19:00", courseName: "Banco de Dados", topic: "SQL Avançado" },
  { id: "s5", day: "Quinta", time: "20:00", courseName: "AWS Cloud Practitioner", topic: "EC2 e S3" },
];

export default function StudiesPage() {
  const [tab, setTab] = useState<Tab>("cursos");
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  // Create course state
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", type: "" as CourseType, area: "" as CourseArea });

  // Create activity state
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [activityCourseId, setActivityCourseId] = useState("");
  const [newActivity, setNewActivity] = useState({ name: "", type: "" as Activity["type"], due: "" });

  // Create schedule item state
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [newScheduleItem, setNewScheduleItem] = useState({ day: "", time: "", courseName: "", topic: "" });

  const handleCreateCourse = () => {
    if (!newCourse.name.trim() || !newCourse.type || !newCourse.area) {
      toast.error("Preencha todos os campos");
      return;
    }
    const course: Course = {
      id: Date.now().toString(),
      name: newCourse.name.trim(),
      type: newCourse.type,
      area: newCourse.area,
      progress: 0,
      activities: [],
    };
    setCourses(prev => [course, ...prev]);
    setNewCourse({ name: "", type: "" as CourseType, area: "" as CourseArea });
    setCourseDialogOpen(false);
    toast.success(`Curso "${course.name}" criado!`);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    toast.success("Curso removido");
  };

  const handleCreateActivity = () => {
    if (!newActivity.name.trim() || !newActivity.type || !newActivity.due) {
      toast.error("Preencha todos os campos");
      return;
    }
    const activity: Activity = {
      id: Date.now().toString(),
      name: newActivity.name.trim(),
      type: newActivity.type,
      due: newActivity.due,
      done: false,
    };
    setCourses(prev =>
      prev.map(c => c.id === activityCourseId ? { ...c, activities: [...c.activities, activity] } : c)
    );
    setNewActivity({ name: "", type: "" as Activity["type"], due: "" });
    setActivityDialogOpen(false);
    toast.success("Item adicionado ao curso!");
  };

  const toggleActivity = (courseId: string, activityId: string) => {
    setCourses(prev =>
      prev.map(c =>
        c.id === courseId
          ? { ...c, activities: c.activities.map(a => a.id === activityId ? { ...a, done: !a.done } : a) }
          : c
      )
    );
  };

  const deleteActivity = (courseId: string, activityId: string) => {
    setCourses(prev =>
      prev.map(c =>
        c.id === courseId
          ? { ...c, activities: c.activities.filter(a => a.id !== activityId) }
          : c
      )
    );
  };

  const handleCreateScheduleItem = () => {
    if (!newScheduleItem.day || !newScheduleItem.time || !newScheduleItem.courseName.trim()) {
      toast.error("Preencha dia, horário e curso");
      return;
    }
    const item: ScheduleItem = { id: Date.now().toString(), ...newScheduleItem };
    setSchedule(prev => [...prev, item]);
    setNewScheduleItem({ day: "", time: "", courseName: "", topic: "" });
    setScheduleDialogOpen(false);
    toast.success("Horário adicionado!");
  };

  const deleteScheduleItem = (id: string) => {
    setSchedule(prev => prev.filter(s => s.id !== id));
  };

  const typeLabel = (t: CourseType) => COURSE_TYPES.find(ct => ct.value === t)?.label ?? t;
  const areaLabel = (a: CourseArea) => COURSE_AREAS.find(ca => ca.value === a)?.label ?? a;
  const actTypeIcon = (t: Activity["type"]) => ACTIVITY_TYPES.find(at => at.value === t)?.icon ?? FileText;

  const groupedSchedule = WEEK_DAYS.map(day => ({
    day,
    items: schedule.filter(s => s.day === day).sort((a, b) => a.time.localeCompare(b.time)),
  })).filter(g => g.items.length > 0);

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
                <Select value={newCourse.type} onValueChange={v => setNewCourse(p => ({ ...p, type: v as CourseType }))}>
                  <SelectTrigger><SelectValue placeholder="Tipo de curso" /></SelectTrigger>
                  <SelectContent>
                    {COURSE_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
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
                <Input
                  type="time"
                  value={newScheduleItem.time}
                  onChange={e => setNewScheduleItem(p => ({ ...p, time: e.target.value }))}
                />
                <Input
                  placeholder="Nome do curso"
                  value={newScheduleItem.courseName}
                  onChange={e => setNewScheduleItem(p => ({ ...p, courseName: e.target.value }))}
                />
                <Input
                  placeholder="Tópico (opcional)"
                  value={newScheduleItem.topic}
                  onChange={e => setNewScheduleItem(p => ({ ...p, topic: e.target.value }))}
                />
                <button
                  onClick={handleCreateScheduleItem}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold active:scale-[0.98] transition-transform"
                >
                  Adicionar ao Cronograma
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { label: "Cursos", value: "cursos" as Tab },
          { label: "Cronograma", value: "cronograma" as Tab },
        ].map(t => (
          <button key={t.value} onClick={() => setTab(t.value)}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-colors ${tab === t.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >{t.label}</button>
        ))}
      </div>

      {/* Activity creation dialog */}
      <Dialog open={activityDialogOpen} onOpenChange={setActivityDialogOpen}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Adicionar ao Curso</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <Input
              placeholder="Nome"
              value={newActivity.name}
              onChange={e => setNewActivity(p => ({ ...p, name: e.target.value }))}
            />
            <Select value={newActivity.type} onValueChange={v => setNewActivity(p => ({ ...p, type: v as Activity["type"] }))}>
              <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                {ACTIVITY_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={newActivity.due}
              onChange={e => setNewActivity(p => ({ ...p, due: e.target.value }))}
            />
            <button
              onClick={handleCreateActivity}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold active:scale-[0.98] transition-transform"
            >
              Adicionar
            </button>
          </div>
        </DialogContent>
      </Dialog>

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
              const isExpanded = expandedCourse === course.id;
              const pendingCount = course.activities.filter(a => !a.done).length;

              return (
                <motion.div key={course.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="rounded-2xl bg-card border border-border/50 overflow-hidden"
                >
                  <button onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
                    className="w-full text-left p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{course.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {typeLabel(course.type)} • {areaLabel(course.area)}
                          {pendingCount > 0 && <span className="text-primary font-medium"> • {pendingCount} pendente{pendingCount > 1 ? "s" : ""}</span>}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-primary mr-2">{course.progress}%</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-muted mt-3">
                      <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${course.progress}%` }} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-border/50 pt-3">
                          {/* Actions */}
                          <div className="flex gap-2 mb-3">
                            <button
                              onClick={(e) => { e.stopPropagation(); setActivityCourseId(course.id); setActivityDialogOpen(true); }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[11px] font-medium active:scale-95 transition-transform"
                            >
                              <Plus className="w-3.5 h-3.5" /> Adicionar item
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id); }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-[11px] font-medium active:scale-95 transition-transform"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remover
                            </button>
                          </div>

                          {/* Activities list */}
                          {course.activities.length === 0 ? (
                            <p className="text-xs text-muted-foreground text-center py-4">Nenhum item adicionado ainda</p>
                          ) : (
                            <div className="space-y-1.5">
                              {course.activities.map(a => {
                                const Icon = actTypeIcon(a.type);
                                return (
                                  <div key={a.id} className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40">
                                    <button onClick={(e) => { e.stopPropagation(); toggleActivity(course.id, a.id); }}
                                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${a.done ? "bg-primary border-primary" : "border-muted-foreground/30"}`}
                                    >
                                      {a.done && <Check className="w-3 h-3 text-primary-foreground" />}
                                    </button>
                                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-xs font-medium truncate ${a.done ? "line-through text-muted-foreground" : ""}`}>{a.name}</p>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground">{a.due}</span>
                                    <button onClick={(e) => { e.stopPropagation(); deleteActivity(course.id, a.id); }}
                                      className="p-1 rounded-md hover:bg-destructive/10 transition-colors"
                                    >
                                      <X className="w-3 h-3 text-muted-foreground" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {tab === "cronograma" && (
          <motion.div key="cronograma" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
            {groupedSchedule.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Cronograma vazio</p>
                <p className="text-xs mt-1">Toque no + para organizar sua rotina</p>
              </div>
            )}

            {groupedSchedule.map(group => (
              <div key={group.day} className="rounded-2xl bg-card border border-border/50 p-4">
                <p className="text-sm font-bold mb-3 text-primary">{group.day}</p>
                <div className="space-y-2">
                  {group.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40">
                      <div className="flex items-center gap-1.5 w-14">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium">{item.time}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{item.courseName}</p>
                        {item.topic && <p className="text-[10px] text-muted-foreground truncate">{item.topic}</p>}
                      </div>
                      <button onClick={() => deleteScheduleItem(item.id)}
                        className="p-1 rounded-md hover:bg-destructive/10 transition-colors"
                      >
                        <X className="w-3 h-3 text-muted-foreground" />
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
