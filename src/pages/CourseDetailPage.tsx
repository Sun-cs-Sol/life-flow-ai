import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Plus, GraduationCap, Layers, Trash2, ChevronRight,
  Edit2, Image, BookOpen, Clock, Users
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useStudiesStore } from "@/stores/studiesStore";

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses, updateCourse, deleteCourse, addComponent, deleteComponent } = useStudiesStore();

  const course = courses.find(c => c.id === courseId);

  const [compDialogOpen, setCompDialogOpen] = useState(false);
  const [newComp, setNewComp] = useState({ name: "", description: "", professor: "", workload: "" });
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(course?.name ?? "");
  const [coverDialogOpen, setCoverDialogOpen] = useState(false);
  const [coverInput, setCoverInput] = useState("");

  if (!course) {
    return (
      <div className="px-4 py-5 max-w-lg mx-auto text-center pt-20">
        <p className="text-muted-foreground">Curso não encontrado</p>
        <button onClick={() => navigate("/studies")} className="text-primary text-sm mt-2">Voltar</button>
      </div>
    );
  }

  const isFormacao = course.kind === "formação";
  const componentLabel = isFormacao ? "Componente Curricular" : "Módulo";
  const componentLabelPlural = isFormacao ? "Componentes Curriculares" : "Módulos";

  const totalActivities = course.components.reduce((s, c) => s + c.activities.length, 0);
  const doneActivities = course.components.reduce((s, c) => s + c.activities.filter(a => a.done).length, 0);
  const progress = totalActivities > 0 ? Math.round((doneActivities / totalActivities) * 100) : 0;

  const handleAddComponent = () => {
    if (!newComp.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }
    addComponent(course.id, {
      name: newComp.name.trim(),
      description: newComp.description.trim(),
      professor: newComp.professor.trim() || undefined,
      workload: newComp.workload ? parseInt(newComp.workload) : undefined,
    });
    setNewComp({ name: "", description: "", professor: "", workload: "" });
    setCompDialogOpen(false);
    toast.success(`${componentLabel} adicionado!`);
  };

  const handleSaveName = () => {
    if (editName.trim()) {
      updateCourse(course.id, { name: editName.trim() });
      toast.success("Nome atualizado");
    }
    setEditMode(false);
  };

  const handleSetCover = () => {
    if (coverInput.trim()) {
      updateCourse(course.id, { coverUrl: coverInput.trim() });
      toast.success("Capa atualizada");
    }
    setCoverDialogOpen(false);
    setCoverInput("");
  };

  const handleDeleteCourse = () => {
    deleteCourse(course.id);
    navigate("/studies");
    toast.success("Curso removido");
  };

  return (
    <div className="pb-28 max-w-lg mx-auto">
      {/* Header / Cover */}
      <div className="relative">
        {course.coverUrl ? (
          <div className="h-40 w-full bg-muted overflow-hidden">
            <img src={course.coverUrl} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          </div>
        ) : (
          <div className={`h-32 w-full ${isFormacao ? "bg-primary/10" : "bg-accent/10"}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
        )}

        {/* Back button */}
        <button onClick={() => navigate("/studies")}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Dialog open={coverDialogOpen} onOpenChange={setCoverDialogOpen}>
            <DialogTrigger asChild>
              <button className="w-9 h-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center">
                <Image className="w-4 h-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-sm mx-auto">
              <DialogHeader><DialogTitle>Imagem de Capa</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-2">
                <Input placeholder="URL da imagem" value={coverInput} onChange={e => setCoverInput(e.target.value)} />
                <button onClick={handleSetCover} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold">
                  Salvar Capa
                </button>
              </div>
            </DialogContent>
          </Dialog>
          <button onClick={() => { setEditMode(!editMode); setEditName(course.name); }}
            className="w-9 h-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-4 -mt-6 relative z-10">
        {/* Course info */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isFormacao ? "bg-primary/10" : "bg-accent/20"}`}>
            {isFormacao ? <GraduationCap className="w-6 h-6 text-primary" /> : <Layers className="w-6 h-6 text-accent-foreground" />}
          </div>
          <div className="flex-1 min-w-0">
            {editMode ? (
              <div className="flex gap-2">
                <Input value={editName} onChange={e => setEditName(e.target.value)} className="text-lg font-bold" autoFocus />
                <button onClick={handleSaveName} className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">OK</button>
              </div>
            ) : (
              <h1 className="text-xl font-bold truncate">{course.name}</h1>
            )}
            <p className="text-xs text-muted-foreground mt-0.5">
              {isFormacao ? "Curso de Formação" : "Curso de Extensão"} • {course.area}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 rounded-xl bg-card border border-border/50 p-3 text-center">
            <BookOpen className="w-4 h-4 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold">{course.components.length}</p>
            <p className="text-[9px] text-muted-foreground">{componentLabelPlural}</p>
          </div>
          <div className="flex-1 rounded-xl bg-card border border-border/50 p-3 text-center">
            <Clock className="w-4 h-4 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold">{totalActivities}</p>
            <p className="text-[9px] text-muted-foreground">Atividades</p>
          </div>
          <div className="flex-1 rounded-xl bg-card border border-border/50 p-3 text-center">
            <div className="w-4 h-4 mx-auto mb-1 text-primary font-bold text-xs flex items-center justify-center">%</div>
            <p className="text-lg font-bold">{progress}%</p>
            <p className="text-[9px] text-muted-foreground">Progresso</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-muted mb-6">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        {/* Components header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold">{componentLabelPlural}</h2>
          <Dialog open={compDialogOpen} onOpenChange={setCompDialogOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[11px] font-medium active:scale-95 transition-transform">
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-sm mx-auto">
              <DialogHeader><DialogTitle>Novo {componentLabel}</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-2">
                <Input placeholder="Nome" value={newComp.name} onChange={e => setNewComp(p => ({ ...p, name: e.target.value }))} />
                <Textarea placeholder="Descrição (opcional)" value={newComp.description} onChange={e => setNewComp(p => ({ ...p, description: e.target.value }))} rows={2} />
                {isFormacao && (
                  <>
                    <Input placeholder="Professor (opcional)" value={newComp.professor} onChange={e => setNewComp(p => ({ ...p, professor: e.target.value }))} />
                    <Input type="number" placeholder="Carga horária (opcional)" value={newComp.workload} onChange={e => setNewComp(p => ({ ...p, workload: e.target.value }))} />
                  </>
                )}
                <button onClick={handleAddComponent} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold active:scale-[0.98] transition-transform">
                  Criar {componentLabel}
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Components list */}
        {course.components.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Nenhum {componentLabel.toLowerCase()} cadastrado</p>
          </div>
        ) : (
          <div className="space-y-2">
            {course.components.map((comp, i) => {
              const pending = comp.activities.filter(a => !a.done).length;
              const avg = comp.grades.length > 0
                ? (comp.grades.reduce((s, g) => s + (g.value / g.maxValue) * 10, 0) / comp.grades.length).toFixed(1)
                : null;

              return (
                <motion.div key={comp.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <div className="rounded-xl bg-card border border-border/50 overflow-hidden group">
                    <button
                      onClick={() => navigate(`/studies/${course.id}/${comp.id}`)}
                      className="w-full text-left p-4 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{comp.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {comp.professor && <><Users className="w-3 h-3 inline mr-0.5" />{comp.professor} • </>}
                          {comp.workload && <>{comp.workload}h • </>}
                          {comp.activities.length} atividade{comp.activities.length !== 1 ? "s" : ""}
                          {pending > 0 && <span className="text-primary font-medium"> • {pending} pendente{pending > 1 ? "s" : ""}</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {avg && <span className="text-xs font-bold text-primary">{avg}</span>}
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Delete course */}
        <button onClick={handleDeleteCourse}
          className="mt-8 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium active:scale-[0.98] transition-transform"
        >
          <Trash2 className="w-4 h-4" /> Remover Curso
        </button>
      </div>
    </div>
  );
}
