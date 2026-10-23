import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Instagram, Menu, MessageCircle, X } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { BAR, waUrl } from "@/lib/bar";
import { Bulbs, Logo, OpenBadge, useReveal } from "@/components/site/common";
import { Agenda } from "@/components/site/Agenda";
import { Cardapio, Promocoes } from "@/components/site/Cardapio";
import { ComoChegar, Depoimentos, Kids, Quiz, Reservas, Sobre } from "@/components/site/Extras";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Doca das Porções | Bar, porções e música ao vivo em Uberaba/MG" },
      { name: "description", content: "Bar e porções em Uberaba/MG com música ao vivo todos os dias, chopp gelado, drinks e espaço kids. Av. Nenê Sabino, 1285. Reserve pelo WhatsApp." },
      { property: "og:title", content: "Doca das Porções – Bar e porções em Uberaba/MG" },
      { property: "og:description", content: "Música ao vivo todo dia, porções generosas e espaço kids. Reserve sua mesa pelo WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org", "@type": "BarOrPub", name: "Doca das Porções",
        address: { "@type": "PostalAddress", streetAddress: "Av. Nenê Sabino, 1285", addressLocality: "Uberaba", addressRegion: "MG", addressCountry: "BR" },
        geo: { "@type": "GeoCoordinates", latitude: BAR.lat, longitude: BAR.lng },
        telephone: "+55 34 98428-0182", servesCuisine: "Porções, petiscos",
        openingHours: ["Mo-Sa 17:30-00:30", "Su 16:30-23:30"], sameAs: [BAR.instagram],
      }),
    }],
  }),
  component: Index,
});

const NAV = [["agenda", "Agenda"], ["cardapio", "Cardápio"], ["promocoes", "Promoções"], ["kids", "Kids"], ["sobre", "Sobre"], ["local", "Local"], ["reservas", "Reservas"]];

function Index() {
  useReveal();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [y, setY] = useState(0);
  useEffect(() => {
    const on = () => { setScrolled(window.scrollY > 40); setY(window.scrollY); };
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div className="overflow-x-hidden">
      <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "border-b border-border bg-background/85 backdrop-blur-md" : ""}`}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <a href="#top"><Logo /></a>
          <nav className="hidden gap-6 text-sm font-semibold lg:flex">
            {NAV.map(([id, l]) => <a key={id} href={`#${id}`} className="text-foreground/80 transition hover:text-gold">{l}</a>)}
          </nav>
          <div className="flex items-center gap-3">
            <OpenBadge className="hidden sm:inline-flex" />
            <button className="lg:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
          </div>
        </div>
        {open && (
          <nav className="animate-rise grid gap-1 border-b border-border bg-background/95 px-4 pb-4 backdrop-blur lg:hidden">
            {NAV.map(([id, l]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-semibold hover:bg-secondary">{l}</a>)}
          </nav>
        )}
      </header>

      <section id="top" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 pt-16">
        <img src={hero} alt="Ambiente do Doca das Porções com luzes e música ao vivo" width={1600} height={1008} className="absolute inset-0 h-[120%] w-full object-cover" style={{ transform: `translateY(${y * 0.35}px)` }} />
        <div className="absolute inset-0 bg-background/55" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-fade" />
        <Bulbs />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <OpenBadge className="animate-rise mb-6 bg-background/60 backdrop-blur sm:hidden" />
          <p className="animate-rise mb-4 text-xs font-bold uppercase tracking-[0.4em] text-gold">Bar · Porções · Música ao vivo · Uberaba/MG</p>
          <h1 className="animate-rise text-5xl leading-[1.05] md:text-7xl" style={{ animationDelay: ".15s" }}>
            <span className="neon text-gold-gradient">Doca</span><br />das Porções
          </h1>
          <p className="animate-rise mx-auto mt-6 max-w-lg text-lg text-foreground/90" style={{ animationDelay: ".3s" }}>
            Porção que chega generosa, chopp que chega trincando e show todo santo dia. A dieta pode esperar.
          </p>
          <div className="animate-rise mt-8 flex flex-col justify-center gap-3 sm:flex-row" style={{ animationDelay: ".45s" }}>
            <a href="#agenda" className="rounded-xl bg-gold-gradient px-7 py-4 font-extrabold text-gold-foreground shadow-glow transition hover:scale-105">Ver Agenda</a>
            <a href={waUrl("Olá! Quero reservar uma mesa no Doca 🍻")} target="_blank" rel="noreferrer" className="rounded-xl border border-gold/60 bg-primary px-7 py-4 font-extrabold text-primary-foreground transition hover:scale-105">Reservar no WhatsApp</a>
          </div>
        </div>
      </section>

      <Agenda />
      <Cardapio />
      <Promocoes />
      <Quiz />
      <Kids />
      <Sobre />
      <Depoimentos />
      <ComoChegar />
      <Reservas />

      <footer className="border-t border-border px-4 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
          <Logo size="lg" />
          <p className="text-sm text-muted-foreground">{BAR.address} · {BAR.phone}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={BAR.ifood} target="_blank" rel="noreferrer" className="rounded-xl bg-destructive px-5 py-3 font-bold text-destructive-foreground">Pedir no iFood</a>
            <a href={BAR.food99} target="_blank" rel="noreferrer" className="rounded-xl bg-gold-gradient px-5 py-3 font-bold text-gold-foreground">Pedir no 99Food</a>
          </div>
          <div className="flex gap-4">
            <a href={BAR.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full border border-border p-3 hover:border-gold hover:text-gold"><Instagram /></a>
            <a href={BAR.waLink} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="rounded-full border border-border p-3 hover:border-gold hover:text-gold"><MessageCircle /></a>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Doca das Porções · Beba com moderação · <Link to="/admin" className="hover:text-gold">Admin</Link></p>
        </div>
      </footer>

      <a href={BAR.waLink} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp" className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-success text-background shadow-deep transition hover:scale-110">
        <span className="absolute inset-0 animate-ping rounded-full bg-success/40" />
        <MessageCircle className="relative h-7 w-7" />
      </a>
    </div>
  );
}
