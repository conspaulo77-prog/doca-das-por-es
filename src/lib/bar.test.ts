import { describe, it, expect } from "vitest";
import { isOpenAt } from "./bar";

const t = (h: number, m: number) => h * 60 + m;

describe("horário de funcionamento", () => {
  it("seg a sáb abre às 17h30", () => {
    expect(isOpenAt(1, t(17, 29))).toBe(false);
    expect(isOpenAt(6, t(17, 30))).toBe(true);
  });
  it("seg a sáb vai até 00h30 do dia seguinte", () => {
    expect(isOpenAt(0, t(0, 29))).toBe(true); // sábado à noite → domingo 00h29
    expect(isOpenAt(2, t(0, 31))).toBe(false);
  });
  it("domingo 16h30 às 23h30", () => {
    expect(isOpenAt(0, t(16, 30))).toBe(true);
    expect(isOpenAt(0, t(23, 30))).toBe(false);
    expect(isOpenAt(1, t(0, 15))).toBe(false); // segunda madrugada fechado
  });
});
