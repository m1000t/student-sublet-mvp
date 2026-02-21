-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text not null,
  university text not null,
  bio text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Listings table
create table public.listings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  description text not null,
  rent numeric not null,
  start_date date not null,
  end_date date not null,
  location text not null,
  images text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Saved listings table
create table public.saved_listings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  listing_id uuid references public.listings(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, listing_id)
);

-- Messages table (optional)
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.users(id) on delete cascade not null,
  receiver_id uuid references public.users(id) on delete cascade not null,
  listing_id uuid references public.listings(id) on delete set null,
  content text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) Policies

-- Users policies
alter table public.users enable row level security;

create policy "Users can view all profiles"
  on public.users for select
  using (true);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- Listings policies
alter table public.listings enable row level security;

create policy "Anyone can view listings"
  on public.listings for select
  using (true);

create policy "Users can create listings"
  on public.listings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own listings"
  on public.listings for update
  using (auth.uid() = user_id);

create policy "Users can delete own listings"
  on public.listings for delete
  using (auth.uid() = user_id);

-- Saved listings policies
alter table public.saved_listings enable row level security;

create policy "Users can view own saved listings"
  on public.saved_listings for select
  using (auth.uid() = user_id);

create policy "Users can save listings"
  on public.saved_listings for insert
  with check (auth.uid() = user_id);

create policy "Users can unsave listings"
  on public.saved_listings for delete
  using (auth.uid() = user_id);

-- Messages policies (optional)
alter table public.messages enable row level security;

create policy "Users can view their messages"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "Users can update their received messages"
  on public.messages for update
  using (auth.uid() = receiver_id);

-- Indexes for performance
create index listings_user_id_idx on public.listings(user_id);
create index listings_created_at_idx on public.listings(created_at desc);
create index saved_listings_user_id_idx on public.saved_listings(user_id);
create index saved_listings_listing_id_idx on public.saved_listings(listing_id);
create index messages_sender_id_idx on public.messages(sender_id);
create index messages_receiver_id_idx on public.messages(receiver_id);

-- Storage bucket setup (run this in Supabase Dashboard > Storage)
-- Create a bucket called 'listings' with public access enabled
-- Then set up storage policies:

-- Storage policies for listings bucket
create policy "Users can upload their own images"
  on storage.objects for insert
  with check (bucket_id = 'listings' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Anyone can view listing images"
  on storage.objects for select
  using (bucket_id = 'listings');

create policy "Users can delete their own images"
  on storage.objects for delete
  using (bucket_id = 'listings' and auth.uid()::text = (storage.foldername(name))[1]);
