-- テーブル
create table if not exists loyalty_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  program text not null,
  balance numeric not null default 0,
  expires_at date,
  created_at timestamptz not null default now()
);

create table if not exists loyalty_events (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references loyalty_accounts(id) on delete cascade,
  type text not null, -- 'add' | 'use' | 'expire'
  amount numeric not null,
  ts timestamptz not null default now()
);

create table if not exists rate_table (
  program text primary key,
  yen_rate numeric not null,
  updated_at timestamptz not null default now()
);

-- 認証ユーザー view（Supabase Auth想定）
-- RLS
alter table loyalty_accounts enable row level security;
alter table loyalty_events enable row level security;
create policy "own rows only (accounts)"
  on loyalty_accounts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "events by account owner"
  on loyalty_events for all
  using (exists (select 1 from loyalty_accounts a where a.id = account_id and a.user_id = auth.uid()))
  with check (exists (select 1 from loyalty_accounts a where a.id = account_id and a.user_id = auth.uid()));
