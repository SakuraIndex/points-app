"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, Button } from "@/components/ui";

type Acc = { id:string; program:string; balance:number; expires_at:string|null };

export default function Accounts() {
  const [list,setList]=useState<Acc[]>([]);
  const [program,setProgram]=useState(""); 
  const [balance,setBalance]=useState<number>(0);
  const [expires,setExpires]=useState<string>("");

  const load = async ()=>{
    const { data } = await supabase.from("loyalty_accounts").select("id,program,balance,expires_at").order("created_at",{ascending:false});
    setList((data??[]) as any);
  };
  useEffect(()=>{ load(); },[]);

  const add = async ()=>{
    if(!program) return alert("programは必須");
    await supabase.from("loyalty_accounts").insert({ program, balance, expires_at: expires || null, user_id: (await supabase.auth.getUser()).data.user?.id });
    setProgram(""); setBalance(0); setExpires("");
    load();
  };

  return (
    <div className="space-y-4">
      <Card title="新規追加">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input className="border p-2 rounded" placeholder="例: 楽天ポイント" value={program} onChange={e=>setProgram(e.target.value)} />
          <input className="border p-2 rounded" type="number" value={balance} onChange={e=>setBalance(Number(e.target.value))} />
          <input className="border p-2 rounded" type="date" value={expires} onChange={e=>setExpires(e.target.value)} />
          <Button onClick={add}>追加</Button>
        </div>
      </Card>

      <Card title="アカウント一覧">
        <table className="w-full text-sm">
          <thead><tr><th className="text-left">プログラム</th><th>残高</th><th>期限</th><th></th></tr></thead>
          <tbody>
            {list.map(a=>(
              <tr key={a.id} className="border-t">
                <td>{a.program}</td>
                <td className="text-right">{a.balance}</td>
                <td className="text-center">{a.expires_at ?? "-"}</td>
                <td className="text-right"><a className="text-blue-600 underline" href={`/accounts/${a.id}`}>編集</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
