import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, format, startOfWeek, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

const events = [
  { title: "Prova de Banco de Dados", time: "19:00", type: "prova", date: addDays(new Date(), 1) },
  { title: "Estudar BD", time: "14:00 - 16:00", type: "estudo", date: new Date() },
  { title: "Pagar internet", time: "Dia todo", type: "tarefa", date: addDays(new Date(), (5 - new Date().getDay() + 7) % 7 || 7) },
  { title: "Aula IHC", time: "19:00 - 21:00", type: "aula", date: new Date() },
  { title: "Treino", time: "07:00", type: "hábito", date: new Date() },
  { title: "Entregar trabalho IHC", time: "23:59", type: "tarefa", date: addDays(new Date(), 3) },
];

const typeColors: Record<string, string> = {
  prova: "bg-warning/10 text-warning border-warning/20",
  estudo: "bg-primary/10 text-primary border-primary/20",
  tarefa: "bg-info/10 text-info border-info/20",
  aula: "bg-accent text-accent-foreground border-border/50",
  hábito: "bg-success/10 text-success border-success/20",
};

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const dayEvents = events.filter(e => isSameDay(e.date, selectedDate));

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-5">Agenda</h1>

      {/* Week view */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setSelectedDate(prev => addDays(prev, -7))} className="p-2"><ChevronLeft className="w-4 h-4" /></button>
        <span className="text-sm font-semibold capitalize">{format(selectedDate, "MMMM yyyy", { locale: ptBR })}</span>
        <button onClick={() => setSelectedDate(prev => addDays(prev, 7))} className="p-2"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="flex justify-between mb-6">
        {weekDays.map((day) => {
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, selectedDate);
          return (
            <button key={day.toISOString()} onClick={() => setSelectedDate(day)}
              className={`flex flex-col items-center gap-1 py-2 px-2.5 rounded-2xl transition-colors ${
                isSelected ? "gradient-primary text-primary-foreground" : ""
              }`}
            >
              <span className={`text-[10px] font-medium ${isSelected ? "" : "text-muted-foreground"}`}>
                {format(day, "EEE", { locale: ptBR }).slice(0, 3)}
              </span>
              <span className={`text-sm font-bold ${isSelected ? "" : isToday ? "text-primary" : ""}`}>{format(day, "d")}</span>
              {events.some(e => isSameDay(e.date, day)) && !isSelected && (
                <div className="w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Events */}
      <h2 className="text-sm font-semibold mb-3">{format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}</h2>
      <div className="space-y-2">
        {dayEvents.length > 0 ? dayEvents.map((e, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`p-4 rounded-2xl border ${typeColors[e.type]}`}
          >
            <p className="text-sm font-semibold">{e.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs">{e.time}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-card/50 font-medium">{e.type}</span>
            </div>
          </motion.div>
        )) : (
          <div className="text-center py-12 text-muted-foreground text-sm">Nenhum evento para este dia</div>
        )}
      </div>
    </div>
  );
}
