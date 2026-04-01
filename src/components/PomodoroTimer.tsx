import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";
import { motion } from "framer-motion";
import { useFocusModeStore } from "@/stores/focusModeStore";

export default function PomodoroTimer() {
  const { pomodoroMinutes, pomodoroBreak } = useFocusModeStore();
  const [isBreak, setIsBreak] = useState(false);
  const [seconds, setSeconds] = useState(pomodoroMinutes * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds(s => s - 1), 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, seconds]);

  useEffect(() => {
    if (seconds === 0) {
      setRunning(false);
      if (!isBreak) {
        setIsBreak(true);
        setSeconds(pomodoroBreak * 60);
      } else {
        setIsBreak(false);
        setSeconds(pomodoroMinutes * 60);
      }
    }
  }, [seconds, isBreak, pomodoroMinutes, pomodoroBreak]);

  const reset = () => {
    setRunning(false);
    setIsBreak(false);
    setSeconds(pomodoroMinutes * 60);
  };

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const totalSecs = isBreak ? pomodoroBreak * 60 : pomodoroMinutes * 60;
  const progress = ((totalSecs - seconds) / totalSecs) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-4 border ${isBreak ? "bg-accent/10 border-accent/30" : "bg-primary/5 border-primary/30"}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isBreak ? <Coffee className="w-4 h-4 text-accent-foreground" /> : <Play className="w-4 h-4 text-primary" />}
          <span className="text-sm font-semibold">{isBreak ? "Pausa" : "Pomodoro"}</span>
        </div>
        <span className="text-xs text-muted-foreground">🎯 Modo Foco</span>
      </div>

      <div className="text-center mb-3">
        <span className="text-4xl font-bold tabular-nums">
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </span>
      </div>

      <div className="w-full h-1.5 rounded-full bg-muted mb-3">
        <div
          className={`h-full rounded-full transition-all ${isBreak ? "bg-accent" : "bg-primary"}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setRunning(!running)}
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center active:scale-95 transition-transform"
        >
          {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={reset}
          className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center active:scale-95 transition-transform"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
