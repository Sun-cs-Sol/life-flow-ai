import { motion } from "framer-motion";
import { Bell, AlertTriangle, Clock, CheckCircle, Info } from "lucide-react";
import { mockNotifications } from "@/data/mockData";

const typeConfig: Record<string, { icon: any; color: string }> = {
  urgente: { icon: AlertTriangle, color: "text-destructive bg-destructive/10" },
  lembrete: { icon: Clock, color: "text-warning bg-warning/10" },
  aviso: { icon: Info, color: "text-info bg-info/10" },
  alerta: { icon: Bell, color: "text-warning bg-warning/10" },
  sucesso: { icon: CheckCircle, color: "text-success bg-success/10" },
};

export default function NotificationsPage() {
  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-5">Notificações</h1>

      <div className="space-y-2">
        {mockNotifications.map((n, i) => {
          const config = typeConfig[n.type];
          const Icon = config.icon;
          return (
            <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`flex items-start gap-3 p-4 rounded-2xl border ${n.read ? "bg-card border-border/50 opacity-60" : "bg-card border-border/50"}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
