import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui";

export const dynamic = "force-dynamic";

async function fetchData() {
  const { data: accounts } = await supabase.from("loyalty_accounts").select("*").order("expires_at", { ascending: true });
  const { data: rates } = await supabase.from("rate_table").select("*");
  const rateMap = new Map((rates ?? []).map(r => [r.program, Number(r.yen_rate)]));
  const totalYen = (accounts??[]).reduce((s,a)=> s + Number(a.balance) * (rateMap.get(a.program) ?? 1), 0);
  return { accounts: accounts ?? [], totalYen, rateMap };
}

export default async function Dashboard() {
  const { accounts, totalYen } = await fetchData();
  return (
    <div className="space-y-4">
      <Card title="総資産（円換算）">
        <div className="text-3xl font-bold">{Math.round(totalYen).toLocaleString()} 円</div>
      </Card>
      <Card title="期限が近いポイント">
        <ul className="space-y-2">
          {accounts.slice(0,10).map(a=>(
            <li key={a.id} className="flex items-center justify-between">
              <span>{a.program}</span>
              <span>{a.balance} pt</span>
              <span className="text-sm opacity-70">{a.expires_at ?? "-"}</span>
              <a className="text-blue-600 underline" href={`/accounts/${a.id}`}>編集</a>
            </li>
          ))}
          {accounts.length===0 && <li>まだアカウントがありません。/accounts から追加してください。</li>}
        </ul>
      </Card>
    </div>
  );
}
