import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Instagram, MapPin, Navigation, Star } from "lucide-react";
import { BAR, waUrl } from "@/lib/bar";
import { Counter, Section } from "./common";
import hero from "@/assets/hero.jpg";
import porcoes from "@/assets/porcoes.jpg";
import drinks from "@/assets/drinks.jpg";
import show from "@/assets/show.jpg";
import kids from "@/assets/kids.jpg";
import bolo from "@/assets/bolo.jpg";

export function Kids() {
  return (
    <Section id="kids" eyebrow="Pais tranquilos, crianças felizes" title={<>Espaço <span className="text-gold-gradient">Kids</span></>}>
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="reveal relative">
          <img src={kids} alt="Espaço kids do Doca das Porções" loading="lazy" width={1200} height={912} className="rounded-3xl shadow-deep" />
          <div className="absolute -bottom-5 -right-3 rounded-2xl bg-gold-gradient px-5 py-3 font-display text-gold-foreground shadow-glow md:-right-6">Diversão garantida!</div>
        </div>
        <div className="reveal space-y-4">
          <p className="text-lg text-foreground/90">Enquanto você curte o show e a porção, a criançada se diverte num espaço pensado pra elas: escorregador, brinquedos e muita energia gasta.</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>🧸 Espaço seguro e coberto</li>
            <li>🍟 Porções kids no cardápio</li>
            <li>🎂 Perfeito para aniversários em família</li>
          </ul>
        </div>
      </div>
    </Section>
  );
}

const GALLERY = [hero, show, porcoes, drinks, bolo, kids];

export function Sobre() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % GALLERY.length), 4000); return () => clearInterval(t); }, []);
  return (
    <Section id="sobre" eyebrow="A casa de quem gosta de prosa" title={<>Sobre o <span className="text-gold-gradient">Doca</span></>}>
      <div className="reveal mx-auto mb-12 max-w-2xl text-center text-lg text-foreground/90">
        Madeira, luz baixinha, cerveja trincando e música ao vivo todo santo dia. O Doca é aquele bar em Uberaba onde a porção chega generosa e a conversa nunca acaba.
      </div>
      <div className="reveal mb-14 grid grid-cols-3 gap-4 text-center">
        {[[7, " dias", "de música por semana"], [30, "+", "porções e petiscos"], [10000, "+", "seguidores no Insta"]].map(([n, s, l]) => (
          <div key={l as string} className="rounded-2xl border border-border bg-card p-4">
            <div className="font-display text-2xl text-gold md:text-4xl"><Counter to={n as number} suffix={s as string} /></div>
            <div className="mt-1 text-xs text-muted-foreground md:text-sm">{l}</div>
          </div>
        ))}
      </div>
      <div className="reveal relative overflow-hidden rounded-3xl shadow-deep">
        <div className="flex transition-transform duration-700" style={{ transform: `translateX(-${i * 100}%)` }}>
          {GALLERY.map((g, k) => <img key={k} src={g} alt="Ambiente do Doca das Porções" loading="lazy" className="aspect-[16/9] w-full shrink-0 object-cover" />)}
        </div>
        <button aria-label="Anterior" onClick={() => setI((i - 1 + GALLERY.length) % GALLERY.length)} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-2 backdrop-blur"><ChevronLeft /></button>
        <button aria-label="Próxima" onClick={() => setI((i + 1) % GALLERY.length)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-2 backdrop-blur"><ChevronRight /></button>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-6">
        {GALLERY.map((g, k) => (
          <button key={k} onClick={() => setI(k)} className={`overflow-hidden rounded-lg border-2 transition ${k === i ? "border-gold" : "border-transparent opacity-60"}`}>
            <img src={g} alt="" loading="lazy" className="aspect-square w-full object-cover transition hover:scale-110" />
          </button>
        ))}
      </div>
      <div className="mt-8 text-center">
        <a href={BAR.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 font-bold text-gold-foreground shadow-glow transition hover:scale-105">
          <Instagram className="h-5 w-5" /> Seguir @docadasporcoes
        </a>
      </div>
    </Section>
  );
}

const QUIZ = [
  { q: "Como tá seu humor hoje?", a: [["Quero comemorar!", "festa"], ["De boa, só relaxar", "calmo"], ["Fome de leão", "fome"]] },
  { q: "Qual a companhia?", a: [["A galera toda", "festa"], ["Meu mozão", "calmo"], ["Eu e minha fome", "fome"]] },
  { q: "E pra beber?", a: [["Balde de cerveja", "festa"], ["Um drink caprichado", "calmo"], ["Chopp trincando", "fome"]] },
] as const;
const RESULT: Record<string, { name: string; text: string }> = {
  festa: { name: "Fritas com cheddar e bacon", text: "Pra dividir com a galera (ou fingir que vai dividir)." },
  calmo: { name: "Isca de tilápia", text: "Leve, crocante e combina com papo bom." },
  fome: { name: "Contra-filé acebolado", text: "Respeitamos sua fome. Ela é grande." },
};

export function Quiz() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState<string[]>([]);
  const done = step >= QUIZ.length;
  const winner = done ? Object.entries(score.reduce<Record<string, number>>((m, k) => ({ ...m, [k]: (m[k] || 0) + 1 }), {})).sort((a, b) => b[1] - a[1])[0][0] : "";
  return (
    <Section id="quiz" eyebrow="Teste rápido e saboroso" title={<>Qual porção <span className="text-gold-gradient">combina com você?</span></>}>
      <div className="reveal mx-auto max-w-xl rounded-3xl border border-gold/40 bg-card p-6 shadow-glow md:p-8">
        {!done ? (
          <div key={step} className="animate-rise">
            <p className="mb-1 text-xs font-bold text-muted-foreground">Pergunta {step + 1} de {QUIZ.length}</p>
            <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full bg-gold-gradient transition-all" style={{ width: `${(step / QUIZ.length) * 100}%` }} /></div>
            <h3 className="mb-5 text-2xl">{QUIZ[step].q}</h3>
            <div className="grid gap-3">
              {QUIZ[step].a.map(([label, key]) => (
                <button key={label} onClick={() => { setScore([...score, key]); setStep(step + 1); }} className="rounded-xl border border-border bg-secondary px-4 py-3 text-left font-semibold transition hover:border-gold hover:bg-primary active:scale-95">{label}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-rise text-center">
            <p className="text-sm text-muted-foreground">Sua porção ideal é...</p>
            <h3 className="my-3 text-3xl text-gold neon">{RESULT[winner].name}</h3>
            <p className="mb-6 text-foreground/90">{RESULT[winner].text}</p>
            <a href={waUrl(`Fiz o quiz no site e deu ${RESULT[winner].name}! Quero pedir 😋`)} target="_blank" rel="noreferrer" className="inline-block rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground">Pedir no WhatsApp</a>
            <button onClick={() => { setStep(0); setScore([]); }} className="mt-3 block w-full text-sm text-muted-foreground underline">Refazer quiz</button>
          </div>
        )}
      </div>
    </Section>
  );
}

const REVIEWS = [
  ["Mariana S.", "Porção enorme, chopp gelado e show bom demais. Virou nosso point de sexta!"],
  ["Carlos H.", "Comemorei meu aniversário lá e ganhei o bolo. Atendimento nota 10."],
  ["Juliana P.", "Levo meus filhos no espaço kids e consigo curtir o show em paz. Amo!"],
];
export function Depoimentos() {
  return (
    <Section id="depoimentos" eyebrow="Quem foi, voltou" title={<>O povo <span className="text-gold-gradient">aprova</span></>}>
      <div className="grid gap-6 md:grid-cols-3">
        {REVIEWS.map(([n, t], i) => (
          <figure key={n} className="reveal rounded-2xl border border-border bg-card p-6 shadow-deep transition hover:-translate-y-1 hover:border-gold/50" style={{ transitionDelay: `${i * 100}ms` }}>
            <div className="mb-3 flex gap-1 text-gold">{Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}</div>
            <blockquote className="text-foreground/90">“{t}”</blockquote>
            <figcaption className="mt-4 text-sm font-bold text-gold">{n}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

export function ComoChegar() {
  return (
    <Section id="local" eyebrow="Bora?" title={<>Como <span className="text-gold-gradient">chegar</span></>}>
      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="reveal space-y-4 rounded-2xl border border-border bg-card p-6">
          <p className="flex gap-2"><MapPin className="h-5 w-5 shrink-0 text-gold" />{BAR.address}</p>
          <div className="text-sm text-muted-foreground">
            <p><b className="text-foreground">Seg a Sáb:</b> 17h30 – 00h30</p>
            <p><b className="text-foreground">Domingo:</b> 16h30 – 23h30</p>
          </div>
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${BAR.lat},${BAR.lng}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-gold-gradient px-4 py-3 font-bold text-gold-foreground shadow-glow"><Navigation className="h-5 w-5" />Abrir no GPS</a>
        </div>
        <iframe title="Mapa do Doca das Porções" loading="lazy" className="reveal h-80 w-full rounded-2xl border border-border md:h-full" src={`https://www.google.com/maps?q=${BAR.lat},${BAR.lng}&z=16&output=embed`} />
      </div>
    </Section>
  );
}

export function Reservas() {
  const [f, setF] = useState({ nome: "", data: "", hora: "20:00", pessoas: "4" });
  const [err, setErr] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const nome = f.nome.trim().slice(0, 80);
    const p = Number(f.pessoas);
    if (!nome || !f.data || !f.hora || !(p >= 1 && p <= 200)) { setErr("Preenche tudo direitinho, por favor 🙏"); return; }
    const [y, m, d] = f.data.split("-");
    window.open(waUrl(`Olá! Quero reservar uma mesa.\nNome: ${nome}\nData: ${d}/${m}/${y}\nHorário: ${f.hora}\nPessoas: ${p}`), "_blank");
  };
  const input = "w-full rounded-xl border border-input bg-secondary px-4 py-3 text-foreground outline-none focus:border-gold";
  return (
    <Section id="reservas" eyebrow="Garanta seu lugar" title={<>Reserve sua <span className="text-gold-gradient">mesa</span></>} className="bg-wine-gradient">
      <form onSubmit={submit} className="reveal mx-auto grid max-w-xl gap-4 rounded-3xl border border-gold/40 bg-card/90 p-6 shadow-deep backdrop-blur md:p-8">
        <label className="grid gap-1 text-sm font-semibold">Nome<input className={input} maxLength={80} value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} placeholder="Seu nome" /></label>
        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1 text-sm font-semibold">Data<input type="date" className={input} value={f.data} onChange={(e) => setF({ ...f, data: e.target.value })} /></label>
          <label className="grid gap-1 text-sm font-semibold">Horário<input type="time" className={input} value={f.hora} onChange={(e) => setF({ ...f, hora: e.target.value })} /></label>
        </div>
        <label className="grid gap-1 text-sm font-semibold">Pessoas<input type="number" min={1} max={200} className={input} value={f.pessoas} onChange={(e) => setF({ ...f, pessoas: e.target.value })} /></label>
        {err && <p className="text-sm text-destructive">{err}</p>}
        <button className="rounded-xl bg-gold-gradient px-4 py-4 font-extrabold text-gold-foreground shadow-glow transition hover:scale-[1.02]">Enviar pelo WhatsApp</button>
        <p className="text-center text-xs text-muted-foreground">20+ pessoas no aniversário? Tem bolo de 1,5 kg por nossa conta 🎂</p>
      </form>
    </Section>
  );
}
