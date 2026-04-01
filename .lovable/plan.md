

# Plano de Implementação — Evolução Completa do Astra

## Visão Geral

Seis grandes blocos de trabalho para transformar o Astra num sistema real de organização para universitários. O estado atual usa dados mock em memória (sem backend), então tudo será implementado com estado local (localStorage para persistência básica) e preparado para futura integração com Supabase.

---

## 1. Onboarding Guiado (3 passos)

**Arquivo:** `src/pages/OnboardingPage.tsx` (reescrever)
**Novo arquivo:** `src/stores/userStore.ts` (Zustand com persist/localStorage)

O onboarding atual tem apenas 1 slide de apresentação. Será expandido para um fluxo interativo de 3 passos após o slide de boas-vindas:

- **Passo 1:** Campo "Qual é o seu nome?" + seletor de cor do tema (4-5 opções de cor de destaque)
- **Passo 2:** "Quais áreas são prioridade?" — checkboxes visuais com ícones: Estudos, Trabalho, Finanças, Saúde mental
- **Passo 3:** "Seu primeiro objetivo desta semana" — campo de texto livre com placeholder motivacional

Ao concluir, salva no `userStore` (nome, prioridades, objetivo) e redireciona para `/dashboard`. Na próxima visita, pula direto para login. O dashboard usará o nome do store em vez do hardcoded "Lucas".

---

## 2. Dashboard Unificado + FAB

**Arquivo:** `src/pages/DashboardPage.tsx` (reescrever)
**Novo componente:** `src/components/QuickAddFAB.tsx`

Reestruturar o dashboard com:

- **Saudação dinâmica** com hora do dia ("Bom dia/tarde/noite, {nome}!")
- **Bloco "Hoje"** — card único com resumo cruzado: próximas 3 tarefas pendentes, próxima prova/aula, total gasto hoje
- **Cards de área** compactos (Estudos, Finanças, Hábitos) com métricas resumidas e acesso rápido
- **Manter** o CTA do chat e os quick modules atuais

**FAB (Floating Action Button):** Botão `+` flutuante fixo no canto inferior direito (acima da nav), presente em todas as telas via `AppShell.tsx`. Ao clicar, abre um menu radial/sheet com 3 opções: "Nova tarefa", "Novo gasto", "Nova aula/estudo". Cada opção abre um mini-formulário em dialog.

---

## 3. Finanças com Orçamento por Categoria

**Arquivo:** `src/pages/FinancesPage.tsx` (reescrever)
**Novo arquivo:** `src/stores/financesStore.ts` (Zustand + localStorage)

O módulo atual já tem registro de gastos, mas falta orçamento por categoria. Mudanças:

- **Store dedicada** com: transações, orçamentos por categoria, saldo
- **Orçamento por categoria:** tela de configuração onde o usuário define limite mensal para cada categoria (Alimentação, Transporte, Lazer, Saúde, Educação, Outros)
- **Barras de progresso** por categoria mostrando % usado vs limite
- **Alerta visual** (badge vermelho + toast) quando categoria ultrapassa 80%
- **Card de saldo:** "Você tem R$X disponíveis esse mês" no topo
- **Manter** funcionalidades existentes (registro com banco, método de pagamento, parcelas, tags)
- **Estados vazios:** mensagem encorajadora + botão "Registre seu primeiro gasto"

---

## 4. Daily Briefing com IA

**Novo componente:** `src/components/DailyBriefing.tsx`
**Integração:** `src/pages/DashboardPage.tsx`

Card no topo do dashboard que aparece uma vez por dia:

- **Sem backend inicialmente:** gerar o briefing localmente com lógica baseada nos dados do app (tarefas pendentes hoje, provas nos próximos 2 dias, % do orçamento usado)
- **Estrutura do card:** ícone do mascote + texto resumo + frase motivacional (rotação de ~20 frases pré-definidas) + botão "Dispensar"
- **Persistência:** salvar no localStorage a data do último briefing mostrado; não repetir no mesmo dia
- **Preparado para IA:** quando Lovable Cloud for habilitado, substituir a lógica local por chamada à edge function com prompt contextual

---

## 5. Progresso e Streak

**Novo componente:** `src/components/ProgressStats.tsx`
**Integração:** `src/pages/ProfilePage.tsx` + `src/pages/DashboardPage.tsx`

- **Streak de uso:** contador de dias consecutivos usando o app (salvo em localStorage com data do último acesso)
- **Tarefas da semana:** contador de tarefas concluídas nos últimos 7 dias
- **Barras de progresso semanal** por área (Estudos: atividades feitas / total, Finanças: % dentro do orçamento, Hábitos: % concluídos)
- **Celebração:** animação com confetti (biblioteca `canvas-confetti` ou CSS keyframes simples) ao completar uma tarefa ou bater meta diária de hábitos
- Exibir no Perfil como seção dedicada e versão compacta no Dashboard

---

## 6. Modo "Semana de Provas"

**Novo arquivo:** `src/stores/focusModeStore.ts`
**Novo componente:** `src/components/PomodoroTimer.tsx`
**Integração:** `src/pages/StudiesPage.tsx` + `src/components/AppShell.tsx` + `src/pages/DashboardPage.tsx`

- **Botão "Modo Foco"** na página de Estudos — toggle que ativa/desativa
- **Quando ativo:**
  - Header do AppShell muda de cor (borda roxa mais intensa ou badge "🎯 Modo Foco")
  - Dashboard reordena: estudos primeiro, oculta seções de carreira/hábitos menos relevantes
  - Timer Pomodoro aparece fixo no topo do dashboard (25min trabalho / 5min pausa, com controles play/pause/reset)
- **Persistência:** estado salvo em localStorage; desativa automaticamente após 7 dias ou manualmente

---

## Ajustes Transversais

- **Estados vazios em todas as páginas:** quando lista vazia, mostrar mascote + mensagem encorajadora + botão de ação primária
- **Fonte mínima 14px:** auditar todos os `text-[10px]` e `text-[9px]` e subir para `text-xs` (12px) no mínimo em textos de corpo; manter micro-labels como exceção
- **Contraste:** revisar cores de `text-muted-foreground` contra backgrounds claros para garantir ratio WCAG AA

---

## Ordem de Implementação

1. `userStore.ts` + Onboarding guiado (base para personalização)
2. `financesStore.ts` + Finanças com orçamento por categoria
3. Dashboard unificado + Daily Briefing
4. FAB de ação rápida no AppShell
5. Progresso/Streak + celebrações
6. Modo Foco + Pomodoro

---

## Arquivos Impactados

| Arquivo | Ação |
|---|---|
| `src/stores/userStore.ts` | Criar |
| `src/stores/financesStore.ts` | Criar |
| `src/stores/focusModeStore.ts` | Criar |
| `src/components/QuickAddFAB.tsx` | Criar |
| `src/components/DailyBriefing.tsx` | Criar |
| `src/components/ProgressStats.tsx` | Criar |
| `src/components/PomodoroTimer.tsx` | Criar |
| `src/pages/OnboardingPage.tsx` | Reescrever |
| `src/pages/DashboardPage.tsx` | Reescrever |
| `src/pages/FinancesPage.tsx` | Reescrever |
| `src/pages/ProfilePage.tsx` | Editar (adicionar streak/progresso) |
| `src/pages/StudiesPage.tsx` | Editar (botão Modo Foco) |
| `src/components/AppShell.tsx` | Editar (FAB + indicador Modo Foco) |
| `src/data/mockData.ts` | Editar (frases motivacionais) |

