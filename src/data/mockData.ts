import { format, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

const today = new Date();
const tomorrow = addDays(today, 1);
const friday = addDays(today, (5 - today.getDay() + 7) % 7 || 7);

export const mockTasks = [
  { id: "1", title: "Pagar internet", category: "Finanças", priority: "alta" as const, dueDate: format(friday, "yyyy-MM-dd"), done: false },
  { id: "2", title: "Estudar Banco de Dados", category: "Estudos", priority: "alta" as const, dueDate: format(today, "yyyy-MM-dd"), done: false },
  { id: "3", title: "Entregar trabalho de IHC", category: "Estudos", priority: "média" as const, dueDate: format(addDays(today, 3), "yyyy-MM-dd"), done: false },
  { id: "4", title: "Revisar currículo", category: "Carreira", priority: "média" as const, dueDate: format(addDays(today, 5), "yyyy-MM-dd"), done: false },
  { id: "5", title: "Comprar material de estudo", category: "Estudos", priority: "baixa" as const, dueDate: format(addDays(today, 2), "yyyy-MM-dd"), done: true },
  { id: "6", title: "Enviar relatório do projeto", category: "Projetos", priority: "alta" as const, dueDate: format(tomorrow, "yyyy-MM-dd"), done: false },
];

export const mockHabits = [
  { id: "1", name: "Beber água", icon: "💧", done: true, streak: 12 },
  { id: "2", name: "Treino", icon: "🏋️", done: false, streak: 5 },
  { id: "3", name: "Leitura", icon: "📖", done: false, streak: 8 },
  { id: "4", name: "Estudar inglês", icon: "🇬🇧", done: true, streak: 15 },
  { id: "5", name: "Meditação", icon: "🧘", done: false, streak: 3 },
  { id: "6", name: "Dormir antes das 23h", icon: "😴", done: false, streak: 2 },
];

export const mockSubjects = [
  { id: "1", name: "Banco de Dados", professor: "Prof. Ricardo", schedule: "Seg/Qua 19h", nextExam: format(tomorrow, "dd/MM"), color: "hsl(168, 70%, 38%)" },
  { id: "2", name: "IHC", professor: "Prof. Ana", schedule: "Ter/Qui 19h", nextExam: format(addDays(today, 10), "dd/MM"), color: "hsl(217, 91%, 60%)" },
  { id: "3", name: "Desenvolvimento Web", professor: "Prof. Carlos", schedule: "Ter/Qui 21h", nextExam: format(addDays(today, 15), "dd/MM"), color: "hsl(38, 92%, 50%)" },
  { id: "4", name: "Engenharia de Software", professor: "Prof. Maria", schedule: "Seg/Qua 21h", nextExam: format(addDays(today, 20), "dd/MM"), color: "hsl(142, 71%, 45%)" },
];

export const mockFinances = {
  balance: 2847.50,
  income: 3500.00,
  expenses: 652.50,
  budget: 1200.00,
  transactions: [
    { id: "1", description: "Mercado", amount: -35, category: "Alimentação", date: format(today, "dd/MM"), icon: "🛒" },
    { id: "2", description: "Uber", amount: -12, category: "Transporte", date: format(subDays(today, 1), "dd/MM"), icon: "🚗" },
    { id: "3", description: "Salário", amount: 3500, category: "Renda", date: format(subDays(today, 5), "dd/MM"), icon: "💰" },
    { id: "4", description: "Internet", amount: -99, category: "Contas", date: format(subDays(today, 8), "dd/MM"), icon: "📡" },
    { id: "5", description: "Restaurante", amount: -45, category: "Alimentação", date: format(subDays(today, 2), "dd/MM"), icon: "🍽️" },
    { id: "6", description: "Freelance", amount: 800, category: "Renda Extra", date: format(subDays(today, 3), "dd/MM"), icon: "💻" },
  ],
};

export const mockCareerGoals = [
  { id: "1", title: "Conseguir estágio em TI", progress: 45, status: "em andamento" },
  { id: "2", title: "Certificação AWS Cloud", progress: 20, status: "em andamento" },
  { id: "3", title: "Portfólio completo", progress: 60, status: "em andamento" },
  { id: "4", title: "Atualizar LinkedIn", progress: 100, status: "concluído" },
];

export const mockProjects = [
  {
    id: "1", name: "LifeOrg App", description: "App de organização pessoal com IA", progress: 35,
    tasks: ["Pesquisa de mercado", "Definir requisitos", "Criar protótipo", "Desenvolvimento", "Testes"],
    completedTasks: 2,
  },
  {
    id: "2", name: "Portfólio Web", description: "Site pessoal com projetos", progress: 70,
    tasks: ["Design", "Desenvolvimento", "Deploy", "Conteúdo"],
    completedTasks: 3,
  },
];

export const mockNotifications = [
  { id: "1", title: "Prova de Banco de Dados amanhã", type: "urgente" as const, time: "Agora", read: false },
  { id: "2", title: "Hábito 'Treino' pendente hoje", type: "lembrete" as const, time: "2h atrás", read: false },
  { id: "3", title: "Tarefa 'Pagar internet' vence sexta", type: "aviso" as const, time: "3h atrás", read: false },
  { id: "4", title: "Orçamento de Alimentação 80% usado", type: "alerta" as const, time: "5h atrás", read: true },
  { id: "5", title: "Meta 'Atualizar LinkedIn' concluída!", type: "sucesso" as const, time: "Ontem", read: true },
];

export const mockChatMessages = [
  {
    id: "1",
    role: "user" as const,
    content: "Tenho prova amanhã de banco de dados",
    timestamp: "09:15",
  },
  {
    id: "2",
    role: "ai" as const,
    content: "Entendi! Registrei sua **prova de Banco de Dados** para amanhã e criei uma **tarefa de estudo** para hoje. Boa sorte! 📚",
    timestamp: "09:15",
    actions: [
      { module: "Estudos", action: "Prova registrada para amanhã" },
      { module: "Tarefas", action: "Tarefa 'Estudar BD' criada para hoje" },
      { module: "Agenda", action: "Evento adicionado ao calendário" },
    ],
  },
  {
    id: "3",
    role: "user" as const,
    content: "Gastei R$ 35 no mercado",
    timestamp: "12:30",
  },
  {
    id: "4",
    role: "ai" as const,
    content: "Despesa registrada em **Finanças**: **R$ 35,00** na categoria **Mercado/Alimentação**. 🛒",
    timestamp: "12:30",
    actions: [
      { module: "Finanças", action: "R$ 35 registrado como despesa" },
    ],
  },
  {
    id: "5",
    role: "user" as const,
    content: "Já fiz meu treino",
    timestamp: "18:45",
  },
  {
    id: "6",
    role: "ai" as const,
    content: "Perfeito! Seu hábito **Treino** foi marcado como concluído hoje. Você está em uma sequência de **6 dias**! 💪🔥",
    timestamp: "18:45",
    actions: [
      { module: "Hábitos", action: "Treino marcado como concluído" },
    ],
  },
];

export const quickPrompts = [
  "Tenho prova amanhã",
  "Gastei R$ 50 no almoço",
  "Já estudei hoje",
  "Lembrar de pagar conta",
  "Quero organizar meu plano de carreira",
  "Cria um projeto novo",
];
