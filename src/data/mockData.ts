import { format, addDays, subDays } from "date-fns";

const today = new Date();
const tomorrow = addDays(today, 1);
const friday = addDays(today, (5 - today.getDay() + 7) % 7 || 7);

export interface Task {
  id: string;
  title: string;
  category: string;
  priority: "alta" | "média" | "baixa";
  dueDate: string;
  dueTime?: string;
  done: boolean;
  auto?: boolean;
}

export const mockTasks: Task[] = [
  { id: "1", title: "Pagar internet", category: "Finanças", priority: "alta", dueDate: format(friday, "yyyy-MM-dd"), dueTime: "18:00", done: false, auto: true },
  { id: "2", title: "Estudar Banco de Dados", category: "Estudos", priority: "alta", dueDate: format(today, "yyyy-MM-dd"), dueTime: "20:00", done: false },
  { id: "3", title: "Entregar trabalho de IHC", category: "Estudos", priority: "média", dueDate: format(addDays(today, 3), "yyyy-MM-dd"), dueTime: "23:59", done: false },
  { id: "4", title: "Revisar currículo", category: "Carreira", priority: "média", dueDate: format(addDays(today, 5), "yyyy-MM-dd"), done: false },
  { id: "5", title: "Comprar material de estudo", category: "Estudos", priority: "baixa", dueDate: format(addDays(today, 2), "yyyy-MM-dd"), done: true },
  { id: "6", title: "Pagar aluguel", category: "Finanças", priority: "alta", dueDate: format(addDays(today, 10), "yyyy-MM-dd"), dueTime: "12:00", done: false, auto: true },
  { id: "7", title: "Consulta médica", category: "Pessoal", priority: "alta", dueDate: format(addDays(today, 7), "yyyy-MM-dd"), dueTime: "14:30", done: false },
  { id: "8", title: "Pagar Netflix", category: "Finanças", priority: "baixa", dueDate: format(addDays(today, 15), "yyyy-MM-dd"), done: false, auto: true },
];

export interface Habit {
  id: string;
  name: string;
  icon: string;
  done: boolean;
  streak: number;
}

export const mockHabits: Habit[] = [
  { id: "1", name: "Beber água", icon: "💧", done: true, streak: 12 },
  { id: "2", name: "Treino", icon: "🏋️", done: false, streak: 5 },
  { id: "3", name: "Leitura", icon: "📖", done: false, streak: 8 },
  { id: "4", name: "Estudar inglês", icon: "🇬🇧", done: true, streak: 15 },
  { id: "5", name: "Meditação", icon: "🧘", done: false, streak: 3 },
  { id: "6", name: "Dormir antes das 23h", icon: "😴", done: false, streak: 2 },
];

export interface Subject {
  id: string;
  name: string;
  professor: string;
  schedule: string;
  nextExam: string;
  color: string;
  grade?: number;
  absences?: number;
  totalClasses?: number;
  activities?: { name: string; due: string; done: boolean }[];
}

export const mockSubjects: Subject[] = [
  { id: "1", name: "Banco de Dados", professor: "Prof. Ricardo", schedule: "Seg/Qua 19h", nextExam: format(tomorrow, "dd/MM"), color: "hsl(5, 100%, 72%)", grade: 7.5, absences: 2, totalClasses: 30, activities: [{ name: "Trabalho ER", due: format(addDays(today, 5), "dd/MM"), done: false }, { name: "Lista SQL", due: format(addDays(today, 2), "dd/MM"), done: true }] },
  { id: "2", name: "IHC", professor: "Prof. Ana", schedule: "Ter/Qui 19h", nextExam: format(addDays(today, 10), "dd/MM"), color: "hsl(297, 16%, 36%)", grade: 8.2, absences: 1, totalClasses: 28, activities: [{ name: "Protótipo final", due: format(addDays(today, 8), "dd/MM"), done: false }] },
  { id: "3", name: "Desenvolvimento Web", professor: "Prof. Carlos", schedule: "Ter/Qui 21h", nextExam: format(addDays(today, 15), "dd/MM"), color: "hsl(40, 76%, 60%)", grade: 9.0, absences: 0, totalClasses: 32, activities: [] },
  { id: "4", name: "Engenharia de Software", professor: "Prof. Maria", schedule: "Seg/Qua 21h", nextExam: format(addDays(today, 20), "dd/MM"), color: "hsl(100, 22%, 72%)", grade: 6.8, absences: 4, totalClasses: 30, activities: [{ name: "Diagrama UML", due: format(addDays(today, 3), "dd/MM"), done: false }] },
];

export interface Course {
  id: string;
  name: string;
  type: "idioma" | "curso";
  progress: number;
  activities: { name: string; due: string; done: boolean }[];
}

export const mockCourses: Course[] = [
  { id: "1", name: "Inglês Avançado", type: "idioma", progress: 65, activities: [{ name: "Speaking practice", due: format(addDays(today, 1), "dd/MM"), done: false }, { name: "Essay writing", due: format(addDays(today, 4), "dd/MM"), done: false }] },
  { id: "2", name: "AWS Cloud Practitioner", type: "curso", progress: 40, activities: [{ name: "Módulo 5 - Networking", due: format(addDays(today, 3), "dd/MM"), done: false }] },
];

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  icon: string;
  bank?: string;
  paymentMethod?: "débito" | "crédito" | "pix";
  installments?: number;
  currentInstallment?: number;
  tag?: string;
}

export const mockFinances = {
  balance: 2847.50,
  income: 3500.00,
  expenses: 652.50,
  budget: 1200.00,
  fixedExpenses: [
    { id: "f1", name: "Aluguel", amount: 900, bank: "Nubank", dueDay: 10 },
    { id: "f2", name: "Internet", amount: 99, bank: "Itaú", dueDay: 15 },
    { id: "f3", name: "Netflix", amount: 39.90, bank: "Nubank", dueDay: 20 },
    { id: "f4", name: "Academia", amount: 89, bank: "Nubank", dueDay: 5 },
  ],
  transactions: [
    { id: "1", description: "Mercado", amount: -35, category: "Alimentação", date: format(today, "dd/MM"), icon: "🛒", bank: "Nubank", paymentMethod: "débito" as const, tag: "essencial" },
    { id: "2", description: "Uber", amount: -12, category: "Transporte", date: format(subDays(today, 1), "dd/MM"), icon: "🚗", bank: "Nubank", paymentMethod: "pix" as const, tag: "transporte" },
    { id: "3", description: "Salário", amount: 3500, category: "Renda", date: format(subDays(today, 5), "dd/MM"), icon: "💰", bank: "Itaú", tag: "salário" },
    { id: "4", description: "Internet", amount: -99, category: "Contas", date: format(subDays(today, 8), "dd/MM"), icon: "📡", bank: "Itaú", paymentMethod: "débito" as const, tag: "fixa" },
    { id: "5", description: "Restaurante", amount: -45, category: "Alimentação", date: format(subDays(today, 2), "dd/MM"), icon: "🍽️", bank: "Nubank", paymentMethod: "crédito" as const, installments: 3, currentInstallment: 1, tag: "lazer" },
    { id: "6", description: "Freelance", amount: 800, category: "Renda Extra", date: format(subDays(today, 3), "dd/MM"), icon: "💻", bank: "Nubank", paymentMethod: "pix" as const, tag: "extra" },
  ] as Transaction[],
};

export const mockCareerGoals = [
  { id: "1", title: "Conseguir estágio em TI", progress: 45, status: "em andamento" },
  { id: "2", title: "Certificação AWS Cloud", progress: 20, status: "em andamento" },
  { id: "3", title: "Portfólio completo", progress: 60, status: "em andamento" },
  { id: "4", title: "Atualizar LinkedIn", progress: 100, status: "concluído" },
];

export const mockSkills = [
  { name: "SQL", level: 60 }, { name: "React", level: 75 }, { name: "Python", level: 40 },
  { name: "Git", level: 80 }, { name: "AWS", level: 20 },
];

export const mockLanguages = [
  { name: "Português", level: "Nativo" },
  { name: "Inglês", level: "Avançado (B2)" },
  { name: "Espanhol", level: "Básico (A2)" },
];

export const mockCertifications = [
  { id: "1", name: "AWS Cloud Practitioner", status: "em andamento", deadline: format(addDays(today, 60), "dd/MM/yyyy") },
  { id: "2", name: "Google Analytics", status: "concluído", deadline: "" },
];

export const mockFutureGoals = [
  "Ser desenvolvedor full-stack em 2 anos",
  "Trabalhar remoto para empresa internacional",
  "Lançar um produto SaaS próprio",
];

export const mockNotifications = [
  { id: "1", title: "Prova de Banco de Dados amanhã", type: "urgente" as const, time: "Agora", read: false },
  { id: "2", title: "Hábito 'Treino' pendente hoje", type: "lembrete" as const, time: "2h atrás", read: false },
  { id: "3", title: "Tarefa 'Pagar internet' vence sexta", type: "aviso" as const, time: "3h atrás", read: false },
  { id: "4", title: "Orçamento de Alimentação 80% usado", type: "alerta" as const, time: "5h atrás", read: true },
  { id: "5", title: "Meta 'Atualizar LinkedIn' concluída!", type: "sucesso" as const, time: "Ontem", read: true },
];

export const mockChatMessages = [
  { id: "1", role: "user" as const, content: "Tenho prova amanhã de banco de dados", timestamp: "09:15" },
  { id: "2", role: "ai" as const, content: "Entendi! Registrei sua **prova de Banco de Dados** para amanhã e criei uma **tarefa de estudo** para hoje. Boa sorte! 📚", timestamp: "09:15", actions: [{ module: "Estudos", action: "Prova registrada para amanhã" }, { module: "Tarefas", action: "Tarefa 'Estudar BD' criada para hoje" }, { module: "Agenda", action: "Evento adicionado ao calendário" }] },
  { id: "3", role: "user" as const, content: "Gastei R$ 35 no mercado", timestamp: "12:30" },
  { id: "4", role: "ai" as const, content: "Despesa registrada em **Finanças**: **R$ 35,00** na categoria **Mercado/Alimentação**. 🛒", timestamp: "12:30", actions: [{ module: "Finanças", action: "R$ 35 registrado como despesa" }] },
  { id: "5", role: "user" as const, content: "Já fiz meu treino", timestamp: "18:45" },
  { id: "6", role: "ai" as const, content: "Perfeito! Seu hábito **Treino** foi marcado como concluído hoje. Você está em uma sequência de **6 dias**! 💪🔥", timestamp: "18:45", actions: [{ module: "Hábitos", action: "Treino marcado como concluído" }] },
];

export const quickPrompts = [
  "Tenho prova amanhã",
  "Gastei R$ 50 no almoço",
  "Já estudei hoje",
  "Lembrar de pagar conta",
  "Quero organizar meu plano de carreira",
];

export const mockProfile = {
  name: "Lucas Silva",
  email: "lucas@email.com",
  salary: 3500,
  address: {
    cep: "01001-000",
    street: "Rua da Consolação",
    number: "123",
    city: "São Paulo",
    state: "SP",
  },
};
