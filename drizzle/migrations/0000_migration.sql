create type public.app_role as enum ('admin');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade not null, role app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated; grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());
create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create or replace function public.handle_first_admin() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.user_roles where role='admin') then
    insert into public.user_roles(user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_admin after insert on auth.users for each row execute function public.handle_first_admin();

create table public.shows (id uuid primary key default gen_random_uuid(), show_date date not null, artist text not null, photo_url text, start_time text not null default '20:00', style text not null default 'Sertanejo', active boolean not null default true, created_at timestamptz not null default now());
create table public.menu_items (id uuid primary key default gen_random_uuid(), category text not null, name text not null, description text, price numeric(10,2) not null default 0, photo_url text, active boolean not null default true, sort int not null default 0, created_at timestamptz not null default now());
create table public.promotions (id uuid primary key default gen_random_uuid(), title text not null, description text, badge text, active boolean not null default true, sort int not null default 0, created_at timestamptz not null default now());

grant select on public.shows, public.menu_items, public.promotions to anon, authenticated;
grant insert, update, delete on public.shows, public.menu_items, public.promotions to authenticated;
grant all on public.shows, public.menu_items, public.promotions to service_role;
alter table public.shows enable row level security;
alter table public.menu_items enable row level security;
alter table public.promotions enable row level security;
create policy "public read shows" on public.shows for select using (active or public.has_role(auth.uid(),'admin'));
create policy "admin all shows" on public.shows for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "public read menu" on public.menu_items for select using (active or public.has_role(auth.uid(),'admin'));
create policy "admin all menu" on public.menu_items for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "public read promos" on public.promotions for select using (active or public.has_role(auth.uid(),'admin'));
create policy "admin all promos" on public.promotions for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

alter publication supabase_realtime add table public.shows;
alter publication supabase_realtime add table public.menu_items;
alter publication supabase_realtime add table public.promotions;

insert into public.shows (show_date, artist, start_time, style) values
(current_date, 'Dupla Viola & Prosa', '20:30', 'Sertanejo raiz'),
(current_date + 1, 'Banda Lampião', '21:00', 'Pop rock'),
(current_date + 2, 'Lia Moraes', '20:30', 'MPB & voz e violão'),
(current_date + 3, 'Trio Pé de Serra', '21:00', 'Forró'),
(current_date + 4, 'Samba da Doca', '19:30', 'Samba & pagode'),
(current_date + 5, 'Rafa & Thiago', '20:30', 'Sertanejo universitário'),
(current_date + 6, 'Acústico Âmbar', '19:00', 'Acústico');

insert into public.menu_items (category, name, description, price, sort) values
('Porções','Fritas com cheddar e bacon','Crocante por fora, perigosa por dentro.',39.90,1),
('Porções','Isca de tilápia','Empanada na hora, com molho tártaro da casa.',62.90,2),
('Porções','Contra-filé acebolado','Pra dividir... ou não.',79.90,3),
('Porções','Frango a passarinho','Alho frito por cima, felicidade embaixo.',49.90,4),
('Petiscos','Bolinho de mandioca com carne seca','8 unidades de puro afeto mineiro.',34.90,1),
('Petiscos','Pastelzinho sortido','Carne, queijo e palmito.',32.90,2),
('Petiscos','Torresmo de rolo','Pururuca que estala.',36.90,3),
('Cervejas','Chopp pilsen 300ml','Trincando de gelado.',9.90,1),
('Cervejas','Cerveja 600ml','Pergunte as marcas do dia.',16.90,2),
('Cervejas','Balde com 5 long necks','Pra mesa não secar.',49.90,3),
('Drinks','Caipirinha de limão','Clássica, honesta, gelada.',19.90,1),
('Drinks','Gin tônica de frutas vermelhas','Com especiarias e muito gelo.',29.90,2),
('Drinks','Aperol spritz','Pôr do sol no copo.',27.90,3),
('Sobremesas','Petit gâteau com sorvete','Quente + gelado = amor.',24.90,1),
('Sobremesas','Pudim da casa','Liso, sem furinho.',16.90,2);

insert into public.promotions (title, description, badge, sort) values
('Aniversário no Doca','Traga 20 ou mais pessoas e ganhe um bolo de 1,5 kg. Você assopra, a gente comemora junto.','Mais pedida',1),
('Happy Hour do Chopp','Segunda a sexta, das 17h30 às 19h30: chopp em dobro. Sim, em dobro.','17h30 – 19h30',2),
('Domingo em Família','Kids até 10 anos ganham suco natural com a porção kids.','Domingo',3);