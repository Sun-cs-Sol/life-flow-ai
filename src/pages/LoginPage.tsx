import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import mascotIcon from "@/assets/mascot-icon.png";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background px-6 pt-16 pb-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <img src={mascotIcon} alt="Astra" className="w-12 h-12 rounded-xl mascot-img" />
          <span className="font-bold text-xl">Astra</span>
        </div>
        <h1 className="text-2xl font-bold mb-1">{isLogin ? "Bem-vindo de volta" : "Crie sua conta"}</h1>
        <p className="text-muted-foreground">{isLogin ? "Entre para acessar sua organização" : "Comece a organizar sua vida agora"}</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
        {!isLogin && (
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input type="text" placeholder="Seu nome" className="w-full h-14 rounded-2xl bg-secondary pl-12 pr-4 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition" />
          </div>
        )}
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input type="email" placeholder="E-mail" className="w-full h-14 rounded-2xl bg-secondary pl-12 pr-4 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition" />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input type={showPass ? "text" : "password"} placeholder="Senha" className="w-full h-14 rounded-2xl bg-secondary pl-12 pr-12 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition" />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {isLogin && <button type="button" className="text-sm text-primary self-end -mt-1">Esqueceu a senha?</button>}

        <button type="submit" className="w-full h-14 rounded-2xl gradient-primary text-primary-foreground font-semibold text-base mt-4 active:scale-[0.98] transition-transform">
          {isLogin ? "Entrar" : "Criar conta"}
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">ou</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button type="button" onClick={() => navigate("/dashboard")} className="w-full h-14 rounded-2xl border border-border bg-card font-medium flex items-center justify-center gap-3 active:scale-[0.98] transition-transform">
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Continuar com Google
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        {isLogin ? "Não tem conta?" : "Já tem conta?"}{" "}
        <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-semibold">{isLogin ? "Cadastre-se" : "Fazer login"}</button>
      </p>
    </div>
  );
}
