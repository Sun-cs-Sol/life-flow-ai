import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, ChevronRight, BookOpen, CheckSquare, Wallet, Flame, TrendingUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { mockChatMessages, quickPrompts } from "@/data/mockData";
import mascotIcon from "@/assets/mascot-icon.png";

const moduleIcons: Record<string, any> = {
  Estudos: BookOpen,
  Tarefas: CheckSquare,
  Finanças: Wallet,
  Hábitos: Flame,
  Carreira: TrendingUp,
  Agenda: BookOpen,
};

const moduleColors: Record<string, string> = {
  Estudos: "text-primary bg-primary/10",
  Tarefas: "text-info bg-info/10",
  Finanças: "text-warning bg-warning/10",
  Hábitos: "text-destructive bg-destructive/10",
  Carreira: "text-success bg-success/10",
  Agenda: "text-info bg-info/10",
};

type ChatMessage = {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
  actions?: { module: string; action: string }[];
};

const simulatedResponses: Record<string, { content: string; actions: { module: string; action: string }[] }> = {
  "prova": {
    content: "Entendi! Registrei sua **prova** e criei uma **tarefa de estudo** para hoje. 📚",
    actions: [
      { module: "Estudos", action: "Prova registrada" },
      { module: "Tarefas", action: "Tarefa de estudo criada" },
      { module: "Agenda", action: "Evento adicionado" },
    ],
  },
  "gastei": {
    content: "Despesa registrada em **Finanças**! 💰",
    actions: [{ module: "Finanças", action: "Despesa registrada" }],
  },
  "treino": {
    content: "Perfeito! Hábito **Treino** marcado como concluído hoje! 💪🔥",
    actions: [{ module: "Hábitos", action: "Treino concluído" }],
  },
  "lembrar": {
    content: "Criei uma **tarefa com lembrete** pra você! ⏰",
    actions: [
      { module: "Tarefas", action: "Tarefa com prazo criada" },
      { module: "Agenda", action: "Lembrete adicionado" },
    ],
  },
  "carreira": {
    content: "Ótimo! Criei uma **meta em Carreira** e sugeri um plano inicial para você. 🚀",
    actions: [{ module: "Carreira", action: "Meta criada com plano sugerido" }],
  },
  "projeto": {
    content: "Projeto criado! Você pode adicionar tarefas e marcos a ele. 📋",
    actions: [{ module: "Tarefas", action: "Projeto criado" }],
  },
  "estudei": {
    content: "Ótimo! Sessão de estudo registrada. Continue assim! 📖",
    actions: [{ module: "Estudos", action: "Sessão registrada" }, { module: "Hábitos", action: "Estudo marcado" }],
  },
  "default": {
    content: "Entendi! Vou organizar isso para você. ✨",
    actions: [{ module: "Tarefas", action: "Ação registrada" }],
  },
};

function getResponse(msg: string) {
  const lower = msg.toLowerCase();
  for (const key of Object.keys(simulatedResponses)) {
    if (key !== "default" && lower.includes(key)) return simulatedResponses[key];
  }
  return simulatedResponses["default"];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(text);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: response.content,
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        actions: response.actions,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] max-w-lg mx-auto">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Welcome */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center text-center pt-12 px-4">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">Chat LifeOrg</h2>
            <p className="text-sm text-muted-foreground mb-8">Fale o que precisa e eu organizo automaticamente nos módulos certos.</p>
          </div>
        )}

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[85%] ${msg.role === "user" ? "" : ""}`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "gradient-primary text-primary-foreground rounded-br-md"
                  : "bg-card border border-border/50 rounded-bl-md"
              }`}>
                {msg.role === "ai" ? (
                  <div className="prose prose-sm max-w-none [&>p]:m-0">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : msg.content}
              </div>

              {/* Action cards */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {msg.actions.map((action, i) => {
                    const Icon = moduleIcons[action.module] || CheckSquare;
                    const colorClass = moduleColors[action.module] || "text-primary bg-primary/10";
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * (i + 1) }}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-card border border-border/50"
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${colorClass}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-muted-foreground font-medium">{action.module}</p>
                          <p className="text-xs font-medium truncate">{action.action}</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                      </motion.div>
                    );
                  })}
                </div>
              )}

              <p className={`text-[10px] text-muted-foreground mt-1 ${msg.role === "user" ? "text-right" : ""}`}>{msg.timestamp}</p>
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 px-4 py-3 bg-card border border-border/50 rounded-2xl rounded-bl-md w-fit">
            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot" />
            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {quickPrompts.map((p) => (
            <button key={p} onClick={() => sendMessage(p)}
              className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted transition-colors"
            >{p}</button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 bg-card border border-border/50 rounded-2xl px-4 py-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Fale o que precisa organizar..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center disabled:opacity-40 transition-opacity active:scale-95"
          >
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
