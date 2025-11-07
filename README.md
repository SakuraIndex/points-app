# points-app (Sakura Index)
ポイント管理アプリ MVP。Next.js + Supabase。

## 準備
1. Supabaseで新規プロジェクト → URL/Anon Key を .env.local に設定
2. Supabase SQL エディタで /supabase/schema.sql を実行（DDL & RLS）
3. `npm i` → `npm run dev` → http://localhost:3000

## デプロイ
- GitHubにPush → Vercelで「Import」→ 環境変数を設定

