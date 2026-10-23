import { useState } from "react";
import { useTable, type MenuItem, type Promo } from "@/lib/data";
import { brl, waUrl } from "@/lib/bar";
import { Section } from "./common";
import porcoes from "@/assets/porcoes.jpg";
import drinks from "@/assets/drinks.jpg";
import bolo from "@/assets/bolo.jpg";

export const CATEGORIES = ["Porções", "Petiscos", "Cervejas", "Drinks", "Sobremesas"];
const fallback: Record<string, string> = { Drinks: drinks, Cervejas: porcoes, Sobremesas: bolo };

export function Cardapio() {
  const { rows } = useTable<MenuItem>("menu_items", "sort");
  const [cat, setCat] = useState(CATEGORIES[0]);
  const items = rows.filter((r) => r.active && r.category === cat);
  return (
    <Section id="cardapio" eyebrow="Pra beliscar sem culpa" title={<>Cardá<span className="text-gold-gradient">pio</span></>}>
      <div className="reveal -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2 md:justify-center">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`shrink-0 rounded-full border px-5 py-2 text-sm font-bold transition ${cat === c ? "border-gold bg-gold-gradient text-gold-foreground shadow-glow" : "border-border text-muted-foreground hover:text-foreground"}`}>
            {c}
          </button>
        ))}
      </div>
      <div key={cat} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <article key={it.id} className="animate-rise group overflow-hidden rounded-2xl border border-border bg-card shadow-deep transition hover:-translate-y-1 hover:border-gold/60" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="aspect-[16/10] overflow-hidden">
              <img src={it.photo_url || fallback[it.category] || porcoes} alt={it.name} loading="lazy" width={600} height={375} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="flex items-start justify-between gap-3 p-5">
              <div>
                <h3 className="font-sans text-lg font-extrabold">{it.name}</h3>
                {it.description && <p className="mt-1 text-sm text-muted-foreground">{it.description}</p>}
                <p className="mt-2 font-display text-xl text-gold">{brl(Number(it.price))}</p>
              </div>
              <a href={waUrl(`Olá! Quero pedir: ${it.name} (${brl(Number(it.price))}).`)} target="_blank" rel="noreferrer" className="shrink-0 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:brightness-125">Pedir</a>
            </div>
          </article>
        ))}
        {items.length === 0 && <p className="col-span-full text-center text-muted-foreground">Em breve novidades nessa categoria.</p>}
      </div>
    </Section>
  );
}

export function Promocoes() {
  const { rows } = useTable<Promo>("promotions", "sort");
  const promos = rows.filter((p) => p.active);
  return (
    <Section id="promocoes" eyebrow="Desconto é amor" title={<>Promo<span className="text-gold-gradient">ções</span></>} className="bg-wine-gradient">
      <div className="grid gap-6 md:grid-cols-3">
        {promos.map((p, i) => <FlipCard key={p.id} p={p} img={i === 0 ? bolo : i === 1 ? porcoes : drinks} />)}
      </div>
    </Section>
  );
}

function FlipCard({ p, img }: { p: Promo; img: string }) {
  const [flip, setFlip] = useState(false);
  return (
    <button onClick={() => setFlip((f) => !f)} className="reveal group h-80 text-left [perspective:1200px]" aria-label={`Promoção ${p.title}`}>
      <div className={`relative h-full w-full rounded-2xl shadow-deep transition-transform duration-700 [transform-style:preserve-3d] md:group-hover:[transform:rotateY(180deg)] ${flip ? "[transform:rotateY(180deg)]" : ""}`}>
        <div className="absolute inset-0 overflow-hidden rounded-2xl border border-gold/40 [backface-visibility:hidden]">
          <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-fade" />
          <div className="absolute bottom-0 p-5">
            {p.badge && <span className="mb-2 inline-block rounded-full bg-gold-gradient px-3 py-1 text-xs font-extrabold text-gold-foreground">{p.badge}</span>}
            <h3 className="text-2xl">{p.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">Toque para ver ↻</p>
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-gold bg-card p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div>
            <h3 className="text-2xl text-gold">{p.title}</h3>
            <p className="mt-3 text-foreground/90">{p.description}</p>
          </div>
          <a onClick={(e) => e.stopPropagation()} href={waUrl(`Olá! Quero saber mais da promoção "${p.title}".`)} target="_blank" rel="noreferrer" className="rounded-xl bg-primary px-4 py-3 text-center font-bold text-primary-foreground">Quero essa!</a>
        </div>
      </div>
    </button>
  );
}
