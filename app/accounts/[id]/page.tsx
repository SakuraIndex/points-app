"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export default function EditAccount() {
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const [program,setProgram] = useState("");
  const [balance,setBalance] = useState<number>(0);
  const [expires,setExpires] = useState<string>("");

  useEffect(()=>{
    (async ()=>{
      const { data } = await supabase.from("loyalty_accounts").select("*").eq("id", id).single();
      if(data){ setProgram(data.program); setBalance(Number(data.balance)); setExpires(data.expires_at ?? ""); }
    })();
  },[id]);

  const save = async ()=>{
    await supabase.from("loyalty_accounts").update({ program, balance, expires_at: expires || null }).eq("id", id);
    router.push("/accounts");
  };
  const del = async ()=>{
    if(confirm("削除しますか？")){ await supabase.from("loyalty_accounts").delete().eq("id", id); router.push("/accounts"); }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
        <input className="border p-2 rounded" value={program} onChange={e=>setProgram(e.target.value)} />
        <input className="border p-2 rounded" type="number" value={balance} onChange={e=>setBalance(Number(e.target.value))} />
        <input className="border p-2 rounded" type="date" value={expires} onChange={e=>setExpires(e.target.value)} />
        <Button onClick={save}>保存</Button>
      </div>
      <Button onClick={del} className="border-red-500">削除</Button>
    </div>
  );
}
