"use client";
import { useState } from "react";
import { Button } from "@/components/ui";

export default function ImportPage() {
  const [file,setFile]=useState<File|undefined>();

  const upload = async ()=>{
    if(!file) return alert("CSVを選択");
    const body = new FormData(); body.append("file", file);
    const res = await fetch("/api/import", { method:"POST", body });
    const json = await res.json();
    alert(`インポート完了: ${json.count}件`);
  };
  return (
    <div className="space-y-4">
      <p>CSVヘッダ：<code>program,balance,expires_at</code></p>
      <input type="file" accept=".csv" onChange={e=>setFile(e.target.files?.[0])}/>
      <Button onClick={upload}>インポート</Button>
    </div>
  );
}
