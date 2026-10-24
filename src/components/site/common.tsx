import { useEffect, useRef, useState, type ReactNode } from "react";
import { BAR, isOpenAt, spNow } from "@/lib/bar";

export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

export function Section({ id, eyebrow, title, children, className = "" }: { id: string; eyebrow: string; title: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`scroll-mt-20 px-4 py-20 md:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <div className="reveal mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
          <h2 className="text-3xl text-foreground md:text-5xl">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

export function OpenBadge({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const tick = () => { const n = spNow(); setOpen(isOpenAt(n.weekday, n.minutes)); };
    tick();
    const i = setInterval(tick, 30000);
    return () => clearInterval(i);
  }, []);
  if (open === null) return null;
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${open ? "border-success/50 text-success" : "border-destructive/50 text-destructive"} ${className}`}>
      <span className={`h-2 w-2 rounded-full ${open ? "bg-success animate-pulse" : "bg-destructive"}`} />
      {open ? "Aberto agora" : "Fechado agora"}
    </span>
  );
}

export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - start) / 1600);
        setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{v.toLocaleString("pt-BR")}{suffix}</span>;
}

export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <span className="inline-flex flex-col leading-none">
      <span className={`font-display text-gold-gradient ${size === "lg" ? "text-3xl" : "text-xl"}`}>Doca</span>
      <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-foreground/80">das Porções</span>
    </span>
  );
}

export function Bulbs({ count = 18 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex h-16 justify-between px-2" aria-hidden>
      <svg className="absolute inset-x-0 top-0 h-10 w-full" preserveAspectRatio="none" viewBox="0 0 100 10">
        <path d="M0 1 Q 25 9 50 3 T 100 2" fill="none" stroke="currentColor" className="text-border" strokeWidth=".3" />
      </svg>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="bulb mt-3" style={{ animationDelay: `${(i * 0.37) % 3}s`, marginTop: `${8 + Math.sin(i / 2) * 10 + 12}px` }} />
      ))}
    </div>
  );
}

export const InstaHandle = () => (
  <a href={BAR.instagram} target="_blank" rel="noreferrer" className="text-gold underline-offset-4 hover:underline">@docadasporcoes</a>
);
