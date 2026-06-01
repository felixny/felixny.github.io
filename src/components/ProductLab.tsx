"use client";

import {
  Activity,
  Bell,
  Check,
  ChevronRight,
  Cpu,
  Database,
  Map,
  Plus,
  ReceiptText,
  RotateCcw,
  Save,
  Search,
  SlidersHorizontal,
  Trash2,
  WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type ProjectId = "home" | "evenmint" | "travel" | "pulsepoint" | "vision" | "emerald";
type LabNote =
  | "local product surface"
  | "integer-cents recalculation"
  | "largest-remainder allocation"
  | "status recomputed locally";
type SplitMethod = "equal" | "custom";
type MonthStatus = "paid" | "partial" | "unpaid";

type Person = {
  id: string;
  name: string;
};

type Participant = {
  personId: string;
  ratioValue: number;
};

type ExpenseRow = {
  id: string;
  name: string;
  amountInput: string;
  category: string;
  splitMethod: SplitMethod;
  participants: Participant[];
};

type PaymentRow = {
  personId: string;
  amountInput: string;
};

type MonthCalculationResult = {
  subtotalCents: number;
  billsSubtotalCents: number;
  effectiveDiscountCents: number;
  billsAfterCreditCents: number;
  totalAfterDiscountCents: number;
  totalPaidCents: number;
  unpaidCents: number;
  monthStatus: MonthStatus;
  preDiscountShareByPerson: Record<string, number>;
  discountShareByPerson: Record<string, number>;
  shareAfterDiscountByPerson: Record<string, number>;
  paidByPerson: Record<string, number>;
  remainingByPerson: Record<string, number>;
};

type Destination = {
  id: string;
  name: string;
  country: string;
  region: "Asia" | "Europe" | "Americas" | "Africa" | "Oceania" | "Middle East";
  category: "City" | "Nature" | "Beach" | "Culture" | "Food" | "Adventure";
  description: string;
  highlight: string;
  bestMonth: string;
  tags: string[];
  hotspot: boolean;
  saved: boolean;
};

type PulseMode = "Fintech" | "Sports" | "Rewards";

type TickerItem = {
  symbol: string;
  label: string;
  value: number;
  change: number;
  history: number[];
};

type LabProject = {
  id: ProjectId;
  label: string;
  shortLabel: string;
  description: string;
  proof: string[];
};

const people: Person[] = [
  { id: "you", name: "You" },
  { id: "roommate", name: "Roommate" },
  { id: "guest", name: "Guest" },
];

const projects: LabProject[] = [
  {
    id: "home",
    label: "Felix Product Lab",
    shortLabel: "Home",
    description: "Interactive micro-demos from real projects.",
    proof: [
      "Product UI, state machines, Android systems, automation, and data tooling",
      "Local React state previews with no backend or private files",
      "Projects run as focused product demos instead of static portfolio cards",
    ],
  },
  {
    id: "evenmint",
    label: "Evenmint Ledger Lab",
    shortLabel: "Evenmint",
    description: "A working household settlement engine with integer-cents math.",
    proof: [
      "React 19, TypeScript, Vite, Tailwind CSS v4 in the real app",
      "Supabase/Postgres/Auth, React Query, and Vercel deployment",
      "Integer-cents settlement logic with largest-remainder allocation",
    ],
  },
  {
    id: "travel",
    label: "Travel Lab",
    shortLabel: "Travel",
    description: "A destination browser inspired by the full-stack bucket-list app.",
    proof: [
      "React 18, TypeScript, React Router, Tailwind CSS, Lucide React",
      "Supabase Auth, Express API, AWS S3 image uploads",
      "Search, filters, saved trips, Unsplash, and REST Countries integration",
    ],
  },
  {
    id: "pulsepoint",
    label: "PulsePoint Lab",
    shortLabel: "PulsePoint",
    description: "A web simulation of high-frequency Android live updates.",
    proof: [
      "Kotlin 2.1, Jetpack Compose, Material 3, Hilt",
      "MVI state model backed by Coroutines and Flow",
      "300ms ticker stream, 60 FPS animation goals, foreground live updates",
    ],
  },
  {
    id: "vision",
    label: "Vision Automation Lab",
    shortLabel: "Vision Lab",
    description: "A local macOS computer-vision automation control surface.",
    proof: [
      "Python screen capture and OpenCV-style image processing",
      "Keyboard replay state machine with config-driven navigation",
      "Electron UI, WebSocket minimap bridge, optional Gemini/Telegram integrations",
    ],
  },
  {
    id: "emerald",
    label: "Emerald Studio Lab",
    shortLabel: "Emerald Studio",
    description: "A local save-data editor and binary data tooling workflow.",
    proof: [
      "TypeScript, React 19, Vite, Tauri, Vitest",
      "Binary save parsing, Japanese text encoding, data tables",
      "EXP growth formulas, party stat recalculation, checksum refresh",
    ],
  },
];

const bootLines = [
  "initializing product lab",
  "mounting project demos",
  "loading ledger engine",
  "ready",
];

const exemptCategory = "flat_adjustment";
const projectKana: Record<ProjectId, string> = {
  home: "ホーム",
  evenmint: "家計",
  travel: "旅行",
  pulsepoint: "相場",
  vision: "視覚",
  emerald: "工房",
};

const proofTags = [
  "Product UI",
  "State Machines",
  "Integer-Cents Math",
  "Computer Vision",
  "Android Systems",
  "Binary Data Tools",
];

const labTagMap: Record<Exclude<ProjectId, "home" | "evenmint">, string[]> = {
  travel: ["Product UI", "State Machines"],
  pulsepoint: ["Product UI", "State Machines", "Android Systems"],
  vision: ["Computer Vision", "State Machines"],
  emerald: ["Binary Data Tools", "Product UI"],
};

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function parseDollarsToCents(input: string): number {
  const cleaned = input.trim().replace(/,/g, "");
  if (!cleaned) return 0;
  const parsed = Number.parseFloat(cleaned);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.round(parsed * 100);
}

function centsToInput(cents: number): string {
  return (cents / 100).toFixed(2);
}

function formatMoney(cents: number): string {
  return usd.format(cents / 100);
}

function allocateProportionalCents(
  amountCents: number,
  entries: { key: string; weight: number }[],
): Record<string, number> {
  const output: Record<string, number> = {};
  entries.forEach((entry) => {
    output[entry.key] = 0;
  });

  if (amountCents <= 0 || entries.length === 0) return output;
  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
  if (totalWeight <= 0) return output;

  const floors = [...entries]
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((entry) => {
      const raw = (amountCents * entry.weight) / totalWeight;
      const base = Math.floor(raw);
      return { key: entry.key, base, fraction: raw - base };
    });

  floors.forEach((entry) => {
    output[entry.key] = entry.base;
  });

  const baseSum = floors.reduce((sum, entry) => sum + entry.base, 0);
  const remainder = amountCents - baseSum;
  const order = [...floors].sort((a, b) => {
    if (b.fraction !== a.fraction) return b.fraction - a.fraction;
    return a.key.localeCompare(b.key);
  });

  for (let index = 0; index < remainder; index += 1) {
    output[order[index].key] += 1;
  }

  return output;
}

function mergeAdd(target: Record<string, number>, delta: Record<string, number>) {
  Object.entries(delta).forEach(([key, value]) => {
    target[key] = (target[key] ?? 0) + value;
  });
}

function expenseAmountCents(expense: ExpenseRow): number {
  return parseDollarsToCents(expense.amountInput);
}

function allocateExpenseItem(expense: ExpenseRow): Record<string, number> {
  const participants = expense.participants;
  if (participants.length === 0) return {};
  const entries =
    expense.splitMethod === "equal"
      ? participants.map((participant) => ({ key: participant.personId, weight: 1 }))
      : participants.map((participant) => ({
          key: participant.personId,
          weight: Math.max(0, participant.ratioValue),
        }));

  return allocateProportionalCents(expenseAmountCents(expense), entries);
}

function isExemptFromMonthCredit(expense: ExpenseRow): boolean {
  return expense.category === exemptCategory || expense.participants.length === 1;
}

function computeMonthCalculation(
  expenses: ExpenseRow[],
  payments: PaymentRow[],
  discountCents: number,
): MonthCalculationResult {
  const billExpenses = expenses.filter((expense) => !isExemptFromMonthCredit(expense));
  const flatExpenses = expenses.filter(isExemptFromMonthCredit);
  const subtotalCents = expenses.reduce((sum, expense) => sum + expenseAmountCents(expense), 0);
  const billsSubtotalCents = billExpenses.reduce((sum, expense) => sum + expenseAmountCents(expense), 0);

  const flatByPerson: Record<string, number> = {};
  flatExpenses.forEach((expense) => mergeAdd(flatByPerson, allocateExpenseItem(expense)));
  const flatTotal = Object.values(flatByPerson).reduce((sum, value) => sum + value, 0);

  const preBillByPerson: Record<string, number> = {};
  billExpenses.forEach((expense) => mergeAdd(preBillByPerson, allocateExpenseItem(expense)));

  const preDiscountShareByPerson: Record<string, number> = { ...preBillByPerson };
  mergeAdd(preDiscountShareByPerson, flatByPerson);

  const effectiveDiscountCents = Math.min(Math.max(0, discountCents), billsSubtotalCents);
  const billsAfterCreditCents = billsSubtotalCents - effectiveDiscountCents;

  const householdIds = Array.from(
    new Set(billExpenses.flatMap((expense) => expense.participants.map((participant) => participant.personId))),
  ).sort((a, b) => a.localeCompare(b));

  const shareAfterBills =
    householdIds.length > 0
      ? allocateProportionalCents(
          billsAfterCreditCents,
          householdIds.map((key) => ({ key, weight: 1 })),
        )
      : {};

  const discountShareByPerson: Record<string, number> = {};
  householdIds.forEach((id) => {
    discountShareByPerson[id] = (preBillByPerson[id] ?? 0) - (shareAfterBills[id] ?? 0);
  });

  const shareAfterDiscountByPerson: Record<string, number> = { ...shareAfterBills };
  mergeAdd(shareAfterDiscountByPerson, flatByPerson);

  const paidByPerson: Record<string, number> = {};
  payments.forEach((payment) => {
    paidByPerson[payment.personId] = (paidByPerson[payment.personId] ?? 0) + parseDollarsToCents(payment.amountInput);
  });

  const totalAfterDiscountCents = billsAfterCreditCents + flatTotal;
  const totalPaidCents = Object.values(paidByPerson).reduce((sum, value) => sum + value, 0);
  const unpaidCents = totalAfterDiscountCents - totalPaidCents;
  const monthStatus: MonthStatus = unpaidCents <= 0 ? "paid" : totalPaidCents === 0 ? "unpaid" : "partial";

  const personIds = Array.from(
    new Set([
      ...people.map((person) => person.id),
      ...Object.keys(shareAfterDiscountByPerson),
      ...Object.keys(paidByPerson),
    ]),
  );

  const remainingByPerson: Record<string, number> = {};
  personIds.forEach((id) => {
    remainingByPerson[id] = (shareAfterDiscountByPerson[id] ?? 0) - (paidByPerson[id] ?? 0);
  });

  return {
    subtotalCents,
    billsSubtotalCents,
    effectiveDiscountCents,
    billsAfterCreditCents,
    totalAfterDiscountCents,
    totalPaidCents,
    unpaidCents,
    monthStatus,
    preDiscountShareByPerson,
    discountShareByPerson,
    shareAfterDiscountByPerson,
    paidByPerson,
    remainingByPerson,
  };
}

function seedExpenses(): ExpenseRow[] {
  return [
    {
      id: "rent",
      name: "Rent",
      amountInput: "2400.00",
      category: "housing",
      splitMethod: "equal",
      participants: [
        { personId: "you", ratioValue: 1 },
        { personId: "roommate", ratioValue: 1 },
      ],
    },
    {
      id: "groceries",
      name: "Groceries",
      amountInput: "186.25",
      category: "food",
      splitMethod: "equal",
      participants: [
        { personId: "you", ratioValue: 1 },
        { personId: "roommate", ratioValue: 1 },
      ],
    },
    {
      id: "internet",
      name: "Internet",
      amountInput: "80.00",
      category: "utilities",
      splitMethod: "equal",
      participants: [
        { personId: "you", ratioValue: 1 },
        { personId: "roommate", ratioValue: 1 },
      ],
    },
    {
      id: "utilities",
      name: "Utilities",
      amountInput: "142.70",
      category: "utilities",
      splitMethod: "custom",
      participants: [
        { personId: "you", ratioValue: 2 },
        { personId: "roommate", ratioValue: 2 },
        { personId: "guest", ratioValue: 1 },
      ],
    },
    {
      id: "flat-adjustment",
      name: "Guest flat adjustment",
      amountInput: "300.00",
      category: exemptCategory,
      splitMethod: "equal",
      participants: [{ personId: "guest", ratioValue: 1 }],
    },
  ];
}

function seedPayments(): PaymentRow[] {
  return [
    { personId: "you", amountInput: "1800.00" },
    { personId: "roommate", amountInput: "900.00" },
    { personId: "guest", amountInput: "300.00" },
  ];
}

function personName(id: string): string {
  return people.find((person) => person.id === id)?.name ?? id;
}

function getSeasonMeta(month = new Date().getMonth()) {
  if (month >= 2 && month <= 4) return { kanji: "春", particle: "#F4B4C6", label: "spring" };
  if (month >= 5 && month <= 7) return { kanji: "夏", particle: "#90C695", label: "summer" };
  if (month >= 8 && month <= 10) return { kanji: "秋", particle: "#D4763B", label: "autumn" };
  return { kanji: "冬", particle: "#D4E4F7", label: "winter" };
}

function panelClass(extra = "") {
  return `rounded-lg border border-[var(--lab-border)] bg-[var(--lab-surface-2)] text-[var(--lab-text)] shadow-[inset_0_1px_0_rgba(245,240,230,0.035),0_18px_60px_rgba(0,0,0,0.20)] ${extra}`;
}

function inputClass(extra = "") {
  return `product-lab-mono min-h-10 rounded-md border border-[var(--lab-border)] bg-[var(--lab-surface)]/80 px-3 py-2 text-sm text-[var(--lab-text)] outline-none transition placeholder:text-[var(--lab-muted)] focus:border-[var(--lab-gold)] focus:bg-[var(--lab-surface)] focus:ring-2 focus:ring-[var(--lab-gold)]/20 ${extra}`;
}

function buttonClass(active = false, extra = "") {
  return `product-lab-mono inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-medium uppercase tracking-[0.08em] transition ${
    active
      ? "border-[var(--lab-red)] bg-[var(--lab-red)] text-white shadow-sm"
      : "border-[var(--lab-border)] bg-[var(--lab-surface)] text-[var(--lab-text)] hover:border-[rgba(245,240,230,0.14)] hover:text-[var(--lab-gold)]"
  } ${extra}`;
}

function metric(label: string, value: string, tone: "neutral" | "red" | "green" = "neutral", extra = "") {
  const color =
    tone === "red" ? "text-[var(--lab-red)]" : tone === "green" ? "text-[var(--lab-green)]" : "text-[var(--lab-text)]";
  return (
    <div className={`min-w-0 rounded-md border border-[var(--lab-border)] bg-[var(--lab-surface)] p-3 ${extra}`}>
      <div className="product-lab-mono text-[10px] uppercase tracking-[0.14em] text-[var(--lab-muted)]">{label}</div>
      <div className={`product-lab-mono mt-1 text-right text-xl tabular-nums ${color}`}>{value}</div>
    </div>
  );
}

function FlashValue({
  label,
  value,
  tone = "neutral",
  flash = false,
}: {
  label: string;
  value: string;
  tone?: "neutral" | "red" | "green";
  flash?: boolean;
}) {
  const color =
    tone === "red" ? "text-[var(--lab-red)]" : tone === "green" ? "text-[var(--lab-green)]" : "text-[var(--lab-text)]";
  return (
    <div
      className={`min-w-0 rounded-lg border border-[var(--lab-border)] bg-[var(--lab-surface)]/80 p-4 transition ${
        flash ? "ring-4 ring-[var(--lab-gold)]/20" : ""
      }`}
    >
      <div className="product-lab-mono text-[9px] uppercase tracking-[0.18em] text-[var(--lab-gold)]">{label}</div>
      <div className={`product-lab-display mt-2 min-w-[7rem] text-3xl font-medium tracking-normal tabular-nums ${color}`}>{value}</div>
    </div>
  );
}

function SplitSummaryRow({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "red" | "green";
}) {
  const color =
    tone === "red" ? "text-[var(--lab-red)]" : tone === "green" ? "text-[var(--lab-green)]" : "text-[var(--lab-text)]";

  return (
    <div className="flex min-w-0 items-center justify-between gap-4 rounded-md border border-[var(--lab-border)] bg-[var(--lab-surface-2)]/60 px-3 py-2.5">
      <span className="product-lab-mono min-w-0 truncate text-[10px] uppercase tracking-[0.14em] text-[var(--lab-muted)]">
        {label}
      </span>
      <span className={`product-lab-mono shrink-0 text-right text-lg tabular-nums ${color}`}>{value}</span>
    </div>
  );
}

export default function ProductLab() {
  const [booting, setBooting] = useState(true);
  const [activeProject, setActiveProject] = useState<ProjectId>("home");
  const [labNote, setLabNote] = useState<LabNote>("local product surface");

  useEffect(() => {
    const timer = window.setTimeout(() => setBooting(false), 1320);
    return () => window.clearTimeout(timer);
  }, []);

  const selectedProject = projects.find((project) => project.id === activeProject) ?? projects[0];

  return (
    <div className="product-lab-shell relative min-h-screen overflow-hidden bg-[var(--lab-bg)] text-[var(--lab-text)]">
      <SeasonalParticles />
      {booting ? <BootSequence /> : null}
      <div className={booting ? "opacity-0" : "relative z-10 opacity-100 transition-opacity duration-500"}>
        <div className="mx-auto grid min-h-screen w-full max-w-[1720px] grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
          <aside className="product-lab-stagger hidden border-r border-[var(--lab-border)] bg-[var(--lab-surface)]/95 p-6 backdrop-blur xl:flex xl:flex-col">
            <IdentityBlock />
            <nav className="mt-12 space-y-1" aria-label="Project switcher">
              {projects.map((project) => (
                <button
                  key={project.id}
                  className={`group flex w-full items-center justify-between border-l-2 px-4 py-3 text-left text-sm transition ${
                    activeProject === project.id
                      ? "border-[var(--lab-gold)] text-[var(--lab-gold)]"
                      : "border-transparent text-[var(--lab-muted)] hover:text-[var(--lab-text)]"
                  }`}
                  onClick={() => setActiveProject(project.id)}
                >
                  <span>{project.shortLabel}</span>
                  <span className="product-lab-jp text-[9px] text-[var(--lab-gold)]/55">{projectKana[project.id]}</span>
                </button>
              ))}
            </nav>
            <SidebarLinks />
          </aside>

          <header className="sticky top-0 z-30 border-b border-[var(--lab-border)] bg-[var(--lab-bg)]/92 px-4 py-3 backdrop-blur xl:hidden">
            <div className="flex items-center justify-between gap-3">
              <IdentityBlock compact />
              <span className="product-lab-mono text-sm text-[var(--lab-gold)]">☰</span>
            </div>
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Projects">
              {projects.map((project) => (
                <button
                  key={project.id}
                  className={`product-lab-mono shrink-0 rounded-md border px-3 py-2 text-[11px] ${
                    activeProject === project.id
                      ? "border-[var(--lab-gold)] text-[var(--lab-gold)]"
                      : "border-[var(--lab-border)] bg-[var(--lab-surface-2)]/60 text-[var(--lab-muted)]"
                  }`}
                  onClick={() => setActiveProject(project.id)}
                >
                  {project.shortLabel}
                </button>
              ))}
            </div>
          </header>

          <main id="main-content" tabIndex={-1} className="min-w-0 px-4 py-5 outline-none sm:px-6 lg:px-8 lg:py-8">
            <div className="product-lab-stagger mb-6 border-b border-[var(--lab-border)] pb-7" style={{ animationDelay: "100ms" }}>
              <div>
                <div className="product-lab-mono text-[10px] font-medium uppercase tracking-[0.32em] text-[var(--lab-gold)]">
                  Felix Product Lab
                </div>
                <h1 className="product-lab-display mt-3 text-5xl font-medium leading-none tracking-normal text-[var(--lab-text)] sm:text-[52px]">
                  {activeProject === "home" ? (
                    <>
                      Felix <span className="font-normal">Product Lab</span>
                    </>
                  ) : (
                    selectedProject.label
                  )}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--lab-muted)]">
                  {activeProject === "home"
                    ? "Interactive micro-demos from real projects. Built to show product UI, state, data logic, automation and systems work."
                    : selectedProject.description}
                </p>
              </div>
            </div>

            <div className="product-lab-panel-enter">
              {activeProject === "home" ? <LabHome onOpenLab={setActiveProject} /> : null}
              {activeProject === "evenmint" ? <EvenmintDemo onInteraction={setLabNote} /> : null}
              {activeProject === "travel" ? <TravelDemo /> : null}
              {activeProject === "pulsepoint" ? <PulsePointDemo /> : null}
              {activeProject === "vision" ? <VisionDemo /> : null}
              {activeProject === "emerald" ? <EmeraldDemo /> : null}
            </div>
          </main>

          <aside className="hidden border-t border-[var(--lab-border)] bg-[var(--lab-surface)]/95 p-5 backdrop-blur xl:block xl:border-l xl:border-t-0 xl:p-6">
            <ProofPanel project={selectedProject} note={activeProject === "evenmint" ? labNote : "local product surface"} />
          </aside>
        </div>
      </div>
    </div>
  );
}

function BootSequence() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--lab-bg)]">
      <div className="w-[min(28rem,calc(100vw-2rem))] border-y border-[var(--lab-border)] py-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="product-lab-mono text-xs font-medium uppercase tracking-[0.3em] text-[var(--lab-gold)]">Felix Product Lab</span>
          <span className="h-3 w-3 rounded-full bg-[var(--lab-green)]" />
        </div>
        <div className="product-lab-mono space-y-2 text-sm text-[var(--lab-text)]">
          {bootLines.map((line, index) => (
            <div
              key={line}
              className="translate-y-2 opacity-0 product-lab-boot-line"
              style={{ animationDelay: `${index * 220}ms` }}
            >
              <span className="text-[var(--lab-gold)]">&gt;</span> {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SeasonalParticles() {
  const season = getSeasonMeta();
  const particles = Array.from({ length: 30 }, (_, index) => ({
    id: index,
    top: (index * 37) % 100,
    left: -10 - ((index * 19) % 45),
    delay: -(index * 0.8),
    duration: 18 + (index % 7) * 4,
    size: 2 + (index % 3),
    opacity: 0.12 + (index % 4) * 0.025,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="product-lab-particle absolute rounded-[60%_35%_55%_40%]"
          style={{
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            width: `${particle.size + 2}px`,
            height: `${particle.size}px`,
            backgroundColor: season.particle,
            opacity: particle.opacity,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function IdentityBlock({ compact = false }: { compact?: boolean }) {
  const season = getSeasonMeta();
  return (
    <div>
      <div
        className={
          compact
            ? "product-lab-mono text-lg font-medium uppercase tracking-[0.2em] text-[var(--lab-text)]"
            : "product-lab-mono text-3xl font-medium uppercase tracking-[0.24em] text-[var(--lab-text)]"
        }
      >
        Felix
      </div>
      <div className={compact ? "mt-1 text-xs text-[var(--lab-muted)]" : "mt-4 text-sm text-[var(--lab-muted)]"}>
        Software Engineer
      </div>
      <div className={compact ? "product-lab-mono text-[10px] text-[var(--lab-muted)]" : "product-lab-mono mt-1 text-[10px] text-[var(--lab-muted)]"}>
        Boston-born · Japan-raised
      </div>
      <div className="product-lab-mono mt-3 text-[9px] uppercase tracking-[0.22em] text-[var(--lab-gold)]">
        <span className="product-lab-jp">{season.kanji}</span> · BOSTON
      </div>
    </div>
  );
}

function SidebarLinks() {
  const links = [
    { label: "GitHub", href: "https://github.com/felixny" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/felixny/" },
  ];

  return (
    <div className="mt-auto border-t border-[var(--lab-border)] pt-5">
      <div className="product-lab-mono flex gap-2 text-xs text-[var(--lab-muted)]">
        {links.map((link, index) => (
          <a key={link.label} href={link.href} className="transition hover:text-[var(--lab-gold)]">
            {link.label}
            {index === 0 ? " ·" : ""}
          </a>
        ))}
      </div>
      <a
        href="mailto:felixynx@gmail.com"
        className="product-lab-mono mt-4 block text-[11px] text-[var(--lab-muted)] transition hover:text-[var(--lab-text)]"
      >
        felixynx@gmail.com
      </a>
      <div className="product-lab-jp mt-4 text-[9px] text-[var(--lab-gold)]/60">よろしくお願いします</div>
    </div>
  );
}

function ProofPanel({ project, note }: { project: LabProject; note: LabNote }) {
  const [now, setNow] = useState<Date | null>(null);
  const season = getSeasonMeta();

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const time = now
    ? new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" }).format(now)
    : "--:--";
  const date = now
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        timeZone: "America/New_York",
      }).format(now)
    : "";

  return (
    <div className="product-lab-stagger sticky top-6" data-signal={note} style={{ animationDelay: "400ms" }}>
      <div className="product-lab-mono mb-8 text-[9px] font-medium uppercase tracking-[0.24em] text-[var(--lab-gold)]">
        Lab Notes
      </div>
      <div className="product-lab-mono text-3xl text-[var(--lab-text)]">{time}</div>
      <div className="mt-2 text-sm text-[var(--lab-muted)]">{date}</div>
      <div className="product-lab-mono mt-4 text-[10px] uppercase tracking-[0.14em] text-[var(--lab-muted)]">
        Boston, MA · UTC-4
      </div>
      <div className="product-lab-jp mt-10 text-5xl text-[var(--lab-gold)]/20">{season.kanji}</div>
      <div className="mt-10 flex items-center gap-2 text-xs text-[var(--lab-text)]">
        <span className="h-2 w-2 rounded-full bg-[var(--lab-green)]" />
        Available for opportunities
      </div>
      <div className="my-8 h-px bg-[var(--lab-border)]" />
      <div className="space-y-5 text-xs leading-6 text-[var(--lab-muted)]">
        <p>{project.proof[0]}</p>
        <p>Local React state previews. No backend or private files.</p>
        <p>Projects run as focused demos.</p>
      </div>
    </div>
  );
}

function LabHome({ onOpenLab }: { onOpenLab: (project: ProjectId) => void }) {
  const [previewTick, setPreviewTick] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const previewCalculation = useMemo(
    () => computeMonthCalculation(seedExpenses(), seedPayments(), parseDollarsToCents("100.00")),
    [],
  );

  useEffect(() => {
    const timer = window.setInterval(() => setPreviewTick((current) => current + 1), 900);
    return () => window.clearInterval(timer);
  }, []);

  const launchLabs: Array<{
    id: Exclude<ProjectId, "home" | "evenmint">;
    title: string;
    description: string;
    preview: "travel" | "pulse" | "vision" | "emerald";
  }> = [
    {
      id: "travel",
      title: "Travel Lab",
      description: "Destination browser with search, filters and saved trips.",
      preview: "travel",
    },
    {
      id: "pulsepoint",
      title: "PulsePoint Lab",
      description: "Live ticker simulation with animated updates.",
      preview: "pulse",
    },
    {
      id: "vision",
      title: "Vision Lab",
      description: "Computer vision automation control panel simulation.",
      preview: "vision",
    },
    {
      id: "emerald",
      title: "Emerald Studio",
      description: "Save-data editor simulation with stat recalculation and checksum status.",
      preview: "emerald",
    },
  ];

  return (
    <div className="space-y-6">
      <section
        className="product-lab-stagger overflow-hidden rounded-xl bg-[linear-gradient(135deg,#1A1A24_0%,#16161E_100%)] p-5 shadow-[-4px_0_20px_rgba(192,57,43,0.08),inset_2px_0_0_var(--lab-red)] sm:p-7"
        style={{ animationDelay: "200ms" }}
      >
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="flex flex-col justify-between">
            <div>
              <div className="product-lab-mono text-[9px] font-medium uppercase tracking-[0.3em] text-[var(--lab-gold)]">Featured Lab</div>
              <h2 className="product-lab-display mt-3 text-[38px] font-medium leading-tight tracking-normal text-[var(--lab-text)]">
                Evenmint Ledger Lab
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--lab-muted)]">
                A working household settlement engine with editable expenses, people, payments, monthly credit
                and integer-cents math.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className={buttonClass(true, "px-5")} onClick={() => onOpenLab("evenmint")}>
                Open Evenmint Lab
                <ChevronRight className="h-4 w-4" />
              </button>
              <span className="product-lab-mono inline-flex min-h-10 items-center rounded-md border border-[var(--lab-border)] px-3 text-[11px] uppercase tracking-[0.1em] text-[var(--lab-muted)]">
                live demo
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--lab-border)] bg-[var(--lab-surface-2)] p-5 shadow-[inset_0_1px_0_rgba(245,240,230,0.04)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="product-lab-mono text-sm text-[var(--lab-text)]">May Household</div>
                <div className="text-xs text-[var(--lab-muted)]">compact ledger preview</div>
              </div>
              <span className="product-lab-mono rounded-full bg-[var(--lab-gold)]/10 px-2.5 py-1 text-[10px] uppercase text-[var(--lab-gold)]">
                {previewCalculation.monthStatus}
              </span>
            </div>
            <div className="space-y-2">
              {["Rent", "Groceries", "Internet"].map((label, index) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-md border border-[var(--lab-border)] bg-[var(--lab-surface)] px-3 py-2.5"
                >
                  <span className="text-sm">{label}</span>
                  <span className="product-lab-mono text-sm">
                    {index === 0 ? "$2,400.00" : index === 1 ? "$186.25" : "$80.00"}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <FlashValue
                label="After credit"
                value={formatMoney(previewCalculation.totalAfterDiscountCents + (previewTick % 2 === 0 ? 0 : 1))}
                flash={previewTick % 2 === 1}
              />
              <FlashValue
                label="Remaining"
                value={formatMoney(previewCalculation.unpaidCents)}
                tone={previewCalculation.unpaidCents > 0 ? "red" : "green"}
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="product-lab-display text-3xl font-medium text-[var(--lab-text)]">Launch Labs</h2>
            <p className="mt-1 text-sm text-[var(--lab-muted)]">Small running previews from the rest of the system.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {proofTags.map((chip) => (
                <button
                  key={chip}
                  className={`product-lab-mono rounded-full border px-3 py-1 text-[9px] uppercase tracking-[0.1em] transition ${
                    activeFilter === chip
                      ? "border-[var(--lab-gold)] text-[var(--lab-gold)]"
                      : "border-[var(--lab-border)] text-[var(--lab-muted)] hover:border-[rgba(245,240,230,0.14)]"
                  }`}
                  onClick={() => setActiveFilter(activeFilter === chip ? null : chip)}
                >
                  {chip}
                </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {launchLabs.map((lab, index) => {
            const matches = !activeFilter || labTagMap[lab.id].includes(activeFilter);
            const wide = lab.id === "travel" || lab.id === "emerald";
            return (
            <button
              key={lab.id}
              className={`product-lab-stagger group rounded-[10px] border border-[var(--lab-border)] bg-[var(--lab-surface)] p-5 text-left transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(245,240,230,0.14)] ${
                wide ? "md:col-span-2" : ""
              } ${matches ? "opacity-100" : "opacity-30"}`}
              style={{ animationDelay: `${300 + index * 50}ms` }}
              onClick={() => onOpenLab(lab.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="product-lab-display text-2xl font-medium">{lab.title}</h3>
                  <p className="mt-2 max-w-sm text-xs leading-6 text-[var(--lab-muted)]">{lab.description}</p>
                </div>
                <span className="product-lab-mono flex items-center gap-1.5 text-[9px] uppercase tracking-[0.12em] text-[var(--lab-muted)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--lab-green)]" />
                  live demo
                </span>
              </div>
              <div className="mt-5">
                <MiniPreview kind={lab.preview} tick={previewTick} />
              </div>
              <div className="product-lab-mono mt-5 inline-flex items-center gap-2 text-xs text-[var(--lab-gold)]">
                Open
                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </button>
          );
          })}
        </div>
      </section>
    </div>
  );
}

function MiniPreview({ kind, tick }: { kind: "travel" | "pulse" | "vision" | "emerald"; tick: number }) {
  if (kind === "pulse") {
    return (
      <div className="rounded-lg border border-[var(--lab-border)] bg-[var(--lab-surface-2)] p-4">
        <div className="product-lab-mono flex items-center justify-between text-xs text-[var(--lab-muted)]">
          <span>BTC/USD</span>
          <span className={tick % 2 ? "text-[var(--lab-green)]" : "text-[var(--lab-red)]"}>
            {tick % 2 ? "+0.8%" : "-0.3%"}
          </span>
        </div>
        <Sparkline values={[3, 5, 4 + (tick % 2), 7, 6 + (tick % 3), 8 + (tick % 4)]} positive={tick % 2 === 1} animated />
      </div>
    );
  }
  if (kind === "vision") {
    return (
      <div className="relative h-28 overflow-hidden rounded-lg border border-[var(--lab-border)] bg-[var(--lab-bg)]">
        {[30, 58].map((top) => (
          <div key={top} className="absolute left-5 right-5 h-1 rounded-full bg-[var(--lab-text)]/10" style={{ top: `${top}%` }} />
        ))}
        <div className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 bg-[var(--lab-gold)]" style={{ left: `${18 + (tick % 5) * 13}%` }} />
      </div>
    );
  }
  if (kind === "emerald") {
    return (
      <div className="rounded-lg border border-[var(--lab-border)] bg-[var(--lab-surface-2)] p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Slot 1 stat preview</span>
          <span className="product-lab-mono rounded-full bg-[var(--lab-green)]/12 px-2 py-1 text-[10px] text-[var(--lab-green)]">checksum ok</span>
        </div>
        <div className="product-lab-mono mt-4 grid grid-cols-3 gap-2 text-xs">
          {["HP 142", "ATK 91", "SPD 104"].map((item) => (
            <span key={item} className="rounded bg-[var(--lab-surface)] p-3">{item}</span>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-[var(--lab-border)] bg-[var(--lab-surface-2)] p-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-[var(--lab-gold)]" />
        <div className="h-2 flex-1 rounded-full bg-[var(--lab-border)]" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {["Tokyo", "Iceland", "Bali"].map((item) => (
          <span key={item} className="rounded-md bg-[var(--lab-surface)] px-2 py-4 text-center text-xs">{item}</span>
        ))}
      </div>
    </div>
  );
}

function EvenmintDemo({ onInteraction }: { onInteraction: (note: LabNote) => void }) {
  const [expenses, setExpenses] = useState<ExpenseRow[]>(seedExpenses);
  const [payments, setPayments] = useState<PaymentRow[]>(seedPayments);
  const [discountInput, setDiscountInput] = useState("100.00");
  const [flash, setFlash] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({ utilities: true });

  const calculation = useMemo(
    () => computeMonthCalculation(expenses, payments, parseDollarsToCents(discountInput)),
    [discountInput, expenses, payments],
  );

  useEffect(() => {
    setFlash(true);
    const timer = window.setTimeout(() => setFlash(false), 420);
    return () => window.clearTimeout(timer);
  }, [calculation.totalAfterDiscountCents, calculation.totalPaidCents, calculation.unpaidCents]);

  function updateExpense(id: string, patch: Partial<ExpenseRow>, note: LabNote = "integer-cents recalculation") {
    onInteraction(note);
    setExpenses((current) => current.map((expense) => (expense.id === id ? { ...expense, ...patch } : expense)));
  }

  function toggleParticipant(expense: ExpenseRow, personId: string) {
    const exists = expense.participants.some((participant) => participant.personId === personId);
    const participants = exists
      ? expense.participants.filter((participant) => participant.personId !== personId)
      : [...expense.participants, { personId, ratioValue: 1 }];
    updateExpense(expense.id, { participants }, "largest-remainder allocation");
  }

  function updateRatio(expense: ExpenseRow, personId: string, ratioValue: number) {
    updateExpense(
      expense.id,
      {
        participants: expense.participants.map((participant) =>
          participant.personId === personId ? { ...participant, ratioValue } : participant,
        ),
      },
      "largest-remainder allocation",
    );
  }

  function addExpense() {
    onInteraction("integer-cents recalculation");
    setExpenses((current) => [
      ...current,
      {
        id: `expense-${Date.now()}`,
        name: "New shared line",
        amountInput: "0.00",
        category: "general",
        splitMethod: "equal",
        participants: [
          { personId: "you", ratioValue: 1 },
          { personId: "roommate", ratioValue: 1 },
        ],
      },
    ]);
  }

  function updatePayment(personId: string, amountInput: string) {
    onInteraction("status recomputed locally");
    setPayments((current) =>
      current.map((item) => (item.personId === personId ? { ...item, amountInput } : item)),
    );
  }

  function removeExpense(id: string) {
    onInteraction("integer-cents recalculation");
    setExpenses((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-5">
      <section className={panelClass("p-4 sm:p-5")}>
        <div className="grid gap-3 md:grid-cols-4">
          <FlashValue
            label="Total after credit"
            value={formatMoney(calculation.totalAfterDiscountCents)}
            flash={flash}
          />
          <FlashValue label="Paid total" value={formatMoney(calculation.totalPaidCents)} tone="green" flash={flash} />
          <FlashValue
            label="Remaining"
            value={formatMoney(calculation.unpaidCents)}
            tone={calculation.unpaidCents > 0 ? "red" : "green"}
            flash={flash}
          />
          <div className="rounded-lg border border-[#2A292E] bg-[#0C0C10] p-4 text-[#E8E4DC]">
            <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#E8E4DC]/40">Month status</div>
            <div className="mt-2 text-2xl font-black capitalize text-[#E8E4DC]">{calculation.monthStatus}</div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
        <div className="space-y-5">
          <section className={panelClass("overflow-hidden p-4 sm:p-5")}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <PanelTitle icon={ReceiptText} title="Month Ledger" />
                <p className="mt-2 text-sm leading-6 text-[#E8E4DC]/40">
                  Clean rows first. Expand a line when you want split participants, ratios, and allocation proof.
                </p>
              </div>
              <button className={buttonClass(true)} onClick={addExpense}>
                <Plus className="h-4 w-4" />
                Add expense
              </button>
            </div>

            <div className="space-y-4">
              {expenses.map((expense) => {
                const allocation = allocateExpenseItem(expense);
                const expanded = expandedRows[expense.id] ?? false;
                const showDetails = expanded || expense.splitMethod === "custom";
                return (
                  <div
                    key={expense.id}
                    className="rounded-xl border border-[#2A292E]/80 bg-[#13131A]/72 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]"
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="min-w-0 space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#E8E4DC]/40">Item</span>
                        <input
                          className={inputClass("w-full border-transparent bg-transparent px-0 text-base font-black focus:px-3")}
                          value={expense.name}
                          aria-label="Expense name"
                          onChange={(event) => updateExpense(expense.id, { name: event.target.value })}
                        />
                      </label>
                      <label className="min-w-0 space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#E8E4DC]/40">Amount</span>
                        <input
                          className={inputClass("h-10 w-full min-w-[7.5rem] text-right font-black tabular-nums")}
                          value={expense.amountInput}
                          inputMode="decimal"
                          aria-label="Amount"
                          onChange={(event) => updateExpense(expense.id, { amountInput: event.target.value })}
                          onBlur={() =>
                            updateExpense(expense.id, {
                              amountInput: centsToInput(expenseAmountCents(expense)),
                            })
                          }
                        />
                      </label>
                      <label className="min-w-0 space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#E8E4DC]/40">Category</span>
                        <select
                          className={inputClass("h-10 w-full")}
                          value={expense.category}
                          aria-label="Category"
                          onChange={(event) => updateExpense(expense.id, { category: event.target.value })}
                        >
                          <option value="housing">housing</option>
                          <option value="food">food</option>
                          <option value="utilities">utilities</option>
                          <option value="general">general</option>
                          <option value={exemptCategory}>flat adjustment</option>
                        </select>
                      </label>
                      <label className="min-w-0 space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#E8E4DC]/40">Split</span>
                        <select
                          className={inputClass("h-10 w-full min-w-[9rem]")}
                          value={expense.splitMethod}
                          aria-label="Split method"
                          onChange={(event) =>
                            updateExpense(
                              expense.id,
                              { splitMethod: event.target.value as SplitMethod },
                              "largest-remainder allocation",
                            )
                          }
                        >
                          <option value="equal">equal</option>
                          <option value="custom">custom ratio</option>
                        </select>
                      </label>
                      <div className="flex items-end gap-2 md:col-span-2 md:justify-end">
                        <button
                          className={buttonClass(expanded, "min-w-[112px]")}
                          onClick={() =>
                            setExpandedRows((current) => ({
                              ...current,
                              [expense.id]: !expanded,
                            }))
                          }
                        >
                          {expanded ? "Hide split" : "Split"}
                        </button>
                        <button
                          className="grid h-10 w-10 place-items-center rounded-md border border-transparent text-[#E8E4DC]/40 transition hover:border-[#C0392B]/35 hover:bg-[#C0392B]/10 hover:text-[#C0392B]"
                          onClick={() => removeExpense(expense.id)}
                          aria-label={`Remove ${expense.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {showDetails ? (
                      <div className="mt-6 grid gap-5 border-t border-[#2A292E]/85 pt-5 xl:grid-cols-[minmax(240px,0.9fr)_minmax(0,1.1fr)]">
                        <div className="rounded-lg border border-[#2A292E]/70 bg-[#1A1A24]/55 p-4">
                          <div className="mb-4 text-[11px] font-black uppercase tracking-[0.14em] text-[#E8E4DC]/40">
                            Participants
                          </div>
                          <div className="space-y-3">
                            {people.map((person) => {
                              const checked = expense.participants.some(
                                (participant) => participant.personId === person.id,
                              );
                              const ratio =
                                expense.participants.find((participant) => participant.personId === person.id)
                                  ?.ratioValue ?? 1;
                              return (
                                <label
                                  key={person.id}
                                  className={`flex min-h-12 w-full items-center gap-3 rounded-md border px-3 py-2 text-sm font-bold transition ${
                                    checked
                                      ? "border-[#C9A84C]/45 bg-[#C9A84C]/10 text-[#E8E4DC]"
                                      : "border-[#2A292E] bg-[#13131A] text-[#E8E4DC]/40"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleParticipant(expense, person.id)}
                                    className="h-4 w-4 shrink-0 accent-[#C9A84C]"
                                  />
                                  <span className="min-w-0 flex-1 truncate">{person.name}</span>
                                  <span className="shrink-0 text-[11px] font-black uppercase tracking-[0.12em] text-[#E8E4DC]/40">
                                    Ratio
                                  </span>
                                  <input
                                    className={inputClass("h-8 min-h-8 w-14 shrink-0 px-2 py-1 text-center tabular-nums disabled:opacity-45")}
                                    type="number"
                                    min="0"
                                    value={ratio}
                                    disabled={expense.splitMethod !== "custom" || !checked}
                                    aria-label={`${person.name} ratio`}
                                    onChange={(event) => updateRatio(expense, person.id, Number(event.target.value))}
                                  />
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        <div className="rounded-lg border border-[#2A292E]/70 bg-[#1A1A24]/55 p-4">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#E8E4DC]/40">
                              Allocation preview
                            </div>
                            {isExemptFromMonthCredit(expense) ? (
                              <span className="rounded-full bg-[#C9A84C]/10 px-2.5 py-1 text-[11px] font-bold uppercase text-[#C9A84C]">
                                credit-exempt
                              </span>
                            ) : null}
                          </div>
                          <div className="space-y-2">
                            {Object.entries(allocation).map(([personId, cents]) => (
                              <div
                                key={personId}
                                className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-[#2A292E]/70 bg-[#13131A] px-3 py-2"
                              >
                                <span className="min-w-0 truncate text-sm font-bold text-[#E8E4DC]/40">
                                  {personName(personId)}
                                </span>
                                <span className="shrink-0 text-right text-sm font-semibold tabular-nums text-[#E8E4DC]">
                                  {formatMoney(cents)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>

          <section className={panelClass("p-4 sm:p-5")}>
            <PanelTitle icon={SlidersHorizontal} title="Split Settings" />
            <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <label className="min-w-0 rounded-lg border border-[#2A292E]/80 bg-[#13131A]/80 p-4">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-[#E8E4DC]/40">Monthly credit</span>
                <input
                  className={inputClass("mt-3 h-11 w-full text-right text-lg font-black tabular-nums")}
                  value={discountInput}
                  inputMode="decimal"
                  onChange={(event) => {
                    onInteraction("integer-cents recalculation");
                    setDiscountInput(event.target.value);
                  }}
                  onBlur={() => setDiscountInput(centsToInput(parseDollarsToCents(discountInput)))}
                />
              </label>

              <div className="min-w-0 space-y-2 rounded-lg border border-[#2A292E]/80 bg-[#13131A]/80 p-4">
                <SplitSummaryRow label="Bills subtotal" value={formatMoney(calculation.billsSubtotalCents)} />
                <SplitSummaryRow
                  label="Effective credit"
                  value={formatMoney(calculation.effectiveDiscountCents)}
                  tone="red"
                />
                <SplitSummaryRow
                  label="Flat / exempt lines"
                  value={formatMoney(calculation.subtotalCents - calculation.billsSubtotalCents)}
                />
              </div>
            </div>
            <p className="mt-4 rounded-md border border-[#2A292E] bg-[#13131A]/80 p-3 text-sm leading-6 text-[#E8E4DC]/40">
              Monthly credit only reduces shared multi-participant bill lines. Single-person rows and flat adjustments
              stay outside the credit base.
            </p>
          </section>
        </div>

        <div className="space-y-5">
          <section className={panelClass(`overflow-hidden p-0 transition ${flash ? "ring-4 ring-[#C9A84C]/20" : ""}`)}>
            <div className="bg-[#0C0C10] p-6 text-[#E8E4DC]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#C9A84C]">Settlement Result</div>
                  <div className="mt-2 text-4xl font-black tracking-tight tabular-nums">
                    {formatMoney(calculation.unpaidCents)}
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${
                    calculation.monthStatus === "paid"
                      ? "bg-[#2EA043]/25 text-[#2EA043]"
                      : calculation.monthStatus === "partial"
                        ? "bg-[#C9A84C]/25 text-[#C0392B]"
                        : "bg-[#1A1A24]/70 text-[#E8E4DC]"
                  }`}
                >
                  {calculation.monthStatus}
                </span>
              </div>
              <div className="mt-3 text-sm text-[#E8E4DC]/40">Remaining after credit, flat lines, and recorded payments.</div>
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-2">
              {metric("Total expenses", formatMoney(calculation.subtotalCents))}
              {metric("Bills after credit", formatMoney(calculation.billsAfterCreditCents))}
              {metric("Total after discount", formatMoney(calculation.totalAfterDiscountCents))}
              {metric("Total paid", formatMoney(calculation.totalPaidCents), "green")}
            </div>
            <div className="space-y-3 px-4 pb-4">
              {people.map((person) => {
                const remaining = calculation.remainingByPerson[person.id] ?? 0;
                const state = remaining === 0 ? "Settled" : remaining > 0 ? "Owes" : "Overpaid";
                return (
                  <div key={person.id} className="rounded-lg border border-[#2A292E]/80 bg-[#13131A]/88 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xl font-black">{person.name}</div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${
                          remaining > 0
                            ? "bg-[#C9A84C]/15 text-[#C0392B]"
                            : remaining < 0
                              ? "bg-[#2EA043]/15 text-[#2EA043]"
                              : "bg-[#E8E4DC]/10 text-[#E8E4DC]/40"
                        }`}
                      >
                        {state}
                      </span>
                    </div>
                    <div className={`mt-3 text-2xl font-black tabular-nums ${remaining > 0 ? "text-[#C0392B]" : "text-[#2EA043]"}`}>
                      {formatMoney(remaining)}
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-[#E8E4DC]/40">
                      <span className="space-y-1">
                        <span className="block uppercase tracking-[0.12em]">Share</span>
                        <span className="block font-bold tabular-nums text-[#E8E4DC]">
                          {formatMoney(calculation.shareAfterDiscountByPerson[person.id] ?? 0)}
                        </span>
                      </span>
                      <span className="space-y-1">
                        <span className="block uppercase tracking-[0.12em]">Paid</span>
                        <span className="block font-bold tabular-nums text-[#E8E4DC]">
                          {formatMoney(calculation.paidByPerson[person.id] ?? 0)}
                        </span>
                      </span>
                      <span className="space-y-1">
                        <span className="block uppercase tracking-[0.12em]">Credit</span>
                        <span className="block font-bold tabular-nums text-[#E8E4DC]">
                          {formatMoney(calculation.discountShareByPerson[person.id] ?? 0)}
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className={panelClass("p-4 sm:p-5")}>
            <PanelTitle icon={WalletCards} title="Payments" />
            <div className="mt-4 space-y-3">
              {payments.map((payment) => (
                <label key={payment.personId} className="grid grid-cols-[1fr_140px] items-center gap-3">
                  <span className="text-sm font-black">{personName(payment.personId)}</span>
                  <input
                    className={inputClass("min-w-[8rem] text-right tabular-nums")}
                    value={payment.amountInput}
                    inputMode="decimal"
                    onChange={(event) => updatePayment(payment.personId, event.target.value)}
                    onBlur={() => updatePayment(payment.personId, centsToInput(parseDollarsToCents(payment.amountInput)))}
                  />
                </label>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function travelDestinations(): Destination[] {
  const rows = [
    ["tokyo", "Tokyo", "Japan", "Asia", "City", "Temples, ramen, precision transit and neon at night.", "Cherry blossoms in April", "Mar-May", ["temples", "ramen", "transit", "neon"], true],
    ["kyoto", "Kyoto", "Japan", "Asia", "Culture", "Shrines, machiya lanes, tea houses and quiet garden paths.", "Arashiyama mornings before the crowds", "Oct-Nov", ["shrines", "tea", "gardens", "heritage"], true],
    ["osaka", "Osaka", "Japan", "Asia", "Food", "Street food, comedy, castle parks and late-night shopping arcades.", "Takoyaki in Dotonbori after dark", "Mar-May", ["takoyaki", "arcades", "nightlife"], false],
    ["seoul", "Seoul", "South Korea", "Asia", "City", "Palaces, design districts, mountain hikes and all-night food streets.", "Bukchon hanok rooftops at sunset", "Apr-Jun", ["palaces", "k-food", "design"], false],
    ["taipei", "Taipei", "Taiwan", "Asia", "Food", "Night markets, hot springs, scooter lanes and forested city edges.", "Beef noodle crawl in Da'an", "Oct-Dec", ["night markets", "tea", "hot springs"], false],
    ["singapore", "Singapore", "Singapore", "Asia", "Food", "Hawker centers, gardens, tropical architecture and frictionless transit.", "Supertree lights from Marina Bay", "Feb-Apr", ["hawker", "gardens", "transit"], false],
    ["bangkok", "Bangkok", "Thailand", "Asia", "Food", "Canals, temples, rooftop views and fragrant street kitchens.", "Longtail boat ride through Thonburi", "Nov-Feb", ["temples", "street food", "markets"], false],
    ["bali", "Bali", "Indonesia", "Asia", "Beach", "Rice terraces, surf breaks, temple ceremonies and quiet stays.", "Ubud terraces after rain", "May-Sep", ["surf", "temples", "rice fields"], true],
    ["ho-chi-minh", "Ho Chi Minh City", "Vietnam", "Asia", "Food", "Motorbike rivers, cafe culture, markets and layered history.", "Banh mi breakfast in District 1", "Dec-Mar", ["cafes", "markets", "history"], false],
    ["hanoi", "Hanoi", "Vietnam", "Asia", "Culture", "Lakeside mornings, old-quarter alleys and slow bowls of pho.", "Train Street cafe timing", "Oct-Apr", ["old quarter", "pho", "lakes"], false],
    ["chiang-mai", "Chiang Mai", "Thailand", "Asia", "Culture", "Mountain temples, craft markets and northern Thai food.", "Lantern season in November", "Nov-Feb", ["temples", "craft", "mountains"], false],
    ["kathmandu", "Kathmandu", "Nepal", "Asia", "Adventure", "Stupas, trekking outfitters and Himalayan light over courtyards.", "Boudhanath at blue hour", "Oct-Nov", ["trekking", "stupas", "himalaya"], false],
    ["mumbai", "Mumbai", "India", "Asia", "City", "Art deco facades, sea breezes, markets and cinema energy.", "Marine Drive monsoon skies", "Nov-Feb", ["markets", "cinema", "coast"], false],
    ["rajasthan", "Rajasthan", "India", "Asia", "Culture", "Desert forts, painted havelis and royal train routes.", "Jodhpur blue city viewpoints", "Oct-Mar", ["forts", "desert", "heritage"], false],
    ["maldives", "Maldives", "Maldives", "Asia", "Beach", "Overwater villas, reef drop-offs and clear lagoon mornings.", "Manta season in Baa Atoll", "Jan-Apr", ["reefs", "manta", "lagoon"], false],
    ["hokkaido", "Hokkaido", "Japan", "Asia", "Nature", "Powder snow, flower fields, seafood markets and open roads.", "Lavender fields in Furano", "Jul-Aug", ["snow", "seafood", "roadtrip"], false],
    ["okinawa", "Okinawa", "Japan", "Asia", "Beach", "Coral water, island food, castle ruins and slow coastal drives.", "Kerama blue snorkeling", "Apr-Jun", ["coral", "islands", "beaches"], true],
    ["paris", "Paris", "France", "Europe", "Culture", "Museums, cafes, river walks and precise neighborhood rituals.", "Late museum nights at the Louvre", "Apr-Jun", ["museums", "cafes", "design"], false],
    ["rome", "Rome", "Italy", "Europe", "Culture", "Ancient ruins, espresso counters and warm stone streets.", "Forum views near golden hour", "Apr-May", ["ruins", "espresso", "piazzas"], false],
    ["barcelona", "Barcelona", "Spain", "Europe", "Culture", "Modernist buildings, markets, beaches and late dinners.", "Gaudi rooftops in morning light", "May-Jun", ["gaudi", "markets", "beach"], false],
    ["lisbon", "Lisbon", "Portugal", "Europe", "City", "Tile facades, hill trams, viewpoints and Atlantic light.", "Alfama tram bells at dusk", "Mar-Jun", ["tiles", "trams", "viewpoints"], true],
    ["amsterdam", "Amsterdam", "Netherlands", "Europe", "City", "Canals, bikes, design shops and intimate museums.", "Canal houses during tulip season", "Apr-May", ["canals", "bikes", "museums"], false],
    ["prague", "Prague", "Czechia", "Europe", "Culture", "Gothic lanes, river bridges and old-world beer halls.", "Charles Bridge before sunrise", "May-Sep", ["bridges", "beer", "gothic"], false],
    ["vienna", "Vienna", "Austria", "Europe", "Culture", "Coffee houses, opera, palaces and elegant transit.", "Sachertorte between museums", "Apr-Jun", ["opera", "coffee", "palaces"], false],
    ["budapest", "Budapest", "Hungary", "Europe", "Culture", "Thermal baths, ruin bars and grand riverfront architecture.", "Szechenyi baths in winter steam", "May-Jun", ["baths", "ruin bars", "danube"], false],
    ["santorini", "Santorini", "Greece", "Europe", "Beach", "White villages, volcanic cliffs and blue Aegean evenings.", "Caldera sunset from Imerovigli", "May-Jun", ["caldera", "sunset", "islands"], true],
    ["amalfi-coast", "Amalfi Coast", "Italy", "Europe", "Beach", "Cliff roads, lemon groves and sea-view villages.", "Path of the Gods hike", "May-Jun", ["lemons", "cliffs", "hiking"], false],
    ["dubrovnik", "Dubrovnik", "Croatia", "Europe", "Culture", "Stone walls, Adriatic swims and orange-roofed views.", "City walls at opening hour", "May-Jun", ["walls", "adriatic", "old town"], false],
    ["edinburgh", "Edinburgh", "Scotland", "Europe", "Culture", "Castle ridges, bookshops, closes and moody hills.", "Arthur's Seat after rain", "Aug-Sep", ["castle", "books", "hills"], false],
    ["reykjavik", "Reykjavik", "Iceland", "Europe", "Nature", "Colorful streets, geothermal pools and wild day trips.", "Northern lights outside the city", "Sep-Mar", ["aurora", "pools", "roadtrip"], true],
    ["copenhagen", "Copenhagen", "Denmark", "Europe", "City", "Harbor swims, design cafes and bike-first streets.", "Nyhavn in soft summer light", "Jun-Aug", ["design", "bikes", "harbor"], false],
    ["porto", "Porto", "Portugal", "Europe", "Food", "River bridges, azulejos, wine cellars and steep alleys.", "Douro sunset from Gaia", "Apr-Jun", ["azulejos", "wine", "bridges"], false],
    ["berlin", "Berlin", "Germany", "Europe", "City", "Galleries, clubs, modern history and generous public space.", "Museum Island after a gallery crawl", "May-Sep", ["galleries", "history", "nightlife"], false],
    ["stockholm", "Stockholm", "Sweden", "Europe", "City", "Island neighborhoods, subway art and cold-water edges.", "Archipelago ferry day trip", "Jun-Aug", ["islands", "design", "ferries"], false],
    ["new-york", "New York", "United States", "Americas", "City", "Neighborhood energy, museums, food walks and skyline drama.", "Dumplings in Flushing, jazz downtown", "Apr-Jun", ["museums", "food", "skyline"], false],
    ["san-francisco", "San Francisco", "United States", "Americas", "City", "Fog, hills, bookstores, ferries and Pacific-edge views.", "Golden Gate fog at sunrise", "Sep-Oct", ["fog", "ferries", "bookstores"], false],
    ["new-orleans", "New Orleans", "United States", "Americas", "Food", "Brass bands, Creole kitchens and porch-lit neighborhoods.", "Frenchmen Street after dinner", "Feb-Apr", ["jazz", "creole", "parades"], true],
    ["mexico-city", "Mexico City", "Mexico", "Americas", "Food", "Markets, museums, parks and layered neighborhoods.", "Tacos al pastor after museum day", "Mar-May", ["markets", "museums", "tacos"], false],
    ["havana", "Havana", "Cuba", "Americas", "Culture", "Pastel streets, live music and ocean-wall evenings.", "Malecon sunset with music nearby", "Nov-Apr", ["music", "old cars", "seawall"], false],
    ["buenos-aires", "Buenos Aires", "Argentina", "Americas", "Culture", "Bookshops, steak houses, tango halls and leafy avenues.", "El Ateneo bookshop afternoon", "Mar-May", ["tango", "bookshops", "steak"], false],
    ["rio", "Rio de Janeiro", "Brazil", "Americas", "Beach", "Granite peaks, samba, city beaches and forested overlooks.", "Sugarloaf at sunset", "May-Sep", ["samba", "beaches", "views"], false],
    ["cartagena", "Cartagena", "Colombia", "Americas", "Culture", "Colorful walls, Caribbean plazas and tropical nights.", "Getsemani murals and music", "Dec-Apr", ["walls", "caribbean", "murals"], true],
    ["patagonia", "Patagonia", "Argentina/Chile", "Americas", "Adventure", "Glacier lakes, wind, granite towers and long trail days.", "Torres del Paine sunrise", "Nov-Mar", ["glaciers", "trekking", "mountains"], true],
    ["machu-picchu", "Machu Picchu", "Peru", "Americas", "Adventure", "Cloud forest trails and Inca stonework above the valley.", "First bus arrival at the citadel", "May-Sep", ["inca", "trekking", "ruins"], false],
    ["vancouver", "Vancouver", "Canada", "Americas", "Nature", "Sea walls, mountain views and excellent Asian food.", "Stanley Park seawall at golden hour", "Jun-Sep", ["mountains", "seawall", "sushi"], false],
    ["quebec-city", "Quebec City", "Canada", "Americas", "Culture", "Fortified streets, winter light and French Canadian kitchens.", "Old Quebec after snowfall", "Dec-Feb", ["winter", "old town", "french"], false],
    ["marrakech", "Marrakech", "Morocco", "Africa", "Culture", "Medina lanes, riads, gardens and spice-market color.", "Jardin Majorelle blue walls", "Mar-May", ["medina", "riads", "spices"], true],
    ["cape-town", "Cape Town", "South Africa", "Africa", "Nature", "Mountain-backed beaches, wine valleys and coastal drives.", "Table Mountain cableway at sunset", "Nov-Mar", ["mountains", "wine", "coast"], true],
    ["zanzibar", "Zanzibar", "Tanzania", "Africa", "Beach", "Spice islands, dhow sails and pale sand shallows.", "Stone Town spice market morning", "Jun-Oct", ["spices", "beaches", "dhows"], false],
    ["serengeti", "Serengeti", "Tanzania", "Africa", "Adventure", "Open plains, migration crossings and dawn game drives.", "Great migration river crossing", "Jun-Oct", ["safari", "migration", "wildlife"], false],
    ["cairo", "Cairo", "Egypt", "Africa", "Culture", "Pyramids, museums, Nile views and dense market streets.", "Giza plateau before noon heat", "Oct-Apr", ["pyramids", "museums", "nile"], false],
    ["fez", "Fez", "Morocco", "Africa", "Culture", "Medieval alleys, tanneries and craft workshops.", "Chouara tannery from a rooftop", "Mar-May", ["craft", "medina", "tanneries"], false],
    ["sydney", "Sydney", "Australia", "Oceania", "Beach", "Harbor icons, coastal walks and sunny neighborhood cafes.", "Bondi to Coogee walk", "Sep-Nov", ["harbor", "beaches", "cafes"], false],
    ["new-zealand-south", "New Zealand South Island", "New Zealand", "Oceania", "Nature", "Fiords, alpine roads, lakes and cinematic trailheads.", "Milford Sound after rainfall", "Dec-Mar", ["fiords", "lakes", "roadtrip"], false],
    ["queenstown", "Queenstown", "New Zealand", "Oceania", "Adventure", "Lake views, alpine sports and adrenaline day trips.", "Remarkables snow line over Wakatipu", "Dec-Feb", ["adventure", "alpine", "lake"], false],
    ["melbourne", "Melbourne", "Australia", "Oceania", "Food", "Laneways, coffee, galleries and tram-lined neighborhoods.", "Flat white crawl through Fitzroy", "Mar-May", ["coffee", "laneways", "trams"], false],
    ["petra", "Petra", "Jordan", "Middle East", "Culture", "Rose-red cliffs, Nabataean facades and desert silence.", "Treasury reveal through the Siq", "Mar-May", ["desert", "ruins", "hiking"], false],
    ["dubai", "Dubai", "United Arab Emirates", "Middle East", "City", "Future skyline, desert drives and polished hospitality.", "Desert dunes after the city", "Nov-Mar", ["skyline", "desert", "shopping"], false],
    ["istanbul", "Istanbul", "Turkey", "Middle East", "Culture", "Mosques, ferries, bazaars and two-continent evenings.", "Bosphorus ferry at sunset", "Apr-Jun", ["bazaars", "ferries", "mosques"], false],
    ["oman", "Muscat", "Oman", "Middle East", "Nature", "Whitewashed forts, wadis, beaches and mountain roads.", "Wadi Shab swim after a hike", "Oct-Mar", ["wadis", "forts", "coast"], false],
  ] as const;

  return rows.map(([id, name, country, region, category, description, highlight, bestMonth, tags, hotspot]) => ({
    id,
    name,
    country,
    region,
    category,
    description,
    highlight,
    bestMonth,
    tags: [...tags],
    hotspot,
    saved: id === "tokyo" || id === "reykjavik",
  }));
}

function TravelDemo() {
  const [destinations, setDestinations] = useState<Destination[]>(travelDestinations);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [category, setCategory] = useState("All");
  const [savedOnly, setSavedOnly] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const hotspotRef = useRef<HTMLDivElement | null>(null);

  const filtered = destinations.filter((destination) => {
    const haystack = `${destination.name} ${destination.country} ${destination.description} ${destination.tags.join(" ")}`.toLowerCase();
    const matchesQuery = haystack.includes(query.toLowerCase());
    const matchesRegion = region === "All" || destination.region === region;
    const matchesCategory = category === "All" || destination.category === category;
    const matchesSaved = !savedOnly || destination.saved;
    return matchesQuery && matchesRegion && matchesCategory && matchesSaved;
  });
  const selected = selectedId ? destinations.find((destination) => destination.id === selectedId) ?? null : null;
  const saved = destinations.filter((destination) => destination.saved);
  const hotspots = destinations.filter((destination) => destination.hotspot);

  function toggleSaved(id: string) {
    setDestinations((current) =>
      current.map((destination) =>
        destination.id === id ? { ...destination, saved: !destination.saved } : destination,
      ),
    );
  }

  function openDestination(id: string) {
    setSelectedId(id);
    window.requestAnimationFrame(() => document.getElementById(`travel-${id}`)?.scrollIntoView({ block: "center", behavior: "smooth" }));
  }

  function scrollHotspots(direction: -1 | 1) {
    hotspotRef.current?.scrollBy({ left: direction * 260, behavior: "smooth" });
  }

  return (
    <div className="space-y-5">
      <section className={panelClass("p-4 sm:p-5")}> 
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PanelTitle icon={Map} title="Destination Browser" />
          <div className="product-lab-mono text-xs text-[var(--lab-muted)]">
            {filtered.length} destinations · {saved.length} saved
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <label className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--lab-muted)]" />
            <input
              className={inputClass("w-full pl-9 pr-10")}
              value={query}
              placeholder="Search destinations, countries, tags..."
              onChange={(event) => setQuery(event.target.value)}
            />
            {query ? (
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--lab-muted)]" onClick={() => setQuery("")}>
                ×
              </button>
            ) : null}
          </label>
          <button className={buttonClass(view === "grid")} onClick={() => setView("grid")}>Grid</button>
          <button className={buttonClass(view === "list")} onClick={() => setView("list")}>List</button>
        </div>
        <FilterRow label="Region" values={["All", "Asia", "Europe", "Americas", "Africa", "Oceania", "Middle East"]} active={region} onChange={(value) => setRegion(value)} />
        <FilterRow label="Category" values={["All", "City", "Nature", "Beach", "Culture", "Food", "Adventure"]} active={category} onChange={(value) => setCategory(value)} />
        {saved.length > 0 ? (
          <button className={buttonClass(savedOnly, "mt-3")} onClick={() => setSavedOnly((current) => !current)}>
            Saved only · {saved.length}
          </button>
        ) : null}
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,40%)]">
        <section className={panelClass("p-4 sm:p-5")}> 
          <div className="product-lab-mono mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-[var(--lab-gold)]">
            <span>Hotspots · おすすめ</span>
            <span className="hidden text-[9px] normal-case tracking-[0.08em] text-[var(--lab-muted)] sm:inline">
              drag or use arrows
            </span>
            <span className="h-px flex-1 bg-[var(--lab-border)]" />
            <span className="flex gap-1">
              <button
                className="grid h-7 w-7 place-items-center rounded-full border border-[var(--lab-border)] text-[var(--lab-muted)] transition hover:border-[var(--lab-gold)] hover:text-[var(--lab-gold)]"
                onClick={() => scrollHotspots(-1)}
                aria-label="Scroll hotspots left"
              >
                ←
              </button>
              <button
                className="grid h-7 w-7 place-items-center rounded-full border border-[var(--lab-border)] text-[var(--lab-muted)] transition hover:border-[var(--lab-gold)] hover:text-[var(--lab-gold)]"
                onClick={() => scrollHotspots(1)}
                aria-label="Scroll hotspots right"
              >
                →
              </button>
            </span>
          </div>
          <div className="hotspot-chips-wrapper">
            <div ref={hotspotRef} className="hotspot-chips-container no-scrollbar flex gap-2 overflow-x-auto pb-3">
              {hotspots.map((destination) => (
                <button key={destination.id} className="travel-hotspot product-lab-mono shrink-0 rounded-full border border-[var(--lab-gold)]/25 bg-[var(--lab-gold)]/8 px-3 py-2 text-xs text-[var(--lab-gold)]" onClick={() => openDestination(destination.id)}>
                  {destination.name}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-5 rounded-xl border border-[var(--lab-border)] bg-[var(--lab-surface)] p-8 text-center">
              <div className="text-lg font-semibold">No destinations found for "{query}"</div>
              <p className="mt-2 text-sm text-[var(--lab-muted)]">Try a different search or clear filters.</p>
            </div>
          ) : (
            <div className={`mt-4 grid gap-3 ${view === "grid" ? "md:grid-cols-2" : "grid-cols-1"}`}>
              {filtered.map((destination, index) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  selected={selected?.id === destination.id}
                  list={view === "list"}
                  index={index}
                  onOpen={() => openDestination(destination.id)}
                  onToggleSaved={() => toggleSaved(destination.id)}
                />
              ))}
            </div>
          )}
        </section>

        <aside className="product-lab-panel-enter sticky top-6 self-start">
          {selected ? (
            <DestinationDetail
              destination={selected}
              saved={selected.saved}
              similar={destinations.filter((item) => item.id !== selected.id && (item.region === selected.region || item.category === selected.category)).slice(0, 3)}
              onToggleSaved={() => toggleSaved(selected.id)}
              onOpen={openDestination}
            />
          ) : (
            <TripPlanner saved={saved} onOpen={openDestination} onRemove={toggleSaved} />
          )}
        </aside>
      </div>
    </div>
  );
}

function FilterRow({ label, values, active, onChange }: { label: string; values: string[]; active: string; onChange: (value: string) => void }) {
  return (
    <div className="no-scrollbar mt-3 flex items-center gap-3 overflow-x-auto pb-1">
      <span className="product-lab-mono shrink-0 text-[10px] uppercase tracking-[0.16em] text-[var(--lab-muted)]">{label}</span>
      {values.map((value) => (
        <button
          key={value}
          className={`product-lab-mono shrink-0 rounded-full border px-3 py-1.5 text-[10px] transition ${
            active === value
              ? "border-[var(--lab-gold)] bg-[var(--lab-gold)] text-[var(--lab-bg)]"
              : "border-[var(--lab-border)] text-[var(--lab-muted)] hover:border-[rgba(245,240,230,0.14)] hover:text-[var(--lab-text)]"
          }`}
          onClick={() => onChange(value)}
        >
          {value}
        </button>
      ))}
    </div>
  );
}

function DestinationCard({ destination, selected, list, index, onOpen, onToggleSaved }: { destination: Destination; selected: boolean; list: boolean; index: number; onOpen: () => void; onToggleSaved: () => void }) {
  return (
    <div
      id={`travel-${destination.id}`}
      className={`product-lab-stagger group rounded-xl border bg-[var(--lab-surface)] p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(245,240,230,0.14)] ${
        selected ? "border-[var(--lab-gold)]" : "border-[var(--lab-border)]"
      } ${destination.saved ? "border-l-[3px] border-l-[var(--lab-red)]" : ""} ${list ? "grid gap-3 md:grid-cols-[1fr_auto]" : ""}`}
      style={{ animationDelay: `${Math.min(index, 16) * 30}ms` }}
    >
      <button className="block w-full text-left" onClick={onOpen}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="product-lab-display text-2xl font-medium text-[var(--lab-text)]">{destination.name}</div>
            <div className="mt-1 text-sm text-[var(--lab-muted)]">{destination.country} · {destination.region}</div>
          </div>
          <span className="product-lab-mono rounded-full bg-[var(--lab-surface-2)] px-2.5 py-1 text-[10px] text-[var(--lab-muted)]">{destination.category}</span>
        </div>
        <p className="mt-3 text-sm leading-6 text-[var(--lab-muted)]">{destination.description}</p>
        <div className="mt-3 text-sm text-[var(--lab-gold)]">✨ {destination.highlight}</div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {destination.tags.map((tag) => <span key={tag} className="rounded-full border border-[var(--lab-border)] px-2 py-1 text-[10px] text-[var(--lab-muted)]">{tag}</span>)}
        </div>
      </button>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="product-lab-mono text-[10px] uppercase tracking-[0.12em] text-[var(--lab-muted)]">Best: {destination.bestMonth}</span>
        <span className="flex gap-2">
          <button className={`travel-heart grid h-9 w-9 place-items-center rounded-full border border-[var(--lab-border)] ${destination.saved ? "text-[var(--lab-red)]" : "text-[var(--lab-muted)]"}`} onClick={onToggleSaved} aria-label="Save destination">
            {destination.saved ? "♥" : "♡"}
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-full border border-[var(--lab-border)] text-[var(--lab-gold)]" onClick={onOpen} aria-label="Open destination">
            →
          </button>
        </span>
      </div>
    </div>
  );
}

function DestinationDetail({ destination, saved, similar, onToggleSaved, onOpen }: { destination: Destination; saved: boolean; similar: Destination[]; onToggleSaved: () => void; onOpen: (id: string) => void }) {
  return (
    <section className={panelClass("p-5")}> 
      <div className="product-lab-display text-[32px] font-medium leading-tight text-[var(--lab-text)]">{destination.name}</div>
      <div className="mt-1 text-sm text-[var(--lab-muted)]">{destination.country} / {destination.region}</div>
      <p className="mt-5 text-sm leading-7 text-[var(--lab-muted)]">{destination.description}</p>
      <div className="mt-4 text-sm text-[var(--lab-gold)]">✨ {destination.highlight}</div>
      <div className="mt-5 grid grid-cols-3 gap-3 border-y border-[var(--lab-border)] py-4">
        {[["Best time", destination.bestMonth], ["Category", destination.category], ["Region", destination.region]].map(([label, value]) => (
          <div key={label}>
            <div className="product-lab-mono text-[9px] uppercase tracking-[0.14em] text-[var(--lab-muted)]">{label}</div>
            <div className="mt-1 text-sm text-[var(--lab-text)]">{value}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {destination.tags.map((tag) => <span key={tag} className="rounded-full border border-[var(--lab-border)] px-2 py-1 text-[10px] text-[var(--lab-muted)]">{tag}</span>)}
      </div>
      <button className={buttonClass(saved, "mt-5 w-full")} onClick={onToggleSaved}>{saved ? "SAVED ✓" : "♡ SAVE DESTINATION"}</button>
      <div className="mt-6">
        <div className="product-lab-mono text-[10px] uppercase tracking-[0.16em] text-[var(--lab-gold)]">Similar destinations</div>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {similar.map((item) => (
            <button key={item.id} className="min-w-[132px] rounded-lg border border-[var(--lab-border)] bg-[var(--lab-surface)] p-3 text-left" onClick={() => onOpen(item.id)}>
              <div className="text-sm font-semibold text-[var(--lab-text)]">{item.name}</div>
              <div className="mt-1 text-xs text-[var(--lab-muted)]">{item.country}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function TripPlanner({ saved, onOpen, onRemove }: { saved: Destination[]; onOpen: (id: string) => void; onRemove: (id: string) => void }) {
  return (
    <section className={panelClass("p-5")}> 
      <div className="product-lab-display text-2xl font-medium text-[var(--lab-text)]">旅のプラン · Trip Planner</div>
      <div className="mt-2 text-sm text-[var(--lab-muted)]">{saved.length} saved destinations</div>
      {saved.length === 0 ? (
        <p className="mt-6 text-sm leading-6 text-[var(--lab-muted)]">旅のプラン is empty. Save destinations using ♡ to start planning.</p>
      ) : (
        <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
          {saved.map((destination) => (
            <div key={destination.id} className="rounded-lg border border-[var(--lab-border)] bg-[var(--lab-surface)] p-3">
              <button className="block w-full text-left" onClick={() => onOpen(destination.id)}>
                <div className="font-semibold text-[var(--lab-text)]">{destination.name}</div>
                <div className="text-xs text-[var(--lab-muted)]">{destination.country}</div>
              </button>
              <button className="mt-2 text-xs text-[var(--lab-red)]" onClick={() => onRemove(destination.id)}>× remove</button>
            </div>
          ))}
        </div>
      )}
      <p className="mt-5 text-sm leading-6 text-[var(--lab-muted)]">Save destinations using ♡ to build your trip list.</p>
    </section>
  );
}

function pulseTheme(mode: PulseMode) {
  if (mode === "Sports") {
    return {
      background: "#0F0A00",
      card: "#1A1200",
      accent: "#F97316",
      glow: "rgba(249,115,22,0.15)",
      progress: "74%",
    };
  }
  if (mode === "Rewards") {
    return {
      background: "#0D0A1A",
      card: "#16112A",
      accent: "#22C55E",
      secondary: "#A855F7",
      glow: "rgba(168,85,247,0.15)",
      progress: "82%",
    };
  }
  return {
    background: "#0A0F1E",
    card: "#111827",
    accent: "#3B82F6",
    glow: "rgba(59,130,246,0.15)",
    progress: "68%",
  };
}

function PulseTickerCard({
  ticker,
  mode,
  theme,
  compact = false,
}: {
  ticker: TickerItem;
  mode: PulseMode;
  theme: ReturnType<typeof pulseTheme>;
  compact?: boolean;
}) {
  const positive = ticker.change >= 0;
  const flash = positive ? "bg-emerald-400/5" : "bg-red-400/5";

  return (
    <div
      className={`rounded-2xl border border-white/10 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-0.5 ${flash}`}
      style={{ backgroundColor: theme.card }}
    >
      {mode === "Sports" ? (
        <SportsTickerCard ticker={ticker} theme={theme} />
      ) : mode === "Rewards" ? (
        <RewardsTickerCard ticker={ticker} theme={theme} />
      ) : (
        <FintechTickerCard ticker={ticker} theme={theme} compact={compact} />
      )}
    </div>
  );
}

function AnimatedPulseValue({ value, positive }: { value: string; positive: boolean }) {
  return (
    <span
      key={value}
      className={`product-lab-mono block text-2xl font-medium tabular-nums ${
        positive ? "product-lab-slide-up" : "product-lab-slide-down"
      }`}
    >
      {value}
    </span>
  );
}

function FintechTickerCard({
  ticker,
  theme,
  compact = false,
}: {
  ticker: TickerItem;
  theme: ReturnType<typeof pulseTheme>;
  compact?: boolean;
}) {
  const positive = ticker.change >= 0;
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="product-lab-mono text-xs text-white/45">{ticker.label}</div>
          <div className="mt-2 overflow-hidden">
            <AnimatedPulseValue value={formatPulseValue("Fintech", ticker.value)} positive={positive} />
          </div>
        </div>
        <span className={`product-lab-mono rounded-full px-2.5 py-1 text-[10px] ${positive ? "bg-emerald-400/15 text-emerald-300" : "bg-red-400/15 text-red-300"}`}>
          {positive ? "+" : ""}
          {formatPulseValue("Fintech", ticker.change)}
        </span>
      </div>
      <PulseSparkCanvas values={ticker.history} color={theme.accent} compact={compact} />
    </>
  );
}

function SportsTickerCard({ ticker, theme }: { ticker: TickerItem; theme: ReturnType<typeof pulseTheme> }) {
  const awayScore = Math.max(0, Math.round(ticker.value - 5 + ticker.change));
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-white/55">{ticker.label}</div>
          <div className="product-lab-mono mt-2 overflow-hidden text-2xl font-medium tabular-nums">
            <AnimatedPulseValue value={`${Math.round(ticker.value)} · ${awayScore}`} positive={ticker.change >= 0} />
          </div>
        </div>
        <span className="product-lab-mono rounded-full bg-red-500/18 px-2.5 py-1 text-[10px] text-red-300 product-lab-pulse">
          LIVE
        </span>
      </div>
      <div className="product-lab-mono mt-5 inline-flex rounded-full px-3 py-1 text-[10px] text-white" style={{ backgroundColor: theme.accent }}>
        {ticker.symbol}
      </div>
    </>
  );
}

function RewardsTickerCard({ ticker, theme }: { ticker: TickerItem; theme: ReturnType<typeof pulseTheme> }) {
  const progress = Math.min(96, Math.max(12, Math.round((ticker.value % 100) + 20)));
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="product-lab-mono text-xs text-white/45">{ticker.label}</div>
          <div className="mt-2 overflow-hidden">
            <AnimatedPulseValue value={formatPulseValue("Rewards", ticker.value)} positive={ticker.change >= 0} />
          </div>
        </div>
        <span className="product-lab-mono rounded-full px-2.5 py-1 text-[10px] text-white" style={{ backgroundColor: theme.secondary ?? theme.accent }}>
          Platinum
        </span>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: theme.accent }} />
      </div>
    </>
  );
}

function PulseSparkCanvas({ values, color, compact = false }: { values: number[]; color: string; compact?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const width = canvas.width;
    const height = canvas.height;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const points = values.map((value, index) => ({
      x: (index / Math.max(1, values.length - 1)) * width,
      y: height - 8 - ((value - min) / range) * (height - 16),
    }));

    context.clearRect(0, 0, width, height);
    context.beginPath();
    points.forEach((point, index) => {
      if (index === 0) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
    });

    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, `${color}26`);
    gradient.addColorStop(1, `${color}00`);
    context.lineTo(width, height);
    context.lineTo(0, height);
    context.closePath();
    context.fillStyle = gradient;
    context.fill();

    context.beginPath();
    points.forEach((point, index) => {
      if (index === 0) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
    });
    context.strokeStyle = color;
    context.lineWidth = 1.5;
    context.lineJoin = "round";
    context.lineCap = "round";
    context.stroke();
  }, [color, values]);

  return (
    <canvas
      ref={canvasRef}
      width={260}
      height={compact ? 48 : 78}
      className={compact ? "mt-4 h-10 w-full" : "mt-5 h-20 w-full"}
      aria-hidden="true"
    />
  );
}

function pulseNotificationTitle(mode: PulseMode, tickers: TickerItem[]) {
  const first = tickers[0];
  if (!first) return `${mode} stream active`;
  if (mode === "Sports") return "Lakers 89 · Celtics 84 · Q3 8:42";
  if (mode === "Rewards") return "⭐ +250 pts · Platinum tier";
  return "Fintech stream active";
}

function pulseNotificationDetail(mode: PulseMode, tickers: TickerItem[]) {
  const first = tickers[0];
  if (!first) return "";
  if (mode === "Sports") return `${first.label} · ${first.symbol}`;
  if (mode === "Rewards") return `Platinum tier: ${pulseTheme(mode).progress}`;
  return `${first.label}: ${formatPulseValue("Fintech", first.value)}`;
}

function PulsePointDemo() {
  const [mode, setMode] = useState<PulseMode>("Fintech");
  const [tickers, setTickers] = useState<TickerItem[]>(() => seedTickers("Fintech"));
  const [time, setTime] = useState("");
  const theme = pulseTheme(mode);

  useEffect(() => {
    setTickers(seedTickers(mode));
  }, [mode]);

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTickers((current) =>
        current.map((ticker) => {
          const swing =
            mode === "Sports"
              ? (Math.random() - 0.42) * 4
              : mode === "Rewards"
                ? (Math.random() - 0.2) * 24
                : (Math.random() - 0.48) * ticker.value * 0.004;
          const nextValue = Math.max(0, ticker.value + swing);
          return {
            ...ticker,
            value: nextValue,
            change: nextValue - ticker.value,
            history: [...ticker.history.slice(-19), nextValue],
          };
        }),
      );
    }, 300);
    return () => window.clearInterval(timer);
  }, [mode]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(["Fintech", "Sports", "Rewards"] as PulseMode[]).map((item) => (
          <button
            key={item}
            className={`product-lab-mono rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.12em] transition ${
              mode === item
                ? "border-transparent text-white"
                : "border-[var(--lab-border)] text-[var(--lab-muted)] hover:border-[rgba(245,240,230,0.14)] hover:text-[var(--lab-text)]"
            }`}
            style={mode === item ? { backgroundColor: pulseTheme(item).accent } : undefined}
            onClick={() => setMode(item)}
          >
            {item === "Fintech" ? "💼" : item === "Sports" ? "⚽" : "⭐"} {item}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-8 xl:grid-cols-[minmax(320px,1fr)_380px]">
        <div className="flex justify-center">
          <div className="phone-shell" style={{ boxShadow: `0 0 0 1px #111, 0 30px 80px ${theme.glow}, inset 0 0 0 1px #2A2A2A` }}>
            <span className="btn-vol-up" />
            <span className="btn-vol-down" />
            <span className="btn-power" />
            <div className="phone-screen transition-colors duration-500" style={{ backgroundColor: theme.background }}>
              <div className="flex h-6 items-center justify-between px-5 pt-1 text-white">
                <span className="product-lab-mono text-[11px]">{time}</span>
                <span className="product-lab-mono text-[10px] tracking-[0.08em]">▂▃▅  WiFi  ▰</span>
              </div>

              <div className="flex h-[calc(100%-24px)] flex-col">
                <div className="px-5 pb-3 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-lg font-medium text-white">
                      <span>⚡</span>
                      <span>PulsePoint</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-white/10 px-2 py-1">
                      <span className="h-3 w-6 rounded-full p-0.5" style={{ backgroundColor: theme.accent }}>
                        <span className="block h-2 w-2 translate-x-3 rounded-full bg-white" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-hidden px-4 pb-3">
                  {tickers.map((ticker) => (
                    <PulseTickerCard key={ticker.symbol} ticker={ticker} mode={mode} theme={theme} compact />
                  ))}
                </div>

                <div className="grid h-14 grid-cols-3 border-t border-white/10 bg-black/20 px-2 text-[10px] text-white/46">
                  {[
                    ["📊", "Dashboard"],
                    ["📈", "Trends"],
                    ["🔔", "Alerts"],
                  ].map(([icon, label], index) => (
                    <div
                      key={label}
                      className="flex flex-col items-center justify-center gap-1"
                      style={index === 0 ? { color: theme.accent } : undefined}
                    >
                      <span>{icon}</span>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className={panelClass("p-4 sm:p-5")}>
          <div className="product-lab-mono text-[10px] uppercase tracking-[0.2em] text-[var(--lab-gold)]">
            Notifications
          </div>
          <div className="mt-4 rounded-[28px] border border-white/10 bg-black/35 p-4 text-white shadow-[0_18px_50px_rgba(0,0,0,0.34)] backdrop-blur">
            <div className="rounded-3xl border border-white/10 bg-white/8 p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full" style={{ backgroundColor: theme.accent }}>
                  ⚡
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-[0.08em] text-white/70">PulsePoint</span>
                    <span className="product-lab-mono rounded-full px-2 py-1 text-[10px] text-white" style={{ backgroundColor: theme.accent }}>
                      LIVE
                    </span>
                  </div>
                  <div className="mt-3 text-base font-medium text-white">{pulseNotificationTitle(mode, tickers)}</div>
                  <div className="product-lab-mono mt-1 text-sm text-white/62">{pulseNotificationDetail(mode, tickers)}</div>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: theme.progress, backgroundColor: theme.accent }}
                      />
                    </div>
                    <span className="product-lab-mono text-xs text-white/50">Just now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function VisionDemo() {
  const capabilities = [
    ["Computer Vision", "OpenCV · mss · numpy", "Template matching", "Rune detection"],
    ["Automation", "Quartz key injection", "pynput · macOS", "Audio focus"],
    ["AI Integration", "Google Gemini Vision", "Arrow sequence solve", "Fallback chain"],
    ["Remote Control", "Telegram Bot API", "Status photos", "Command handling"],
    ["Dashboard", "Electron + Node.js", "WebSocket live feed", "IPC safe preload"],
    ["Resilience", "WebSocket reconnect", "Background threads", "Pause state mgmt"],
  ];

  return (
    <div className="space-y-5">
      <section className={panelClass("p-5 sm:p-6")}>
        <PanelTitle icon={Cpu} title="Vision Automation Lab" />
        <div className="product-lab-mono mt-3 text-xs text-[var(--lab-gold)]">
          macOS computer-vision automation — Python, OpenCV, Quartz key injection, WebSocket bridge
        </div>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-[var(--lab-muted)]">
          A macOS automation system using OpenCV screen capture and minimap tracking to navigate game environments.
          Features real-time rune detection with Google Gemini vision solving, Telegram remote control, and an Electron
          dashboard with live WebSocket minimap feed. Not a web app — a local Python system that runs alongside the client.
        </p>
      </section>

      <RuneSolverSimulation />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
        <section className={panelClass("p-5")}>
          <div className="product-lab-mono text-[10px] uppercase tracking-[0.2em] text-[var(--lab-gold)]">
            System Architecture
          </div>
          <ArchitectureDiagram />
        </section>

        <section className={panelClass("p-5")}>
          <div className="product-lab-mono text-[10px] uppercase tracking-[0.2em] text-[var(--lab-gold)]">
            Simulated Minimap
          </div>
          <VisionMinimapCanvas />
        </section>
      </div>

      <section className={panelClass("p-5")}>
        <div className="product-lab-mono text-[10px] uppercase tracking-[0.2em] text-[var(--lab-gold)]">
          Tech Stack Breakdown
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {capabilities.map(([title, first, second, third]) => (
            <div key={title} className="rounded-lg border border-[var(--lab-border)] bg-[var(--lab-surface)] p-4">
              <div className="product-lab-mono text-[9px] uppercase tracking-[0.18em] text-[var(--lab-gold)]">
                {title}
              </div>
              {[first, second, third].map((line) => (
                <div key={line} className="mt-2 text-[11px] leading-5 text-[var(--lab-muted)]">
                  {line}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[var(--lab-border)] pt-4">
          <a
            href="https://github.com/felixny"
            className="product-lab-mono text-xs text-[var(--lab-gold)] transition hover:text-[var(--lab-text)]"
          >
            GitHub →
          </a>
          <span className="product-lab-mono text-[10px] text-[var(--lab-muted)]">
            Python · OpenCV · Electron · Gemini API · Telegram · Quartz
          </span>
        </div>
      </section>
    </div>
  );
}

function RuneSolverSimulation() {
  const sequences = [
    ["UP", "RIGHT", "DOWN", "LEFT"],
    ["LEFT", "UP", "RIGHT", "DOWN"],
    ["DOWN", "LEFT", "UP", "RIGHT"],
    ["RIGHT", "DOWN", "LEFT", "UP"],
  ];
  const [now, setNow] = useState(0);
  const cycleMs = 8000;
  const elapsed = now % cycleMs;
  const cycleIndex = Math.floor(now / cycleMs);
  const sequence = sequences[cycleIndex % sequences.length];
  const solveTimes = [1200, 2100, 3000, 3900];
  const solvedCount = solveTimes.filter((time) => elapsed >= time).length;
  const complete = elapsed >= 4200 && elapsed < 6500;
  const fading = elapsed >= 6200 && elapsed < 6500;
  const status = elapsed < 1200 ? "SCANNING" : elapsed < 4200 ? "SOLVING" : complete ? "COMPLETE" : "IDLE";
  const timer = complete ? Math.min(elapsed, 4233) : Math.min(elapsed, 4233);
  const baseLines = ["CAPTCHA SCAN", "mode = CV CLASSIFY", "theta(static) = 180.0deg", "denoising...", "conf = 100.5%"];
  const baseText = baseLines.join("\n");
  const typedChars = elapsed < 200 ? 0 : Math.min(baseText.length, Math.floor((elapsed - 200) / 24));
  const typedLines = baseText.slice(0, typedChars).split("\n");
  const terminalLines =
    elapsed < 160
      ? ["> cls"]
      : [
          ...typedLines,
          ...sequence
            .slice(0, solvedCount)
            .map((direction, index) => `arrow_${index + 1}: ${direction} - conf ${(98.2 + index * 0.4).toFixed(1)}%`),
          ...(complete ? [`sequence_solved: true - t=${timer}ms`] : []),
        ];

  useEffect(() => {
    const startedAt = Date.now();
    const timerId = window.setInterval(() => setNow(Date.now() - startedAt), 50);
    return () => window.clearInterval(timerId);
  }, []);

  return (
    <section className={panelClass(`overflow-hidden p-5 transition-opacity duration-300 ${fading ? "opacity-40" : "opacity-100"}`)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="product-lab-mono text-[10px] uppercase tracking-[0.22em] text-[var(--lab-gold)]">
            // 001 Core
          </div>
          <h2 className="product-lab-display mt-2 text-3xl font-medium">Rune Solver 2.0</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--lab-muted)]">
            Live CV classify replay: scan, solve, snap, verify, repeat.
          </p>
        </div>
        <div className="product-lab-mono flex items-center gap-2 text-[10px] uppercase tracking-[0.16em]">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              status === "COMPLETE"
                ? "bg-[#00FF88]"
                : status === "SCANNING"
                  ? "bg-amber-400 product-lab-status-pulse"
                  : status === "SOLVING"
                    ? "bg-[#00FF88] product-lab-status-pulse-fast"
                    : "bg-white/20"
            }`}
          />
          <span className={status === "SCANNING" ? "text-amber-300" : status === "IDLE" ? "text-white/35" : "text-[#00FF88]"}>
            {status}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="rounded-xl border border-[#00FF88]/15 bg-[#030705] p-4 product-lab-scanlines">
          <div className="product-lab-mono min-h-[178px] whitespace-pre-wrap text-xs leading-6 text-[#00FF88]">
            {terminalLines.map((line, index) => (
              <div key={`${line}-${index}`}>
                {line}
                {index === terminalLines.length - 1 && status !== "COMPLETE" ? (
                  <span className="product-lab-cursor">█</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--lab-border)] bg-[var(--lab-surface)] p-4">
          <div className="product-lab-mono flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-[var(--lab-muted)]">
            <span>Sequence</span>
            <span>T = {timer}ms</span>
          </div>
          <div className="mt-4 space-y-2">
            {sequence.map((direction, index) => {
              const solved = index < solvedCount;
              return (
                <div
                  key={`${direction}-${index}`}
                  className={`product-lab-mono flex items-center justify-between rounded-lg border px-3 py-2 text-xs transition ${
                    solved
                      ? "border-[#00FF88]/30 bg-[#00FF88]/8 text-[#00FF88]"
                      : "border-[var(--lab-border)] text-[var(--lab-muted)]"
                  }`}
                >
                  <span>{directionSymbol(direction)} {direction}</span>
                  <span>{solved ? "✓" : "--"}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        {sequence.map((direction, index) => {
          const solved = index < solvedCount;
          const snapping = elapsed >= solveTimes[index] && elapsed < solveTimes[index] + 260;
          const spinReverse = index % 2 === 1;
          return (
            <div key={`${cycleIndex}-${index}`} className="rounded-xl border border-[var(--lab-border)] bg-[var(--lab-surface)] p-4 text-center">
              <div
                className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl text-5xl text-[#00FF88] ${
                  solved ? "product-lab-arrow-solved" : "product-lab-arrow-spinning opacity-60"
                } ${snapping ? "product-lab-arrow-snap" : ""} ${complete ? "product-lab-arrow-complete" : ""}`}
                style={{
                  transform: solved ? `rotate(${directionAngle(direction)}deg)` : undefined,
                  animationDuration: solved ? undefined : `${[0.6, 0.8, 0.5, 0.7][index]}s`,
                  animationDirection: spinReverse ? "reverse" : "normal",
                  animationDelay: `${index * -110}ms`,
                }}
              >
                ↑
              </div>
              <div className="mt-3 h-5">
                {solved ? (
                  <span className="product-lab-mono inline-flex rounded-full bg-[#00FF88]/12 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-[#00FF88] product-lab-solved-badge">
                    Solved
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="product-lab-mono mt-4 rounded-lg border border-[var(--lab-border)] bg-[var(--lab-bg)] px-3 py-2 text-xs text-[var(--lab-muted)]">
        {complete ? `SEQUENCE COMPLETE - ${timer}MS` : status === "IDLE" ? "IDLE" : "SCANNING..."}
        {!complete ? <span className="product-lab-cursor">█</span> : null}
      </div>
    </section>
  );
}

function directionAngle(direction: string) {
  if (direction === "RIGHT") return 90;
  if (direction === "DOWN") return 180;
  if (direction === "LEFT") return 270;
  return 0;
}

function directionSymbol(direction: string) {
  if (direction === "RIGHT") return "→";
  if (direction === "DOWN") return "↓";
  if (direction === "LEFT") return "←";
  return "↑";
}

function ArchitectureDiagram() {
  const leftFlow = [
    "Screen Capture (mss)",
    "OpenCV Frame Processing",
    "Minimap Position Tracking",
    "Platform Nav (config/platforms)",
    "Quartz Key Injection",
    "WebSocket Bridge → Electron UI",
    "Telegram Bot (optional remote control)",
  ];
  const rightFlow = ["Rune Detection (template match)", "Gemini Vision API", "Arrow Sequence Solve"];

  return (
    <div className="mt-5 rounded-xl border border-[var(--lab-border)] bg-[var(--lab-bg)] p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(180px,0.75fr)]">
        <div className="space-y-2">
          {leftFlow.map((item, index) => (
            <div key={item}>
              <ArchitectureNode>{item}</ArchitectureNode>
              {index < leftFlow.length - 1 ? <ArchitectureArrow /> : null}
            </div>
          ))}
        </div>
        <div className="space-y-2 lg:pt-[5.35rem]">
          {rightFlow.map((item, index) => (
            <div key={item}>
              <ArchitectureNode>{item}</ArchitectureNode>
              {index < rightFlow.length - 1 ? <ArchitectureArrow /> : null}
            </div>
          ))}
          <div className="product-lab-mono mt-4 rounded-lg border border-[var(--lab-gold)]/20 bg-[var(--lab-gold)]/5 px-3 py-2 text-[10px] leading-5 text-[var(--lab-muted)]">
            Rune solve path feeds back into Quartz key injection.
          </div>
        </div>
      </div>
    </div>
  );
}

function ArchitectureNode({ children }: { children: string }) {
  return (
    <div className="product-lab-mono rounded-lg border border-[var(--lab-gold)]/35 bg-[var(--lab-surface)] px-3 py-3 text-[10px] uppercase tracking-[0.08em] text-[var(--lab-text)]">
      {children}
    </div>
  );
}

function ArchitectureArrow() {
  return <div className="product-lab-mono py-1 text-center text-sm text-[var(--lab-gold)]/55">↓</div>;
}

function VisionMinimapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let direction = 1;
    let playerX = 72;
    let rune: { x: number; y: number; born: number } | null = null;
    let animationFrame = 0;

    function drawDiamond(x: number, y: number, size: number, color: string) {
      if (!context) return;
      context.save();
      context.translate(x, y);
      context.rotate(Math.PI / 4);
      context.fillStyle = color;
      context.fillRect(-size / 2, -size / 2, size, size);
      context.restore();
    }

    function draw() {
      if (!context || !canvas) return;
      const width = canvas.width;
      const height = canvas.height;
      frame += 1;

      if (frame % 80 !== 0) {
        playerX += direction * 0.9;
      }
      if (playerX > width - 58 || playerX < 58) direction *= -1;
      if (!rune && frame % 520 === 0) {
        rune = {
          x: 70 + Math.random() * (width - 140),
          y: 50 + Math.random() * (height - 120),
          born: frame,
        };
      }
      if (rune && frame - rune.born > 140) rune = null;

      context.clearRect(0, 0, width, height);
      context.fillStyle = "#09090D";
      context.fillRect(0, 0, width, height);

      context.strokeStyle = "rgba(232,228,220,0.08)";
      context.lineWidth = 1;
      for (let x = 24; x < width; x += 34) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
      for (let y = 24; y < height; y += 34) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      context.strokeStyle = "rgba(232,228,220,0.26)";
      context.lineWidth = 4;
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(44, height * 0.58);
      context.lineTo(width - 44, height * 0.58);
      context.stroke();

      drawDiamond(playerX, height * 0.58 - 12 + Math.sin(frame / 28) * 2, 14, "#C9A84C");
      if (rune) drawDiamond(rune.x, rune.y, 12, "#C0392B");

      context.fillStyle = "rgba(232,228,220,0.42)";
      context.font = "10px 'DM Mono', monospace";
      context.fillText("SIMULATED — not connected to local process", 18, height - 18);

      animationFrame = window.requestAnimationFrame(draw);
    }

    draw();
    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="mt-5 rounded-xl border border-[var(--lab-border)] bg-[var(--lab-bg)] p-3">
      <canvas ref={canvasRef} width={350} height={250} className="aspect-[7/5] w-full rounded-lg" aria-label="Simulated minimap tracking preview" />
    </div>
  );
}

function EmeraldDemo() {
  const [loaded, setLoaded] = useState(false);
  const [slot, setSlot] = useState(1);
  const [entry, setEntry] = useState({
    name: "メタグロス",
    species: "#376 Metagross",
    level: 100,
    nature: "Careful",
    iv: 31,
    ev: 252,
  });
  const [dirty, setDirty] = useState(false);
  const [binaryOpen, setBinaryOpen] = useState(true);
  const [flowOpen, setFlowOpen] = useState(true);
  const [presetLog, setPresetLog] = useState(false);
  const [exported, setExported] = useState(false);

  const stats = useMemo(() => {
    const base = entry.level + Math.round(entry.iv * 0.8) + Math.round(entry.ev / 16);
    return {
      hp: base + 44,
      attack: base + 18,
      defense: base + 15,
      speed: base + 21,
      special: base + 17,
    };
  }, [entry]);
  const checksum = entry.name === "メタグロス" ? "0x00A4" : entry.level >= 100 ? "0x0063" : "0x0042";
  const flowSteps = [
    ["セーブを開く", "Open demo save", loaded],
    ["ポケモンを編集", "Edit party Pokémon", dirty],
    ["変更内容を確認", "Review changes", dirty || presetLog],
    ["ボックスにプリセット", "Create preset in box", presetLog],
    ["バッグを編集", "Edit bag item", presetLog],
    ["検証OK確認", "Confirm validation", !dirty && loaded],
    ["書き出す", "Export save", exported],
  ];

  function patchEntry(patch: Partial<typeof entry>) {
    setEntry((current) => ({ ...current, ...patch }));
    setDirty(true);
    setExported(false);
  }

  function createPreset() {
    setEntry({ name: "メタグロス", species: "#376 Metagross", level: 100, nature: "Careful", iv: 31, ev: 252 });
    setDirty(false);
    setPresetLog(true);
    setExported(false);
    window.setTimeout(() => setPresetLog(false), 4200);
  }

  if (!loaded) {
    return (
      <section className={panelClass("p-6 sm:p-8")}>
        <div className="product-lab-mono text-[10px] uppercase tracking-[0.22em] text-[var(--lab-gold)]">
          Emerald Studio
        </div>
        <h2 className="product-lab-display mt-3 text-4xl font-medium">ポケモン エメラルド セーブエディタ</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--lab-muted)]">
          Gen 3 binary save editor for Pokémon Emerald (Japanese). Parses encrypted Pokémon substructures,
          recalculates checksums, and exports clean valid .sav files.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button className={buttonClass(true, "px-5")} onClick={() => setLoaded(true)}>
            demo_clean.sav を開く
          </button>
          <button className={buttonClass(false, "px-5")} onClick={() => setLoaded(true)}>
            ファイルを選択...
          </button>
        </div>
        <div className="product-lab-mono mt-6 text-xs leading-5 text-[var(--lab-muted)]">
          元のセーブファイルは上書きされません
          <br />
          Original save is never overwritten
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5">
        <section className={panelClass("p-4 sm:p-5")}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <PanelTitle icon={Database} title="Party Slot Editor" />
            <div className="product-lab-mono text-right text-[10px] leading-5 text-[var(--lab-muted)]">
              元のセーブファイルは上書きされません
              <br />
              Original save is never overwritten
            </div>
          </div>

          <div className="mt-5 flex gap-1">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <button key={item} className={buttonClass(slot === item, "h-10 w-10 px-0")} onClick={() => setSlot(item)}>
                {item}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label>
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#E8E4DC]/40">ポケモン名</span>
              <input className={inputClass("mt-2 w-full")} value={entry.name} onChange={(event) => patchEntry({ name: event.target.value })} />
            </label>
            <label>
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#E8E4DC]/40">種族</span>
              <input className={inputClass("mt-2 w-full")} value={entry.species} onChange={(event) => patchEntry({ species: event.target.value })} />
            </label>
            <label>
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#E8E4DC]/40">レベル</span>
              <input className={inputClass("mt-2 w-full")} type="number" min="1" max="100" value={entry.level} onChange={(event) => patchEntry({ level: Number(event.target.value) })} />
            </label>
            <label>
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#E8E4DC]/40">性格</span>
              <select className={inputClass("mt-2 w-full")} value={entry.nature} onChange={(event) => patchEntry({ nature: event.target.value })}>
                {["Careful", "Bold", "Calm", "Jolly"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#E8E4DC]/40">IV spread</span>
              <input className="mt-3 w-full accent-[#C9A84C]" type="range" min="0" max="31" value={entry.iv} onChange={(event) => patchEntry({ iv: Number(event.target.value) })} />
            </label>
            <label>
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#E8E4DC]/40">EV spread</span>
              <input className="mt-3 w-full accent-[#C9A84C]" type="range" min="0" max="252" value={entry.ev} onChange={(event) => patchEntry({ ev: Number(event.target.value) })} />
            </label>
          </div>

          <button
            className="product-lab-mono mt-5 flex w-full items-center justify-between rounded-lg border border-[var(--lab-border)] bg-[var(--lab-surface)] px-3 py-3 text-left text-xs text-[var(--lab-gold)]"
            onClick={() => setBinaryOpen((current) => !current)}
          >
            <span>バイナリ解析 · BINARY PARSE</span>
            <span>{binaryOpen ? "▴" : "▾"}</span>
          </button>
          {binaryOpen ? <BinaryInspector checksum={checksum} entry={entry} /> : null}
        </section>

        {presetLog ? (
          <section className={panelClass("border-[#2EA043]/30 p-4 sm:p-5")}>
            <div className="product-lab-display text-2xl font-medium text-[var(--lab-text)]">メタグロス を作成しました</div>
            <div className="product-lab-mono mt-4 grid gap-2 text-xs leading-5 text-[var(--lab-muted)]">
              <div>種族: #376 メタグロス</div>
              <div>チェックサム: 0x00A4 ✓</div>
              <div>能力: クリアボディ / Clear Body</div>
              <div>タイプ: はがね / エスパー</div>
              <div>技: コメットパンチ / アイアンデフェンス / サイコキネシス / じしん</div>
              <div>IVs: 31 / 31 / 31 / 31 / 31 / 31 (6V)</div>
              <div>EVs: 252 / 0 / 0 / 252 / 0 / 4 (508 / 510)</div>
            </div>
          </section>
        ) : null}
      </div>

      <div className="space-y-5">
        <section className={panelClass("p-4 sm:p-5")}>
          <button
            className="product-lab-mono flex w-full items-center justify-between text-left text-[10px] uppercase tracking-[0.2em] text-[var(--lab-gold)]"
            onClick={() => setFlowOpen((current) => !current)}
          >
            <span>デモ手順 · Demo Flow</span>
            <span>{flowOpen ? "▴" : "▾"}</span>
          </button>
          {flowOpen ? (
            <div className="mt-4 space-y-3">
              {flowSteps.map(([jp, en, done]) => (
                <div key={String(jp)} className="flex items-center gap-3 text-sm">
                  <span className={`grid h-5 w-5 place-items-center rounded border ${done ? "border-[#2EA043] bg-[#2EA043]/15 text-[#2EA043]" : "border-[var(--lab-border)] text-[var(--lab-muted)]"}`}>
                    {done ? "✓" : ""}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[var(--lab-text)]">{jp}</span>
                    <span className="product-lab-mono block text-[10px] text-[var(--lab-muted)]">{en}</span>
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <section className={panelClass("p-4 sm:p-5")}>
          <PanelTitle icon={Check} title="Checksum / Stats" />
          <div className="mt-4 rounded-lg border border-[var(--lab-border)] bg-[var(--lab-surface)] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xl font-black">Slot {slot}: {entry.name}</div>
                <div className="text-sm font-semibold text-[#E8E4DC]/40">Level {entry.level} / {entry.nature}</div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-black ${dirty ? "bg-[#C9A84C]/15 text-[#C0392B]" : "bg-[#2EA043]/15 text-[#2EA043]"}`}>
                {dirty ? "変更内容" : `検証OK · チェックサム ${checksum}`}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {Object.entries(stats).map(([key, value]) => (
                <div key={key} className="rounded-md bg-[#1A1A24] p-2 font-bold">
                  {key.toUpperCase()} {value}
                </div>
              ))}
            </div>
            <div className="product-lab-mono mt-4 rounded-lg border border-[#2EA043]/25 bg-[#2EA043]/8 p-3 text-xs leading-6 text-[var(--lab-muted)]">
              <div className="text-[#2EA043]">CHECKSUM VERIFICATION</div>
              <div>Computed: {checksum}</div>
              <div>Stored: {checksum}</div>
              <div>Result: 一致 · MATCH ✓</div>
              <div>Save sections: 14/14 valid</div>
              <div>Party stats: recalculated ✓</div>
              <div>Substructure: decrypted ✓</div>
            </div>
            <div className="mt-4 grid gap-2">
              <button className={buttonClass(false)} onClick={createPreset}>
                <RotateCcw className="h-4 w-4" />
                メタグロス / Metagross preset
              </button>
              <button className={buttonClass(true)} onClick={() => setDirty(false)}>
                <Check className="h-4 w-4" />
                Recalculate checksum
              </button>
              <button className={buttonClass(false)} onClick={() => setExported(true)}>
                編集済みセーブを書き出す → EXPORT
              </button>
            </div>
            {exported ? (
              <div className="product-lab-mono mt-4 rounded-lg border border-[#2EA043]/25 bg-[#2EA043]/8 p-3 text-xs text-[#2EA043]">
                保存しました · SAVED
                <br />
                demo_edited_20260601_1200.sav
              </div>
            ) : null}
          </div>
        </section>

        <section className={panelClass("p-4 sm:p-5")}>
          <div className="product-lab-mono text-[10px] uppercase tracking-[0.2em] text-[var(--lab-gold)]">
            このアプリについて · About
          </div>
          <p className="mt-3 text-xs leading-6 text-[var(--lab-muted)]">
            Emerald Studio parses the binary structure of Japanese Pokémon Emerald save files. Each ポケモン is stored
            as an 80-byte encrypted substructure across 4 shuffled sections, decoded using the personality value as the
            XOR key.
          </p>
          <p className="mt-3 text-xs leading-6 text-[var(--lab-muted)]">
            Built as a technical exercise in binary format parsing, Japanese locale support, and safe file export. The
            original save file is never modified.
          </p>
        </section>
      </div>
    </div>
  );
}

function BinaryInspector({ checksum, entry }: { checksum: string; entry: { species: string; level: number } }) {
  const rows = [
    ["0x00", "A3 2F 00 00 B4 1E 00 00", "........"],
    ["0x08", "00 00 00 00 5A 00 00 00", "....Z..."],
    ["0x10", "FF FF FF FF 63 00 00 00", "....c..."],
    ["0x18", "1F 00 1F 00 1F 00 1F 00", "........"],
    ["0x20", "FF 00 FF 00 FF 00 FF 00", "........"],
    ["0x28", "00 00 00 00 00 00 00 00", "........"],
  ];

  return (
    <div className="mt-3 grid gap-4 rounded-xl border border-[#22C55E]/15 bg-[#030705] p-4 product-lab-scanlines lg:grid-cols-[minmax(0,1.1fr)_minmax(220px,0.9fr)]">
      <div className="no-scrollbar product-lab-mono overflow-x-auto text-[10px] leading-6">
        <div className="grid min-w-[360px] grid-cols-[64px_1fr_72px] text-[var(--lab-muted)]">
          <span>OFFSET</span>
          <span>HEX</span>
          <span>ASCII</span>
        </div>
        {rows.map(([offset, hex, ascii]) => (
          <div key={offset} className="grid min-w-[360px] grid-cols-[64px_1fr_72px]">
            <span className="text-[var(--lab-muted)]">{offset}</span>
            <span className="text-[#22C55E]">{hex}</span>
            <span className="text-[var(--lab-muted)]">{ascii}</span>
          </div>
        ))}
      </div>
      <div className="product-lab-mono space-y-3 text-[11px] leading-5">
        {[
          ["PERSONALITY", "0x0000 → nature, gender, ability"],
          ["OT_ID", "0x0004 → trainer ID"],
          ["CHECKSUM", `0x001C → ${checksum} ✓ valid`],
          ["SPECIES", `0x0030 → ${entry.species}`],
          ["LEVEL", `0x0054 → ${entry.level}`],
        ].map(([label, value]) => (
          <div key={label}>
            <div className="text-[var(--lab-gold)]">{label}</div>
            <div className="text-[var(--lab-muted)]">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PanelTitle({ icon: Icon, title }: { icon: typeof Activity; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-md border border-[var(--lab-border)] bg-[var(--lab-surface)] text-[var(--lab-gold)]">
        <Icon className="h-4 w-4" />
      </span>
      <h2 className="product-lab-display text-xl font-medium tracking-normal">{title}</h2>
    </div>
  );
}

function seedTickers(mode: PulseMode): TickerItem[] {
  if (mode === "Sports") {
    return [
      { symbol: "Q3 8:42", label: "Lakers vs Celtics", value: 89, change: 0, history: [83, 84, 87, 89] },
      { symbol: "Q2 3:18", label: "Chiefs vs Eagles", value: 24, change: 0, history: [14, 17, 21, 24] },
      { symbol: "2H 61:00", label: "Real Madrid vs Barcelona", value: 2, change: 0, history: [0, 1, 1, 2] },
    ];
  }
  if (mode === "Rewards") {
    return [
      { symbol: "STREAK", label: "Daily Streak", value: 14, change: 0, history: [10, 11, 12, 14] },
      { symbol: "POINTS", label: "Points Balance", value: 2840, change: 0, history: [2450, 2510, 2670, 2840] },
      { symbol: "TIER", label: "Tier Progress", value: 82, change: 0, history: [62, 65, 70, 82] },
    ];
  }
  return [
    { symbol: "BTC", label: "BTC/USD", value: 66376, change: 0, history: [65980, 66120, 66040, 66376] },
    { symbol: "ETH", label: "ETH/USD", value: 3805, change: 0, history: [3720, 3765, 3748, 3805] },
    { symbol: "SOL", label: "SOL/USD", value: 154.89, change: 0, history: [151, 152.2, 153.4, 154.89] },
  ];
}

function formatPulseValue(mode: PulseMode, value: number): string {
  if (mode === "Fintech") return value < 0 ? `-$${Math.abs(value).toFixed(2)}` : `$${value.toFixed(value > 1000 ? 0 : 2)}`;
  if (mode === "Sports") return `${Math.round(value)}`;
  return value > 100 ? `${Math.round(value).toLocaleString()} pts` : `${value.toFixed(1)}x`;
}

function Sparkline({ values, positive, animated = false }: { values: number[]; positive: boolean; animated?: boolean }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const plotted = values.map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * 100;
      const y = 36 - ((value - min) / range) * 30;
      return { x, y };
    });
  const points = plotted.map((point) => `${point.x},${point.y}`).join(" ");
  const path = plotted.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const stroke = positive ? "var(--lab-green)" : "var(--lab-gold)";

  return (
    <svg className="mt-5 h-12 w-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {animated ? (
        <circle r="2.2" fill={stroke}>
          <animateMotion dur="2.4s" repeatCount="indefinite" path={path} />
        </circle>
      ) : null}
    </svg>
  );
}
