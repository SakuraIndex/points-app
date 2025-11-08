// lib/supabaseAdmin.ts
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,          // ←公開URL（既存と同じ）
  process.env.SUPABASE_SERVICE_ROLE_KEY!,         // ←Vercelに登録した service_role キー
  {
    auth: {
      persistSession: false,   // サーバー専用なのでセッション保存不要
    },
  }
);
