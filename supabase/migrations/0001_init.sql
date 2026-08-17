create type transaction_status as enum (
  'PENDING_PAYMENT',
  'PAID',
  'PROCESSING',
  'SUCCESS',
  'FAILED',
  'EXPIRED'
);

create table transactions (
  id text primary key,
  game_code text not null,
  game_name text not null,
  product_code text not null,
  product_name text not null,
  price integer not null,
  account_user_id text not null,
  account_server_id text,
  status transaction_status not null default 'PENDING_PAYMENT',
  payment_method text,
  midtrans_order_id text unique,
  midtrans_transaction_id text,
  provider_order_id text,
  provider_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expired_at timestamptz
);

create index transactions_midtrans_order_id_idx on transactions (midtrans_order_id);
create index transactions_status_idx on transactions (status);

-- Server-only access: the app talks to this table exclusively via the
-- Supabase service-role key from Next.js API routes, never from the client,
-- so row level security stays enabled with no public policies.
alter table transactions enable row level security;
