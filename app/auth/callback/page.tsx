"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();
  const [msg, setMsg] = useState("ログイン処理中…");

  useEffect(() => {
    (async () => {
      // ① URLハッシュ(#access_token=...)からトークンを取り出す
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      const params = new URLSearchParams(hash.slice(1));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      // ② トークンがあればセッションとして保存
      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (error) {
          setMsg("ログインに失敗しました：" + error.message);
          return;
        }
        setMsg("ログインしました。リダイレクト中…");
        // ③ 好きな場所へ遷移（dashboard か accounts）
        router.replace("/accounts");
        return;
      }

      // OAuth（Google等）の場合はこちら（PKCEコード交換）
      // なくても問題ないですが保険として。
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (!error) {
          setMsg("ログインしました。リダイレクト中…");
          router.replace("/accounts");
          return;
        }
      } catch (_e) {}

      setMsg("無効なログインURLです。/login からやり直してください。");
    })();
  }, [router]);

  return (
    <div className="max-w-md mx-auto mt-16 text-center">
      {msg}
    </div>
  );
}
