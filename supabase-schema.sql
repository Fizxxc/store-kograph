-- KOGRAPH STUDIO.ID - Supabase schema + RLS
-- Jalankan di SQL Editor Supabase

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  slug text not null unique,
  duration_label text,
  description text,
  product_type text not null default 'digital',
  base_price integer not null default 0,
  display_price integer not null default 0,
  badge text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  order_code text not null unique,
  product_name text not null,
  category text not null,
  display_amount integer not null,
  payment_method text not null default 'qris',
  payment_status text not null default 'pending',
  order_status text not null default 'waiting_payment',
  qr_string text,
  cashify_transaction_id text unique,
  cashify_total_amount integer,
  unique_nominal integer,
  whatsapp_url text,
  expires_at timestamptz,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.broadcasts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  endpoint text not null unique,
  subscription jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.webhook_logs (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_name text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name),
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at before update on public.products for each row execute function public.set_updated_at();
drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at before update on public.orders for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.broadcasts enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.webhook_logs enable row level security;

-- PROFILES
create policy "profiles_select_self_or_admin" on public.profiles
for select using (auth.uid() = id or public.is_admin());
create policy "profiles_insert_self" on public.profiles
for insert with check (auth.uid() = id);
create policy "profiles_update_self_or_admin" on public.profiles
for update using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

-- PRODUCTS
create policy "products_read_public" on public.products
for select using (is_active = true or public.is_admin());
create policy "products_admin_write" on public.products
for all using (public.is_admin()) with check (public.is_admin());

-- ORDERS
create policy "orders_select_own_or_admin" on public.orders
for select using (auth.uid() = user_id or public.is_admin());
create policy "orders_insert_own" on public.orders
for insert with check (auth.uid() = user_id);
create policy "orders_update_admin_only" on public.orders
for update using (public.is_admin()) with check (public.is_admin());
create policy "orders_delete_admin_only" on public.orders
for delete using (public.is_admin());

-- BROADCASTS
create policy "broadcasts_read_authenticated" on public.broadcasts
for select using (auth.role() = 'authenticated');
create policy "broadcasts_admin_write" on public.broadcasts
for all using (public.is_admin()) with check (public.is_admin());

-- PUSH SUBSCRIPTIONS
create policy "push_select_own_or_admin" on public.push_subscriptions
for select using (auth.uid() = user_id or public.is_admin());
create policy "push_insert_own" on public.push_subscriptions
for insert with check (auth.uid() = user_id);
create policy "push_update_own_or_admin" on public.push_subscriptions
for update using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());
create policy "push_delete_own_or_admin" on public.push_subscriptions
for delete using (auth.uid() = user_id or public.is_admin());

-- WEBHOOK LOGS
create policy "webhook_logs_admin_only" on public.webhook_logs
for all using (public.is_admin()) with check (public.is_admin());

-- Seed admin: ganti email sesuai akunmu setelah user mendaftar
-- update public.profiles set role = 'admin' where email = 'fizzx404@gmail.com';

insert into public.products (category, name, slug, duration_label, description, product_type, base_price, display_price, badge)
values
('APP EDITING', 'Capcut Pro', 'capcut-pro-7-hari', '7 Hari', 'Akses fitur premium Capcut selama 7 hari', 'digital', 5000, 5000, 'Best Seller'),
('APP EDITING', 'Capcut Pro', 'capcut-pro-35-hari', '35 Hari', 'Akses fitur premium Capcut selama 35 hari', 'digital', 10000, 10000, null),
('APP EDITING', 'Alight Motion', 'alight-motion-1-tahun', '1 Tahun', 'Akses penuh Alight Motion premium 1 tahun', 'digital', 4000, 4000, null),
('APP EDITING', 'Canva Pro', 'canva-pro-30-hari', '30 Hari', 'Canva Pro dengan semua fitur premium 30 hari', 'digital', 7000, 7000, null),
('APP EDITING', 'Canva Edu', 'canva-edu-lifetime', 'Lifetime', 'Canva Education lifetime, sekali bayar selamanya', 'digital', 5000, 5000, 'Value'),
('AI PRO', 'Chat GPT Pro', 'chatgpt-pro-30-hari', '30 Hari', 'Akses ChatGPT Pro selama 30 hari', 'digital', 10000, 10000, null),
('AI PRO', 'Chat GPT+', 'chatgpt-plus-7-hari', '7 Hari', 'Akses ChatGPT Plus selama 7 hari', 'digital', 5000, 5000, null),
('AI PRO', 'Gemini Pro', 'gemini-pro-3-bulan', '3 Bulan', 'Akses Gemini Pro selama 3 bulan penuh', 'digital', 15000, 15000, null),
('AI PRO', 'Perplexity Pro', 'perplexity-pro-30-hari', '30 Hari', 'Akses Perplexity Pro selama 30 hari', 'digital', 7000, 7000, null),
('STREAM', 'Prime Video', 'prime-video-30-hari', '30 Hari', 'Amazon Prime Video 30 hari', 'digital', 10000, 10000, null),
('STREAM', 'HBO Max', 'hbo-max-sharing-30d', 'Sharing 30d', 'HBO Max sharing 30 hari', 'digital', 15000, 15000, null),
('STREAM', 'VISION+ Premium', 'vision-plus-premium-30-hari', '30 Hari', 'VISION+ Premium 30 hari', 'digital', 17000, 17000, null),
('STREAM', 'Viu', 'viu-3-bulan', '3 Bulan', 'Viu premium selama 3 bulan', 'digital', 8000, 8000, null),
('STREAM', 'Viu', 'viu-6-bulan', '6 Bulan', 'Viu premium selama 6 bulan', 'digital', 15000, 15000, null),
('STREAM', 'YouTube Premium', 'youtube-premium-30-hari', '30 Hari', 'YouTube Premium 30 hari tanpa iklan', 'digital', 8000, 8000, null),
('PAID EDIT', 'Paket Murah Tapi Ga Murahan', 'paid-edit-paket-1', null, 'Jedag Jedug 3D, JJ, Logo, Poster', 'service', 5000, 5000, '01'),
('PAID EDIT', 'Paket Lumayan', 'paid-edit-paket-2', null, 'Jedag Jedug 3D, JJ, Logo, Poster', 'service', 10000, 10000, '02'),
('PAID EDIT', 'Paket Sultan', 'paid-edit-paket-3', null, 'Jedag Jedug 3D, JJ, Logo, Poster', 'service', 15000, 15000, '03'),
('PAID EDIT', 'Paket Legends', 'paid-edit-paket-4', null, 'Bebas request Jedag Jedug 3D, JJ, Logo, Poster', 'service', 20000, 20000, '04'),
('PANEL PTERODACTYL', 'Panel Bot 1GB Express', 'panel-bot-1gb-express', 'Private', 'RAM 1025MB, Disk 1025MB, CPU 0%, Node.js 20+, garansi 30 hari, 5x replace', 'panel', 9500, 9500, 'Express'),
('PANEL PTERODACTYL', 'Panel Bot 2GB Express', 'panel-bot-2gb-express', 'Private', 'RAM 2025MB, Disk 2025MB, CPU 0%, paket standar untuk bot level menengah', 'panel', 10500, 10500, 'Express'),
('PANEL PTERODACTYL', 'Panel Bot 3GB Express', 'panel-bot-3gb-express', 'Private', 'RAM 3025MB, Disk 3025MB, CPU 0%, cocok untuk script bot berat', 'panel', 11500, 11500, 'Express'),
('PANEL PTERODACTYL', 'Panel Bot Unlimited Express', 'panel-bot-unlimited-express', 'Bisnis', 'RAM Unlimited, Disk Unlimited, untuk semua jenis script bot tanpa batas', 'panel', 17000, 17000, 'Unlimited'),
('PANEL PTERODACTYL', 'Panel Bot 1GB', 'panel-bot-1gb-regular', 'Regular', '1025MB, 1025MB, CPU 40%', 'panel', 5000, 5000, 'Shared'),
('PANEL PTERODACTYL', 'Panel Bot 2GB', 'panel-bot-2gb-regular', 'Regular', '2025MB, 2025MB, CPU 80%', 'panel', 7000, 7000, 'Shared'),
('PANEL PTERODACTYL', 'Panel Bot 3GB', 'panel-bot-3gb-regular', 'Regular', '3025MB, 3025MB, CPU 120%', 'panel', 9000, 9000, 'Shared'),
('PANEL PTERODACTYL', 'Panel Bot 5GB', 'panel-bot-5gb-regular', 'Regular', '5025MB, 5025MB, CPU 200%', 'panel', 10000, 10000, 'Shared'),
('PANEL PTERODACTYL', 'Panel Bot Unlimited', 'panel-bot-unlimited-regular', 'Bisnis', 'Unlimited RAM dan Disk untuk semua jenis script bot', 'panel', 17000, 17000, 'Unlimited')
on conflict (slug) do update
set category = excluded.category,
    name = excluded.name,
    duration_label = excluded.duration_label,
    description = excluded.description,
    product_type = excluded.product_type,
    base_price = excluded.base_price,
    display_price = excluded.display_price,
    badge = excluded.badge,
    is_active = true,
    updated_at = now();
