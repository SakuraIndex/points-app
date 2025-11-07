"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui";

type Acc = { id: string; program: string; balance: number; expires_at: string | null };
type Rate = { program: string; yen_rate: number };

export default function Dashboard() {
  const [rows, setRows] = useState<Acc[]>([]);
  const [totalYen, setTotalYen] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    // ログイン確認（未ログインなら空で表示）
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setRows([]);
      setTotalYen(0);
      setLoading(false);
      return;
    }

    // ユーザーのポイント口座を取得
    const { data: accounts, error: e1 } = await supabase
      .from("loyalty_accounts")
      .select("id, program, balance, expires_at")
      .order("expires_at", { ascending: true });

    // レート表を取得（なければ空配列）
    const { data: rates, error: e2 } = await supabase
      .from("rate_table")
      .select("program, yen_rate");

    if (e1 || e2) {
      setRows([]);
      setTotalYen(0);
      setLoading(false);
      return;
    }

    const list = (accounts ?? []) as Acc[];
    const rateMap = new Map((rates ?? []).map((r: Rate) => [r.program, Number(r.yen_rate || 1)]));

    const total = list.reduce((sum, a) => {
      const rate = rateMap.get(a.program) ?? 1; // レート無ければ1
      return sum + Number(a.balance || 0) * rate;
    }, 0);

    setRows(list);
    setTotalYen(total);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <Card title="総資産（円換算）">
        <div className="text-3xl font-bold">
          {loading ? "計算中…" : `${Math.round(totalYen).toLocaleString()} 円`}
        </div>
      </Card>

      <Card title="期限が近いポイント">
        {rows.length === 0 ? (
          <div>まだアカウントがありません。/accounts から追加してください。</div>
        ) : (
          <ul className="space-y-2">
            {rows.slice(0, 10).map((a) => (
              <li key={a.id} className="flex items-center justify-between border-b pb-1">
                <span>{a.program}</span>
                <span className="text-right w-24">{a.balance}</span>
                <span className="w-36 text-center">{a.expires_at ?? "-"}</span>
                <a className="text-blue-600 underline" href={`/accounts/${a.id}`}>編集</a>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
