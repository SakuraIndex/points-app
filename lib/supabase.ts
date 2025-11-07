import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      // ← ここが重要！
      persistSession: true,        // セッションをlocalStorageに保存
      autoRefreshToken: true,      // トークン自動更新
      detectSessionInUrl: true,    // Magic Link のURLからセッションを取り込む
      storageKey: "sakura-points-auth" // 任意のキー名
    }
  }
);
