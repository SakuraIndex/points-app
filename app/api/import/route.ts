import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

const Row = z.object({
  program: z.string().min(1),
  balance: z.string().or(z.number()),
  expires_at: z.string().nullable().optional()
});

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "file required" }, { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const records = parse(buf.toString("utf8"), { columns: true, skip_empty_lines: true }) as any[];
  const user = (await supabase.auth.getUser()).data.user; // クライアント側のセッション前提
  if (!user) return NextResponse.json({ error: "auth required" }, { status: 401 });

  const rows = records.map(r => Row.parse({
    program: r.program?.trim(),
    balance: r.balance,
    expires_at: r.expires_at || null
  }));

  const payload = rows.map(r => ({
    user_id: user.id,
    program: r.program,
    balance: Number(r.balance),
    expires_at: r.expires_at || null
  }));

  const { error } = await supabase.from("loyalty_accounts").insert(payload);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ count: payload.length });
}
