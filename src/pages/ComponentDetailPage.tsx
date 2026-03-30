import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Plus, Trash2, Check, FileText, PenLine,
  BookOpen, Layers, Edit2, Star, Clock
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useStudiesStore, type Activity } from "@/stores/studiesStore";

type SubTab = "notas" | "atividades" | "provas" | "conteudo";

const ACTIVITY_TYPES: { value: Activity["type"]; label: string }[] = [
  { value: "atividade", label: "Atividade" },
  { value: "prova", label: "Prova" },
  { value: "estudo", label: "Sessão de Estudo" },
  { value: "tarefa", label: "Tarefa" },
];

const actIcon = (t: Activity["type"]) => {
  switch (t) {
    case "prova": return PenLine;
    case "estudo": return BookOpen;
    case "tarefa": return Layers;
    default: return FileText;
  }
};

export default function ComponentDetailPage() {
  const { courseId, componentId } = useParams<{ courseId: string; componentId: string }>();
  const navigate = useNavigate();
  const store = useStudiesStore();

  const course = store.courses.find(c => c.id === courseId);
  const comp = course?.components.find(c => c.id === componentId);

  const [activeTab, setActiveTab] = useState<SubTab>("atividades");
  const [actDialogOpen, setActDialogOpen] = useState(false);
  const [newAct, setNewAct] = useState({ name: "", type: "" as Activity["type"], due: "", description: "" });
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [newGrade, setNewGrade] = useState({ name: "", value: "", maxValue: "10" });
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: "", description: "", professor: "", workload: "" });

  if (!course || !comp) {
    return (
      <div className="px-4 py-5 max-w-lg mx-auto text-center pt-20">
        <p className="text-muted-foreground">Componente não encontrado</p>
        <button onClick={() => navigate("/studies")} className="text-primary text-sm mt-2">Voltar</button>
      </div>
    );
  }

  const isFormacao = course.kind === "formação";
  const label = isFormacao ? "Componente Curricular" : "Módulo";

  const handleAddActivity = () => {
    if (!newAct.name.trim() || !newAct.type || !newAct.due) {
      toast.error("Preencha nome, tipo e data");
      return;
    }
    store.addActivity(course.id, comp.id, {
      name: newAct.name.trim(),
      type: newAct.type,
      due: newAct.due,
      description: newAct.description.trim() || undefined,
    });
    setNewAct({ name: "", type: "" as Activity["type"], due: "", description: "" });
    setActDialogOpen(false);
    toast.success("Adicionado!");
  };

  const handleAddGrade = () => {
    const val = parseFloat(newGrade.value);
    const max = parseFloat(newGrade.maxValue);
    if (!newGrade.name.trim() || isNaN(val) || isNaN(max)) {
      toast.error("Preencha todos os campos");
      return;
    }
    store.addGrade(course.id, comp.id, { name: newGrade.name.trim(), value: val, maxValue: max });
    setNewGrade({ name: "", value: "", maxValue: "10" });
    setGradeDialogOpen(false);
    toast.success("Nota adicionada!");
  };

  const handleSaveEdit = () => {
    store.updateComponent(course.id, comp.id, {
      name: editData.name.trim() || comp.name,
      description: editData.description.trim(),
      professor: editData.professor.trim() || undefined,
      workload: editData.workload ? parseInt(editData.workload) : undefined,
    });
    setEditMode(false);
    toast.success("Atualizado!");
  };

  const avg = comp.grades.length > 0
    ? (comp.grades.reduce((s, g) => s + (g.value / g.maxValue) * 10, 0) / comp.grades.length).toFixed(1)
    : null;

  const provas = comp.activities.filter(a => a.type === "prova");
  const otherActivities = comp.activities.filter(a => a.type !== "prova");

  const tabs: { value: SubTab; label: string; count?: number }[] = [
    { value: "notas", label: "Notas", count: comp.grades.length },
    { value: "atividades", label: "Atividades", count: otherActivities.filter(a => !a.done).length },
    { value: "provas", label: "Provas", count: provas.filter(a => !a.done).length },
    { value: "conteudo", label: "Conteúdo" },
  ];

  return (
    <div className="pb-28 max-w-lg mx-auto">
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-3 border-b border-border/50">
        <button onClick={() => navigate(`/studies/${course.id}`)}
          className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate">{comp.name}</p>
          <p className="text-[10px] text-muted-foreground truncate">{course.name} • {label}</p>
        </div>
        <button onClick={() => { setEditMode(true); setEditData({ name: comp.name, description: comp.description, professor: comp.professor ?? "", workload: comp.workload?.toString() ?? "" }); }}
          className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      {/* Edit dialog */}
      <Dialog open={editMode} onOpenChange={setEditMode}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader><DialogTitle>Editar {label}</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <Input placeholder="Nome" value={editData.name} onChange={e => setEditData(p => ({ ...p, name: e.target.value }))} />
            <Textarea placeholder="Descrição" value={editData.description} onChange={e => setEditData(p => ({ ...p, description: e.target.value }))} rows={2} />
            <Input placeholder="Professor" value={editData.professor} onChange={e => setEditData(p => ({ ...p, professor: e.target.value }))} />
            <Input type="number" placeholder="Carga horária" value={editData.workload} onChange={e => setEditData(p => ({ ...p, workload: e.target.value }))} />
            <button onClick={handleSaveEdit} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold">Salvar</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Summary cards */}
      <div className="px-4 pt-4">
        <div className="flex gap-3 mb-4">
          {avg && (
            <div className="flex-1 rounded-xl bg-primary/10 p-3 text-center">
              <Star className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold text-primary">{avg}</p>
              <p className="text-[9px] text-muted-foreground">Média</p>
            </div>
          )}
          <div className="flex-1 rounded-xl bg-card border border-border/50 p-3 text-center">
            <FileText className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold">{comp.activities.length}</p>
            <p className="text-[9px] text-muted-foreground">Total</p>
          </div>
          <div className="flex-1 rounded-xl bg-card border border-border/50 p-3 text-center">
            <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold">{comp.activities.filter(a => !a.done).length}</p>
            <p className="text-[9px] text-muted-foreground">Pendentes</p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-1.5 mb-4 overflow-x-auto no-scrollbar">
          {tabs.map(t => (
            <button key={t.value} onClick={() => setActiveTab(t.value)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors ${
                activeTab === t.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center ${
                  activeTab === t.value ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"
                }`}>{t.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-4">
        <AnimatePresence mode="wait">
          {/* NOTAS */}
          {activeTab === "notas" && (
            <motion.div key="notas" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Notas</p>
                <Dialog open={gradeDialogOpen} onOpenChange={setGradeDialogOpen}>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[11px] font-medium">
                      <Plus className="w-3.5 h-3.5" /> Nota
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm mx-auto">
                    <DialogHeader><DialogTitle>Adicionar Nota</DialogTitle></DialogHeader>
                    <div className="space-y-3 mt-2">
                      <Input placeholder="Nome (ex: P1, Trabalho)" value={newGrade.name} onChange={e => setNewGrade(p => ({ ...p, name: e.target.value }))} />
                      <div className="flex gap-2">
                        <Input type="number" step="0.1" placeholder="Nota" value={newGrade.value} onChange={e => setNewGrade(p => ({ ...p, value: e.target.value }))} />
                        <Input type="number" step="0.1" placeholder="Máx" value={newGrade.maxValue} onChange={e => setNewGrade(p => ({ ...p, maxValue: e.target.value }))} />
                      </div>
                      <button onClick={handleAddGrade} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold">Adicionar</button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {comp.grades.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Star className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Nenhuma nota registrada</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {comp.grades.map(g => (
                    <div key={g.id} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{g.name}</p>
                      </div>
                      <p className="text-sm font-bold text-primary">{g.value}<span className="text-muted-foreground font-normal">/{g.maxValue}</span></p>
                      <button onClick={() => { store.deleteGrade(course.id, comp.id, g.id); toast.success("Removido"); }}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {avg && (
                    <div className="p-3 rounded-xl bg-primary/10 text-center">
                      <p className="text-xs text-muted-foreground">Média</p>
                      <p className="text-xl font-bold text-primary">{avg}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ATIVIDADES */}
          {activeTab === "atividades" && (
            <motion.div key="atividades" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Atividades & Tarefas</p>
                <Dialog open={actDialogOpen} onOpenChange={setActDialogOpen}>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[11px] font-medium">
                      <Plus className="w-3.5 h-3.5" /> Adicionar
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm mx-auto">
                    <DialogHeader><DialogTitle>Nova Atividade</DialogTitle></DialogHeader>
                    <div className="space-y-3 mt-2">
                      <Input placeholder="Nome" value={newAct.name} onChange={e => setNewAct(p => ({ ...p, name: e.target.value }))} />
                      <Select value={newAct.type} onValueChange={v => setNewAct(p => ({ ...p, type: v as Activity["type"] }))}>
                        <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                        <SelectContent>
                          {ACTIVITY_TYPES.filter(t => t.value !== "prova").map(t => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input type="date" value={newAct.due} onChange={e => setNewAct(p => ({ ...p, due: e.target.value }))} />
                      <Textarea placeholder="Descrição (opcional)" value={newAct.description} onChange={e => setNewAct(p => ({ ...p, description: e.target.value }))} rows={2} />
                      <button onClick={handleAddActivity} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold">Adicionar</button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {otherActivities.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Nenhuma atividade cadastrada</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {otherActivities.map(a => {
                    const Icon = actIcon(a.type);
                    return (
                      <div key={a.id} className={`flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50 ${a.done ? "opacity-60" : ""}`}>
                        <button onClick={() => store.toggleActivity(course.id, comp.id, a.id)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${a.done ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                        >
                          {a.done && <Check className="w-4 h-4" />}
                        </button>
                        <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${a.done ? "line-through" : ""}`}>{a.name}</p>
                          <p className="text-[10px] text-muted-foreground">{a.due}</p>
                        </div>
                        <button onClick={() => { store.deleteActivity(course.id, comp.id, a.id); toast.success("Removido"); }}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* PROVAS */}
          {activeTab === "provas" && (
            <motion.div key="provas" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Provas</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[11px] font-medium"
                      onClick={() => { setNewAct(p => ({ ...p, type: "prova" })); setActDialogOpen(true); }}
                    >
                      <Plus className="w-3.5 h-3.5" /> Prova
                    </button>
                  </DialogTrigger>
                </Dialog>
              </div>

              {provas.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <PenLine className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Nenhuma prova cadastrada</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {provas.map(a => (
                    <div key={a.id} className={`flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50 ${a.done ? "opacity-60" : ""}`}>
                      <button onClick={() => store.toggleActivity(course.id, comp.id, a.id)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${a.done ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                      >
                        {a.done && <Check className="w-4 h-4" />}
                      </button>
                      <PenLine className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${a.done ? "line-through" : ""}`}>{a.name}</p>
                        <p className="text-[10px] text-muted-foreground">{a.due}</p>
                      </div>
                      <button onClick={() => { store.deleteActivity(course.id, comp.id, a.id); toast.success("Removido"); }}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Activity dialog also used for provas */}
              <Dialog open={actDialogOpen && newAct.type === "prova"} onOpenChange={v => { if (!v) setActDialogOpen(false); }}>
                <DialogContent className="max-w-sm mx-auto">
                  <DialogHeader><DialogTitle>Nova Prova</DialogTitle></DialogHeader>
                  <div className="space-y-3 mt-2">
                    <Input placeholder="Nome da prova" value={newAct.name} onChange={e => setNewAct(p => ({ ...p, name: e.target.value }))} />
                    <Input type="date" value={newAct.due} onChange={e => setNewAct(p => ({ ...p, due: e.target.value }))} />
                    <Textarea placeholder="Descrição (opcional)" value={newAct.description} onChange={e => setNewAct(p => ({ ...p, description: e.target.value }))} rows={2} />
                    <button onClick={handleAddActivity} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold">Adicionar Prova</button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}

          {/* CONTEÚDO */}
          {activeTab === "conteudo" && (
            <motion.div key="conteudo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="mb-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Conteúdo / Estudos</p>
              </div>

              <div className="rounded-xl bg-card border border-border/50 p-4">
                <p className="text-sm text-muted-foreground mb-3">
                  {comp.description || "Sem descrição definida."}
                </p>

                {comp.professor && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="font-medium">Professor:</span> {comp.professor}
                  </div>
                )}
                {comp.workload && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">Carga horária:</span> {comp.workload}h
                  </div>
                )}
              </div>

              {/* Study sessions */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sessões de Estudo</p>
                  <button
                    onClick={() => { setNewAct({ name: "", type: "estudo", due: "", description: "" }); setActDialogOpen(true); }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[11px] font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" /> Sessão
                  </button>
                </div>

                {comp.activities.filter(a => a.type === "estudo").length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">Nenhuma sessão de estudo</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {comp.activities.filter(a => a.type === "estudo").map(a => (
                      <div key={a.id} className={`flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50 ${a.done ? "opacity-60" : ""}`}>
                        <button onClick={() => store.toggleActivity(course.id, comp.id, a.id)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${a.done ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                        >
                          {a.done && <Check className="w-4 h-4" />}
                        </button>
                        <BookOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${a.done ? "line-through" : ""}`}>{a.name}</p>
                          <p className="text-[10px] text-muted-foreground">{a.due}</p>
                        </div>
                        <button onClick={() => { store.deleteActivity(course.id, comp.id, a.id); toast.success("Removido"); }}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Shared activity dialog for study sessions */}
              <Dialog open={actDialogOpen && newAct.type === "estudo"} onOpenChange={v => { if (!v) setActDialogOpen(false); }}>
                <DialogContent className="max-w-sm mx-auto">
                  <DialogHeader><DialogTitle>Nova Sessão de Estudo</DialogTitle></DialogHeader>
                  <div className="space-y-3 mt-2">
                    <Input placeholder="O que vai estudar?" value={newAct.name} onChange={e => setNewAct(p => ({ ...p, name: e.target.value }))} />
                    <Input type="date" value={newAct.due} onChange={e => setNewAct(p => ({ ...p, due: e.target.value }))} />
                    <button onClick={handleAddActivity} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold">Adicionar</button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete component */}
      <div className="px-4 mt-8">
        <button onClick={() => { store.deleteComponent(course.id, comp.id); navigate(`/studies/${course.id}`); toast.success("Removido"); }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium active:scale-[0.98] transition-transform"
        >
          <Trash2 className="w-4 h-4" /> Remover {label}
        </button>
      </div>
    </div>
  );
}
