-- ─────────────────────────────────────────────────────────────────────────────
-- On The Way — Supabase Database Schema
-- Run in Supabase SQL Editor: https://app.supabase.com/project/_/sql
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Users ────────────────────────────────────────────────────────────────────
-- Extends Supabase Auth (auth.users) with app-specific fields

create table public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text not null,
  email         text not null unique,
  avatar_url    text,
  phone         text,                      -- revealed only after deal locks
  role          text not null default 'sender' check (role in ('sender','driver')),
  avg_rating    numeric(3,2) not null default 0,
  completed_trips int not null default 0,
  verified      boolean not null default false,
  created_at    timestamptz not null default now()
);

-- Auto-create user row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'משתמש חדש'),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Shipments ────────────────────────────────────────────────────────────────

create table public.shipments (
  id              uuid primary key default uuid_generate_v4(),
  owner_id        uuid not null references public.users(id) on delete cascade,

  title           text not null,
  category        text not null check (category in (
                    'ריהוט','מוצרי חשמל','קופסאות','אופניים','מכשיר כביסה','מזרן','אחר'
                  )),
  image_url       text,
  description     text,

  from_city       text not null,
  from_floor      int not null default 0,
  from_elevator   boolean not null default false,

  to_city         text not null,
  to_floor        int not null default 0,
  to_elevator     boolean not null default false,

  help_level      text not null default 'curb_to_curb'
                    check (help_level in ('curb_to_curb','help_needed')),
  urgency         text not null default 'flexible'
                    check (urgency in ('flexible','immediate')),
  pickup_window   text,

  status          text not null default 'open'
                    check (status in ('open','locked','in_progress','completed','cancelled')),
  selected_bid_id uuid,                    -- FK added after bids table

  created_at      timestamptz not null default now()
);

-- Computed columns via view (bids_count, lowest_bid)
create view public.shipments_with_stats as
  select
    s.*,
    count(b.id)::int       as bids_count,
    min(b.amount)          as lowest_bid
  from public.shipments s
  left join public.bids b on b.shipment_id = s.id and b.status = 'active'
  group by s.id;

-- ── Bids ─────────────────────────────────────────────────────────────────────

create table public.bids (
  id           uuid primary key default uuid_generate_v4(),
  shipment_id  uuid not null references public.shipments(id) on delete cascade,
  driver_id    uuid not null references public.users(id) on delete cascade,

  amount       int not null check (amount > 0),     -- net to driver (ILS)
  platform_fee int not null default 35,              -- platform commission (ILS)
  eta          text not null,
  note         text,

  status       text not null default 'active'
                 check (status in ('active','selected','rejected')),
  created_at   timestamptz not null default now(),

  unique (shipment_id, driver_id)                    -- one bid per driver per shipment
);

-- Add FK for selected_bid now that bids exists
alter table public.shipments
  add constraint fk_selected_bid
  foreign key (selected_bid_id) references public.bids(id);

-- ── Reviews ──────────────────────────────────────────────────────────────────

create table public.reviews (
  id           uuid primary key default uuid_generate_v4(),
  shipment_id  uuid not null references public.shipments(id) on delete cascade,
  driver_id    uuid not null references public.users(id),
  sender_id    uuid not null references public.users(id),
  rating       int not null check (rating between 1 and 5),
  comment      text,
  created_at   timestamptz not null default now(),
  unique (shipment_id, sender_id)
);

-- Auto-update driver avg_rating after review insert
create or replace function public.update_driver_rating()
returns trigger language plpgsql as $$
begin
  update public.users
  set avg_rating = (
    select round(avg(rating)::numeric, 2)
    from public.reviews
    where driver_id = new.driver_id
  )
  where id = new.driver_id;
  return new;
end;
$$;

create trigger after_review_insert
  after insert on public.reviews
  for each row execute function public.update_driver_rating();

-- ── Row Level Security ────────────────────────────────────────────────────────

alter table public.users      enable row level security;
alter table public.shipments  enable row level security;
alter table public.bids       enable row level security;
alter table public.reviews    enable row level security;

-- Users: public read of non-sensitive fields; own row full access
create policy "public can read users"   on public.users for select using (true);
create policy "users manage own row"    on public.users for all using (auth.uid() = id);

-- Shipments: open = public read; owner = full access
create policy "anyone reads open shipments"
  on public.shipments for select using (status = 'open' or owner_id = auth.uid());
create policy "owner manages shipment"
  on public.shipments for all using (owner_id = auth.uid());
create policy "authenticated inserts"
  on public.shipments for insert with check (auth.uid() is not null);

-- Bids: driver sees own bids; shipment owner sees bids on their shipments
create policy "driver sees own bids"
  on public.bids for select using (driver_id = auth.uid());
create policy "owner sees bids on their shipments"
  on public.bids for select using (
    exists (select 1 from public.shipments s where s.id = shipment_id and s.owner_id = auth.uid())
  );
create policy "driver inserts bid"
  on public.bids for insert with check (auth.uid() = driver_id);
create policy "driver updates own bid"
  on public.bids for update using (driver_id = auth.uid());

-- Reviews: public read; sender inserts
create policy "public reads reviews"  on public.reviews for select using (true);
create policy "sender inserts review" on public.reviews for insert with check (auth.uid() = sender_id);
