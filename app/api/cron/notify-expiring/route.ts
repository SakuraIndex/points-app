// app/api/cron/notify-expiring/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    // 期間：今日〜7日後
    const now = new Date();
    const from = new Date(now.getTime());
    const to = new Date(now.getTime());
    to.setDate(to.getDate() + 7);

    // 期限が7日以内のレコードを取得（service role でRLSをバイパス）
    const { data: rows, error } = await supabaseAdmin
      .from("loyalty_accounts")
      .select("user_id, program, balance, expires_at")
      .gte("expires_at", from.toISOString())
      .lte("expires_at", to.toISOString());

    if (error) throw error;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: "No expiring points" });
    }

    // 対象ユーザーのメールを取得（profiles を使用）
    const userIds = [...new Set(rows.map((r) => r.user_id))];
    const { data: users, error: uErr } = await supabaseAdmin
      .from("profiles")
      .select("id, email")
      .in("id", userIds);

    if (uErr) throw uErr;

    let sent = 0;
    for (const u of users ?? []) {
      if (!u.email) continue;

      const mine = rows.filter((r) => r.user_id === u.id);
      if (mine.length === 0) continue;

      const lines = mine
        .map(
          (r) =>
            `・${r.program}: ${r.balance}pt（期限 ${r.expires_at?.slice(0, 10)}）`
        )
        .join("\n");

      await resend.emails.send({
        // まずはResend既定FromでOK。独自ドメインは後で設定可能
        from: "Sakura Points <onboarding@resend.dev>",
        to: u.email,
        subject: "【Sakura Points】期限が近いポイントがあります",
        text:
          `こんにちは。\n以下のポイントがまもなく期限切れになります：\n\n` +
          lines +
          `\n\nお早めにご確認ください。\n\nSakura Index`,
      });
      sent++;
    }

    return NextResponse.json({ sent });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
