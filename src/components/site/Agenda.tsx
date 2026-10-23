import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock, Music2 } from "lucide-react";
import { useTable, type Show } from "@/lib/data";
import { addDays, fmtDay, showInstant, spNow, waUrl } from "@/lib/bar";
import { Section } from "./common";
import showImg from "@/assets/show.jpg";

function Countdown({ target, label }: { target: Date; label: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, []);
  const diff = Math.max(0, target.getTime() - now);
  const parts = [
    [Math.floor(diff / 86400000), "dias"],
    [Math.floor((diff / 3600000) % 24), "horas"],
    [Math.floor((diff / 60000) % 60), "min"],
    [Math.floor((diff / 1000) % 60), "seg"],
  ] as const;
  return (
    <div className="reveal mx-auto mb-10 max-w-xl rounded-2xl border border-gold/40 bg-card/80 p-5 text-center shadow-glow backdrop-blur">
      <p className="text-sm text-muted-foreground">{diff === 0 ? "Tá rolando agora:" : "Próximo show em"} <b className="text-foreground">{label}</b></p>
      <div className="mt-3 flex justify-center gap-3">
        {parts.map(([n, l]) => (
          <div key={l} className="min-w-16 rounded-xl bg-secondary px-3 py-2">
            <div className="font-display text-2xl text-gold tabular-nums">{String(n).padStart(2, "0")}</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Agenda() {
  const { rows, loading } = useTable<Show>("shows", "show_date");
  const today = spNow().date;
  const week = useMemo(() => {
    const end = addDays(today, 6);
    return rows
      .filter((s) => s.active && s.show_date >= today && s.show_date <= end)
      .sort((a, b) => (a.show_date + a.start_time).localeCompare(b.show_date + b.start_time));
  }, [rows, today]);
  const next = week.find((s) => showInstant(s.show_date, s.start_time).getTime() + 3 * 3600000 > Date.now());

  return (
    <Section id="agenda" eyebrow="Música ao vivo todo dia" title={<>Agenda da <span className="text-gold-gradient">Semana</span></>}>
      {next && <Countdown target={showInstant(next.show_date, next.start_time)} label={next.artist} />}
      {loading ? (
        <p className="text-center text-muted-foreground">Afinando os violões...</p>
      ) : week.length === 0 ? (
        <p className="text-center text-muted-foreground">Agenda sendo montada. Chama no WhatsApp que a gente conta!</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {week.map((s, i) => {
            const isToday = s.show_date === today;
            const d = fmtDay(s.show_date);
            const msg = `Olá! Quero reservar uma mesa para o show de ${s.artist} (${d.weekday}, ${d.short}, às ${s.start_time}). Somos __ pessoas.`;
            return (
              <article
                key={s.id}
                style={{ transitionDelay: `${i * 70}ms` }}
                className={`reveal group relative overflow-hidden rounded-2xl border bg-card shadow-deep transition-transform duration-500 hover:-translate-y-2 active:scale-[0.98] ${isToday ? "today-glow border-gold" : "border-border"}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={s.photo_url || showImg} alt={`Show de ${s.artist}`} loading="lazy" width={800} height={600} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-fade" />
                  {isToday && <span className="absolute left-3 top-3 rounded-full bg-gold-gradient px-3 py-1 text-xs font-extrabold tracking-widest text-gold-foreground shadow-glow">HOJE</span>}
                  <div className="absolute bottom-3 left-3 rounded-xl bg-background/80 px-3 py-1.5 backdrop-blur">
                    <div className="text-xs font-bold uppercase tracking-widest text-gold">{d.weekday}</div>
                    <div className="font-display text-lg leading-none">{d.short}</div>
                  </div>
                </div>
                <div className="space-y-3 p-5">
                  <h3 className="text-2xl leading-tight">{s.artist}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4 text-gold" />{s.start_time}</span>
                    <span className="inline-flex items-center gap-1"><Music2 className="h-4 w-4 text-gold" />{s.style}</span>
                    <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4 text-gold" />{d.short}</span>
                  </div>
                  <a href={waUrl(msg)} target="_blank" rel="noreferrer" className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground transition hover:brightness-125">
                    Reservar mesa
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </Section>
  );
}
