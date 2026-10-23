import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Show = Tables<"shows">;
export type MenuItem = Tables<"menu_items">;
export type Promo = Tables<"promotions">;

type TableName = "shows" | "menu_items" | "promotions";

export function useTable<T>(table: TableName, order: string, ascending = true) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    const { data } = await supabase.from(table).select("*").order(order, { ascending });
    setRows((data as T[]) ?? []);
    setLoading(false);
  }, [table, order, ascending]);

  useEffect(() => {
    load();
    const ch = supabase
      .channel(`rt-${table}-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [table, load]);

  return { rows, loading, reload: load };
}

export async function uploadPhoto(file: File) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type });
  if (error) throw error;
  const { data, error: e2 } = await supabase.storage
    .from("media")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (e2 || !data) throw e2 ?? new Error("Falha no link da foto");
  return data.signedUrl;
}
