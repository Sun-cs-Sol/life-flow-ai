import { create } from "zustand";

export type CourseKind = "formação" | "extensão";
export type CourseArea = "tecnologia" | "saúde" | "negócios" | "idiomas" | "design" | "outro";

export interface Grade {
  id: string;
  name: string;
  value: number;
  maxValue: number;
}

export interface Activity {
  id: string;
  name: string;
  type: "atividade" | "prova" | "estudo" | "tarefa";
  due: string;
  done: boolean;
  description?: string;
}

/** Component = Disciplina (formação) or Módulo (extensão) */
export interface CourseComponent {
  id: string;
  name: string;
  description: string;
  professor?: string;
  workload?: number;
  grades: Grade[];
  activities: Activity[];
}

export interface Course {
  id: string;
  name: string;
  kind: CourseKind;
  area: CourseArea;
  coverUrl?: string;
  components: CourseComponent[];
  createdAt: string;
}

export interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  courseName: string;
  topic: string;
}

interface StudiesState {
  courses: Course[];
  schedule: ScheduleItem[];

  addCourse: (c: Omit<Course, "id" | "createdAt" | "components">) => string;
  updateCourse: (id: string, data: Partial<Pick<Course, "name" | "area" | "coverUrl">>) => void;
  deleteCourse: (id: string) => void;

  addComponent: (courseId: string, c: Omit<CourseComponent, "id" | "grades" | "activities">) => string;
  updateComponent: (courseId: string, compId: string, data: Partial<Pick<CourseComponent, "name" | "description" | "professor" | "workload">>) => void;
  deleteComponent: (courseId: string, compId: string) => void;

  addGrade: (courseId: string, compId: string, g: Omit<Grade, "id">) => void;
  deleteGrade: (courseId: string, compId: string, gradeId: string) => void;

  addActivity: (courseId: string, compId: string, a: Omit<Activity, "id" | "done">) => void;
  toggleActivity: (courseId: string, compId: string, actId: string) => void;
  deleteActivity: (courseId: string, compId: string, actId: string) => void;

  addScheduleItem: (item: Omit<ScheduleItem, "id">) => void;
  deleteScheduleItem: (id: string) => void;
}

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const INITIAL_COURSES: Course[] = [
  {
    id: "demo-1",
    name: "Ciência da Computação",
    kind: "formação",
    area: "tecnologia",
    createdAt: new Date().toISOString(),
    components: [
      {
        id: "comp-1",
        name: "Banco de Dados",
        description: "Modelagem e SQL",
        professor: "Prof. Ricardo",
        workload: 60,
        grades: [
          { id: "g1", name: "P1", value: 7.5, maxValue: 10 },
          { id: "g2", name: "P2", value: 8.0, maxValue: 10 },
        ],
        activities: [
          { id: "a1", name: "Trabalho ER", type: "atividade", due: "2026-04-05", done: false },
          { id: "a2", name: "Lista SQL", type: "tarefa", due: "2026-04-01", done: true },
          { id: "a3", name: "Prova P2", type: "prova", due: "2026-04-10", done: false },
        ],
      },
      {
        id: "comp-2",
        name: "IHC",
        description: "Interface Humano-Computador",
        professor: "Prof. Ana",
        workload: 40,
        grades: [{ id: "g3", name: "P1", value: 8.2, maxValue: 10 }],
        activities: [
          { id: "a4", name: "Protótipo final", type: "atividade", due: "2026-04-12", done: false },
        ],
      },
    ],
  },
  {
    id: "demo-2",
    name: "AWS Cloud Practitioner",
    kind: "extensão",
    area: "tecnologia",
    createdAt: new Date().toISOString(),
    components: [
      {
        id: "mod-1",
        name: "Módulo 1 - Cloud Concepts",
        description: "Conceitos fundamentais de cloud computing",
        grades: [],
        activities: [
          { id: "a5", name: "Quiz conceitos", type: "prova", due: "2026-04-03", done: true },
        ],
      },
      {
        id: "mod-2",
        name: "Módulo 2 - IAM e Segurança",
        description: "Gerenciamento de identidade e acesso",
        grades: [],
        activities: [
          { id: "a6", name: "Lab prático IAM", type: "estudo", due: "2026-04-08", done: false },
        ],
      },
    ],
  },
];

const INITIAL_SCHEDULE: ScheduleItem[] = [
  { id: "s1", day: "Segunda", time: "19:00", courseName: "Banco de Dados", topic: "Normalização" },
  { id: "s2", day: "Terça", time: "19:00", courseName: "IHC", topic: "Heurísticas de Nielsen" },
  { id: "s3", day: "Quarta", time: "19:00", courseName: "Banco de Dados", topic: "SQL Avançado" },
  { id: "s4", day: "Quinta", time: "20:00", courseName: "AWS Cloud", topic: "EC2 e S3" },
];

export const useStudiesStore = create<StudiesState>((set) => ({
  courses: INITIAL_COURSES,
  schedule: INITIAL_SCHEDULE,

  addCourse: (c) => {
    const id = uid();
    set((s) => ({
      courses: [{ ...c, id, components: [], createdAt: new Date().toISOString() }, ...s.courses],
    }));
    return id;
  },
  updateCourse: (id, data) =>
    set((s) => ({ courses: s.courses.map((c) => (c.id === id ? { ...c, ...data } : c)) })),
  deleteCourse: (id) => set((s) => ({ courses: s.courses.filter((c) => c.id !== id) })),

  addComponent: (courseId, comp) => {
    const id = uid();
    set((s) => ({
      courses: s.courses.map((c) =>
        c.id === courseId
          ? { ...c, components: [...c.components, { ...comp, id, grades: [], activities: [] }] }
          : c
      ),
    }));
    return id;
  },
  updateComponent: (courseId, compId, data) =>
    set((s) => ({
      courses: s.courses.map((c) =>
        c.id === courseId
          ? { ...c, components: c.components.map((comp) => (comp.id === compId ? { ...comp, ...data } : comp)) }
          : c
      ),
    })),
  deleteComponent: (courseId, compId) =>
    set((s) => ({
      courses: s.courses.map((c) =>
        c.id === courseId ? { ...c, components: c.components.filter((comp) => comp.id !== compId) } : c
      ),
    })),

  addGrade: (courseId, compId, g) => {
    const id = uid();
    set((s) => ({
      courses: s.courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              components: c.components.map((comp) =>
                comp.id === compId ? { ...comp, grades: [...comp.grades, { ...g, id }] } : comp
              ),
            }
          : c
      ),
    }));
  },
  deleteGrade: (courseId, compId, gradeId) =>
    set((s) => ({
      courses: s.courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              components: c.components.map((comp) =>
                comp.id === compId ? { ...comp, grades: comp.grades.filter((g) => g.id !== gradeId) } : comp
              ),
            }
          : c
      ),
    })),

  addActivity: (courseId, compId, a) => {
    const id = uid();
    set((s) => ({
      courses: s.courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              components: c.components.map((comp) =>
                comp.id === compId ? { ...comp, activities: [...comp.activities, { ...a, id, done: false }] } : comp
              ),
            }
          : c
      ),
    }));
  },
  toggleActivity: (courseId, compId, actId) =>
    set((s) => ({
      courses: s.courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              components: c.components.map((comp) =>
                comp.id === compId
                  ? { ...comp, activities: comp.activities.map((a) => (a.id === actId ? { ...a, done: !a.done } : a)) }
                  : comp
              ),
            }
          : c
      ),
    })),
  deleteActivity: (courseId, compId, actId) =>
    set((s) => ({
      courses: s.courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              components: c.components.map((comp) =>
                comp.id === compId ? { ...comp, activities: comp.activities.filter((a) => a.id !== actId) } : comp
              ),
            }
          : c
      ),
    })),

  addScheduleItem: (item) => set((s) => ({ schedule: [...s.schedule, { ...item, id: uid() }] })),
  deleteScheduleItem: (id) => set((s) => ({ schedule: s.schedule.filter((i) => i.id !== id) })),
}));
