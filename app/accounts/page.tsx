"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, Button } from "@/components/ui";

type Acc = {
  id: string;
  program: string;
  balance: number;
  expires_at: string | null;
};

export default function Accounts() {
  const [list, setList] = useState<Acc[]>([]);
  const [program, setProgram] = useState("");
  // 残高は文字列で保持（空OK）→ 送信時に数値化
  const [balanceText, setBalanceText] = useState<string>("");
  const [expires, setExpires] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("loyalty_accounts")
      .select("id,program,balance,expires_at")
      .order("created_at", { ascending: false });
    setList((data ?? []) as any);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    const name = program.trim();
    if (!name) {
      alert("プログラム名を入力してください");
      return;
    }

    // ログインチェック
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth.user?.id ?? null;
    if (!userId) {
      alert("まず /login でサインインしてください（メールのMagic Linkを開く）");
      return;
    }

    // 数値化（空 or 不正は0）
    const amt = Number(balanceText.replace(/[^\d.-]/g, ""));
    const balance = Number.isFinite(amt) ? amt : 0;

    setSaving(true);
    try {
      // user_id は送らない（Supabase側で default auth.uid() を設定済み）
      const { error } = await supabase.from("loyalty_accounts").insert({
        program: name,
        balance,
        expires_at: expires || null,
      });

      if (error) {
        alert(`追加に失敗しました: ${error.message}`);
        return;
      }

      setProgram("");
      setBalanceText("");
      setExpires("");
      await load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card title="新規追加">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input
            aria-label="プログラム名"
            className="border p-2 rounded bg-white text-gray-900 placeholder-gray-400
                       dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400"
            placeholder="例: 楽天ポイント"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
          />

          {/* 残高：text + inputMode=numeric で空を許容 */}
          <input
            aria-label="残高"
            inputMode="numeric"
            className="border p-2 rounded bg-white text-gray-900
                       dark:bg-zinc-800 dark:text-zinc-50"
            placeholder="0"
            value={balanceText}
            onChange={(e) => {
              // 数字・小数点・ハイフン以外は除去（必要に応じて調整）
              const v = e.target.value.replace(/[^\d.-]/g, "");
              setBalanceText(v);
            }}
          />

          <input
            aria-label="有効期限"
            className="border p-2 rounded bg-white text-gray-900
                       dark:bg-zinc-800 dark:text-zinc-50"
            type="date"
            value={expires}
            onChange={(e) => setExpires(e.target.value)}
          />

          <Button onClick={add} disabled={saving}>
            {saving ? "追加中…" : "追加"}
          </Button>
        </div>
        <p className="text-xs opacity-70 mt-1">
          ※ 追加できない場合は、/login でサインイン後に再実行してください。
        </p>
      </Card>

      <Card title="アカウント一覧">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left py-2">プログラム</th>
              <th className="py-2">残高</th>
              <th className="py-2">期限</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="py-2">{a.program}</td>
                <td className="text-right py-2">{a.balance}</td>
                <td className="text-center py-2">{a.expires_at ?? "-"}</td>
                <td className="text-right py-2">
                  <a
                    className="text-blue-600 underline"
                    href={`/accounts/${a.id}`}
                  >
                    編集
                  </a>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td className="py-4 text-center opacity-70" colSpan={4}>
                  まだアカウントがありません。上のフォームから追加してください。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
