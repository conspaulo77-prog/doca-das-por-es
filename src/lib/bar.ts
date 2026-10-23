export const BAR = {
  name: "Doca das Porções",
  address: "Av. Nenê Sabino, 1285 – Uberaba/MG",
  phone: "(34) 98428-0182",
  phoneDigits: "5534984280182",
  waLink: "https://wa.me/message/4C3DZSPIKSAWC1",
  instagram: "https://www.instagram.com/docadasporcoes/",
  lat: -19.7540533,
  lng: -47.9643394,
  ifood: "https://www.ifood.com.br/busca?q=doca%20das%20por%C3%A7%C3%B5es",
  food99: "https://food.99app.com/",
};

export const waUrl = (text: string) =>
  `https://wa.me/${BAR.phoneDigits}?text=${encodeURIComponent(text)}`;

/** Current date/time parts in São Paulo timezone. */
export function spNow(d = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", weekday: "short", hour12: false,
  }).formatToParts(d);
  const g = (t: string) => parts.find((p) => p.type === t)!.value;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hour = Number(g("hour")) % 24;
  return {
    date: `${g("year")}-${g("month")}-${g("day")}`,
    weekday: days.indexOf(g("weekday")),
    minutes: hour * 60 + Number(g("minute")),
  };
}

/** Mon–Sat 17:30–00:30, Sun 16:30–23:30. weekday: 0=Sun. */
export function isOpenAt(weekday: number, minutes: number) {
  const monSat = weekday >= 1 && weekday <= 6;
  if (monSat && minutes >= 17 * 60 + 30) return true;
  if (weekday === 0 && minutes >= 16 * 60 + 30 && minutes < 23 * 60 + 30) return true;
  // after midnight, still in previous day's (Mon–Sat) session
  const prev = (weekday + 6) % 7;
  if (prev >= 1 && prev <= 6 && minutes < 30) return true;
  return false;
}

export function addDays(iso: string, n: number) {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function mondayOf(iso: string) {
  const wd = new Date(iso + "T12:00:00Z").getUTCDay();
  return addDays(iso, -((wd + 6) % 7));
}

export const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export function fmtDay(iso: string) {
  const d = new Date(iso + "T12:00:00Z");
  return {
    weekday: WEEKDAYS[d.getUTCDay()],
    short: `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`,
  };
}

/** Show start as a real instant (São Paulo is UTC-3). */
export const showInstant = (date: string, time: string) =>
  new Date(`${date}T${time.length === 5 ? time : "20:00"}:00-03:00`);

export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
