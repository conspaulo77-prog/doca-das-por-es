import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Copy, LogOut, Pencil, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTable, uploadPhoto, type MenuItem, type Promo, type Show } from "@/lib/data";
import { addDays, brl, fmtDay, mondayOf, spNow } from "@/lib/bar";
import { CATEGORIES } from "@/components/site/Cardapio";
import { Logo } from "@/components/site/common";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Painel Admin | Doca das Porções" },
      { name: "description", content: "Painel administrativo do Doca das Porções." },
      { property: "og:title", content: "Painel Admin | Doca das Porções" },
      { property: "og:description", content: "Gerencie shows, cardápio e promoções." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const input = "w-full rounded-lg border border-input bg-secondary px-3 py-2 text-foreground outline-none focus:border-gold";
const btn = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-bold transition disabled:opacity-50";

function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  if (!ready) return null;
  if (!session) return <Login />;
  if (isAdmin === null) return <p className="p-10 text-center">Carregando...</p>;
  if (!isAdmin) return (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div><p className="mb-4">Esta conta não tem acesso de administrador.</p>
        <button className={`${btn} bg-secondary`} onClick={() => supabase.auth.signOut()}>Sair</button></div>
    </div>
  );
  return <Panel email={session.user.email ?? ""} />;
}

function Login() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg("");
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
      if (error) setMsg("E-mail ou senha incorretos (ou e-mail ainda não confirmado).");
    } else {
      const { error } = await supabase.auth.signUp({ email, password: pw, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      setMsg(error ? error.message : "Conta criada! Confirme pelo link enviado ao seu e-mail e depois entre.");
    }
    setBusy(false);
  };
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6 shadow-deep">
        <div className="text-center"><Logo size="lg" /><p className="mt-2 text-sm text-muted-foreground">Painel administrativo</p></div>
        <input className={input} type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={input} type="password" required minLength={6} placeholder="Senha" value={pw} onChange={(e) => setPw(e.target.value)} />
        {msg && <p className="text-sm text-gold">{msg}</p>}
        <button disabled={busy} className={`${btn} w-full bg-gold-gradient text-gold-foreground`}>{mode === "in" ? "Entrar" : "Criar conta"}</button>
        <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="w-full text-xs text-muted-foreground underline">
          {mode === "in" ? "Primeiro acesso? Criar conta (a primeira conta vira administradora)" : "Já tenho conta"}
        </button>
        <Link to="/" className="block text-center text-xs text-muted-foreground">← Voltar ao site</Link>
      </form>
    </div>
  );
}

function Panel({ email }: { email: string }) {
  const [tab, setTab] = useState<"shows" | "menu" | "promos">("shows");
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-muted-foreground sm:inline">{email}</span>
          <Link to="/" className="text-gold">Ver site</Link>
          <button aria-label="Sair" onClick={() => supabase.auth.signOut()}><LogOut className="h-5 w-5" /></button>
        </div>
      </header>
      <div className="mb-6 flex gap-2">
        {([["shows", "Shows"], ["menu", "Cardápio"], ["promos", "Promoções"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`${btn} ${tab === k ? "bg-gold-gradient text-gold-foreground" : "bg-secondary"}`}>{l}</button>
        ))}
      </div>
      {tab === "shows" ? <ShowsAdmin /> : tab === "menu" ? <MenuAdmin /> : <PromosAdmin />}
    </div>
  );
}

function PhotoField({ value, onChange }: { value: string | null; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex items-center gap-3">
      {value && <img src={value} alt="" className="h-14 w-14 rounded-lg object-cover" />}
      <label className={`${btn} cursor-pointer bg-secondary text-sm`}>
        {busy ? "Enviando..." : value ? "Trocar foto" : "Enviar foto"}
        <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
          const f = e.target.files?.[0]; if (!f) return;
          setBusy(true);
          try { onChange(await uploadPhoto(f)); } catch (err) { alert("Erro ao enviar foto: " + (err as Error).message); }
          setBusy(false);
        }} />
      </label>
    </div>
  );
}

type ShowForm = Omit<Show, "id" | "created_at"> & { id?: string };

function ShowsAdmin() {
  const { rows, reload } = useTable<Show>("shows", "show_date");
  const [week, setWeek] = useState(() => mondayOf(spNow().date));
  const [edit, setEdit] = useState<ShowForm | null>(null);
  const end = addDays(week, 6);
  const list = rows.filter((s) => s.show_date >= week && s.show_date <= end).sort((a, b) => (a.show_date + a.start_time).localeCompare(b.show_date + b.start_time));

  const save = async () => {
    if (!edit || !edit.artist.trim() || !edit.show_date) return alert("Preencha data e artista.");
    const { id, ...data } = edit;
    const { error } = id ? await supabase.from("shows").update(data).eq("id", id) : await supabase.from("shows").insert(data);
    if (error) return alert(error.message);
    setEdit(null); reload();
  };
  const duplicate = async () => {
    const prevStart = addDays(week, -7);
    const prev = rows.filter((s) => s.show_date >= prevStart && s.show_date < week);
    if (!prev.length) return alert("A semana anterior não tem shows.");
    if (!confirm(`Copiar ${prev.length} show(s) da semana anterior para esta semana?`)) return;
    const { error } = await supabase.from("shows").insert(prev.map((s) => ({ show_date: addDays(s.show_date, 7), artist: s.artist, photo_url: s.photo_url, start_time: s.start_time, style: s.style, active: s.active })));
    if (error) alert(error.message); else reload();
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button className={`${btn} bg-secondary px-2`} onClick={() => setWeek(addDays(week, -7))}><ChevronLeft /></button>
          <span className="font-bold">{fmtDay(week).short} – {fmtDay(end).short}</span>
          <button className={`${btn} bg-secondary px-2`} onClick={() => setWeek(addDays(week, 7))}><ChevronRight /></button>
        </div>
        <div className="flex gap-2">
          <button className={`${btn} bg-secondary`} onClick={duplicate}><Copy className="h-4 w-4" />Duplicar semana anterior</button>
          <button className={`${btn} bg-primary text-primary-foreground`} onClick={() => setEdit({ show_date: week, artist: "", photo_url: null, start_time: "20:30", style: "", active: true })}><Plus className="h-4 w-4" />Novo show</button>
        </div>
      </div>

      {edit && (
        <div className="mb-6 grid gap-3 rounded-2xl border border-gold/50 bg-card p-5 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">Data<input type="date" className={input} value={edit.show_date} onChange={(e) => setEdit({ ...edit, show_date: e.target.value })} /></label>
          <label className="grid gap-1 text-sm">Horário<input type="time" className={input} value={edit.start_time} onChange={(e) => setEdit({ ...edit, start_time: e.target.value })} /></label>
          <label className="grid gap-1 text-sm">Artista<input className={input} maxLength={100} value={edit.artist} onChange={(e) => setEdit({ ...edit, artist: e.target.value })} /></label>
          <label className="grid gap-1 text-sm">Estilo<input className={input} maxLength={60} value={edit.style} onChange={(e) => setEdit({ ...edit, style: e.target.value })} placeholder="Sertanejo, MPB..." /></label>
          <PhotoField value={edit.photo_url} onChange={(u) => setEdit({ ...edit, photo_url: u })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.active} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} />Ativo no site</label>
          <div className="flex gap-2 sm:col-span-2">
            <button className={`${btn} bg-gold-gradient text-gold-foreground`} onClick={save}>Salvar</button>
            <button className={`${btn} bg-secondary`} onClick={() => setEdit(null)}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {list.length === 0 && <p className="text-muted-foreground">Nenhum show nesta semana.</p>}
        {list.map((s) => (
          <div key={s.id} className={`flex items-center gap-3 rounded-xl border border-border bg-card p-3 ${s.active ? "" : "opacity-50"}`}>
            {s.photo_url ? <img src={s.photo_url} alt="" className="h-14 w-14 rounded-lg object-cover" /> : <div className="h-14 w-14 rounded-lg bg-secondary" />}
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{s.artist}</p>
              <p className="text-xs text-muted-foreground">{fmtDay(s.show_date).weekday} {fmtDay(s.show_date).short} · {s.start_time} · {s.style}</p>
            </div>
            <button title={s.active ? "Desativar" : "Ativar"} onClick={async () => { await supabase.from("shows").update({ active: !s.active }).eq("id", s.id); reload(); }} className={`rounded-full px-3 py-1 text-xs font-bold ${s.active ? "bg-success/20 text-success" : "bg-secondary"}`}>{s.active ? "Ativo" : "Inativo"}</button>
            <button aria-label="Editar" onClick={() => setEdit(s)}><Pencil className="h-4 w-4" /></button>
            <button aria-label="Excluir" onClick={async () => { if (confirm("Excluir este show?")) { await supabase.from("shows").delete().eq("id", s.id); reload(); } }}><Trash2 className="h-4 w-4 text-destructive" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

type MenuForm = Omit<MenuItem, "id" | "created_at"> & { id?: string };
function MenuAdmin() {
  const { rows, reload } = useTable<MenuItem>("menu_items", "sort");
  const [edit, setEdit] = useState<MenuForm | null>(null);
  const save = async () => {
    if (!edit || !edit.name.trim()) return alert("Informe o nome.");
    const { id, ...data } = edit;
    const { error } = id ? await supabase.from("menu_items").update(data).eq("id", id) : await supabase.from("menu_items").insert(data);
    if (error) return alert(error.message);
    setEdit(null); reload();
  };
  return (
    <div>
      <button className={`${btn} mb-4 bg-primary text-primary-foreground`} onClick={() => setEdit({ category: CATEGORIES[0], name: "", description: "", price: 0, photo_url: null, active: true, sort: rows.length + 1 })}><Plus className="h-4 w-4" />Novo item</button>
      {edit && (
        <div className="mb-6 grid gap-3 rounded-2xl border border-gold/50 bg-card p-5 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">Categoria<select className={input} value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label className="grid gap-1 text-sm">Nome<input className={input} maxLength={100} value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></label>
          <label className="grid gap-1 text-sm sm:col-span-2">Descrição<input className={input} maxLength={200} value={edit.description ?? ""} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></label>
          <label className="grid gap-1 text-sm">Preço (R$)<input type="number" step="0.01" min={0} className={input} value={edit.price} onChange={(e) => setEdit({ ...edit, price: Number(e.target.value) })} /></label>
          <label className="grid gap-1 text-sm">Ordem<input type="number" className={input} value={edit.sort} onChange={(e) => setEdit({ ...edit, sort: Number(e.target.value) })} /></label>
          <PhotoField value={edit.photo_url} onChange={(u) => setEdit({ ...edit, photo_url: u })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.active} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} />Ativo no site</label>
          <div className="flex gap-2 sm:col-span-2">
            <button className={`${btn} bg-gold-gradient text-gold-foreground`} onClick={save}>Salvar</button>
            <button className={`${btn} bg-secondary`} onClick={() => setEdit(null)}>Cancelar</button>
          </div>
        </div>
      )}
      {CATEGORIES.map((c) => (
        <div key={c} className="mb-6">
          <h3 className="mb-2 text-xl text-gold">{c}</h3>
          <div className="space-y-2">
            {rows.filter((r) => r.category === c).map((r) => (
              <div key={r.id} className={`flex items-center gap-3 rounded-xl border border-border bg-card p-3 ${r.active ? "" : "opacity-50"}`}>
                <div className="min-w-0 flex-1"><p className="truncate font-bold">{r.name}</p><p className="text-xs text-muted-foreground">{brl(Number(r.price))}</p></div>
                <button onClick={async () => { await supabase.from("menu_items").update({ active: !r.active }).eq("id", r.id); reload(); }} className={`rounded-full px-3 py-1 text-xs font-bold ${r.active ? "bg-success/20 text-success" : "bg-secondary"}`}>{r.active ? "Ativo" : "Inativo"}</button>
                <button aria-label="Editar" onClick={() => setEdit({ ...r, price: Number(r.price) })}><Pencil className="h-4 w-4" /></button>
                <button aria-label="Excluir" onClick={async () => { if (confirm("Excluir item?")) { await supabase.from("menu_items").delete().eq("id", r.id); reload(); } }}><Trash2 className="h-4 w-4 text-destructive" /></button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

type PromoForm = Omit<Promo, "id" | "created_at"> & { id?: string };
function PromosAdmin() {
  const { rows, reload } = useTable<Promo>("promotions", "sort");
  const [edit, setEdit] = useState<PromoForm | null>(null);
  const save = async () => {
    if (!edit || !edit.title.trim()) return alert("Informe o título.");
    const { id, ...data } = edit;
    const { error } = id ? await supabase.from("promotions").update(data).eq("id", id) : await supabase.from("promotions").insert(data);
    if (error) return alert(error.message);
    setEdit(null); reload();
  };
  return (
    <div>
      <button className={`${btn} mb-4 bg-primary text-primary-foreground`} onClick={() => setEdit({ title: "", description: "", badge: "", active: true, sort: rows.length + 1 })}><Plus className="h-4 w-4" />Nova promoção</button>
      {edit && (
        <div className="mb-6 grid gap-3 rounded-2xl border border-gold/50 bg-card p-5">
          <label className="grid gap-1 text-sm">Título<input className={input} maxLength={100} value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></label>
          <label className="grid gap-1 text-sm">Descrição<textarea className={input} maxLength={400} value={edit.description ?? ""} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></label>
          <label className="grid gap-1 text-sm">Selo (opcional)<input className={input} maxLength={30} value={edit.badge ?? ""} onChange={(e) => setEdit({ ...edit, badge: e.target.value })} /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.active} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} />Ativa no site</label>
          <div className="flex gap-2">
            <button className={`${btn} bg-gold-gradient text-gold-foreground`} onClick={save}>Salvar</button>
            <button className={`${btn} bg-secondary`} onClick={() => setEdit(null)}>Cancelar</button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {rows.map((p) => (
          <div key={p.id} className={`flex items-center gap-3 rounded-xl border border-border bg-card p-3 ${p.active ? "" : "opacity-50"}`}>
            <div className="min-w-0 flex-1"><p className="truncate font-bold">{p.title}</p><p className="truncate text-xs text-muted-foreground">{p.description}</p></div>
            <button onClick={async () => { await supabase.from("promotions").update({ active: !p.active }).eq("id", p.id); reload(); }} className={`rounded-full px-3 py-1 text-xs font-bold ${p.active ? "bg-success/20 text-success" : "bg-secondary"}`}>{p.active ? "Ativa" : "Inativa"}</button>
            <button aria-label="Editar" onClick={() => setEdit(p)}><Pencil className="h-4 w-4" /></button>
            <button aria-label="Excluir" onClick={async () => { if (confirm("Excluir promoção?")) { await supabase.from("promotions").delete().eq("id", p.id); reload(); } }}><Trash2 className="h-4 w-4 text-destructive" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
