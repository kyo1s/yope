import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate if real credentials have been provided
export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim().length > 10 &&
    !supabaseUrl.includes('tu-proyecto.supabase.co') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim().length > 10 &&
    !supabaseAnonKey.includes('tu-anon-key')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// The complete SQL script for Supabase SQL Editor
export const SUPABASE_SQL_SCHEMA = `-- Esquema SQL para Clínica Veterinaria & Odontológica
-- Copia y pega este script en el SQL Editor de tu proyecto en Supabase (https://supabase.com/dashboard)

-- 1. Tabla de Pacientes (Mascotas)
create table if not exists public.patients (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  species text not null check (species in ('Perro', 'Gato', 'Conejo', 'Hurón', 'Otro')),
  breed text not null default 'Mestizo',
  age_years integer not null default 1,
  age_months integer not null default 0,
  weight_kg numeric(5,2) not null default 5.0,
  gender text not null check (gender in ('Macho', 'Hembra')),
  owner_name text not null,
  owner_phone text not null,
  owner_email text not null,
  chip_number text,
  medical_notes text,
  dental_notes text,
  allergies text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- 2. Tabla de Citas y Turnos
create table if not exists public.appointments (
  id text primary key default gen_random_uuid()::text,
  patient_id text not null references public.patients(id) on delete cascade,
  patient_name text not null,
  species text not null,
  owner_name text not null,
  owner_phone text not null,
  date date not null,
  time_slot text not null, -- '08:00', '08:30', ..., '17:30'
  service text not null,
  veterinarian text not null,
  status text not null check (status in ('pendiente', 'confirmada', 'en_consulta', 'completada', 'cancelada')) default 'pendiente',
  notes text,
  dental_grade text,
  treatment_cost numeric(8,2) default 0,
  created_at timestamptz not null default now(),
  -- Restricción única: no puede haber dos citas al mismo tiempo con el mismo veterinario
  constraint unique_vet_date_slot unique(date, time_slot, veterinarian)
);

-- 3. Habilitar Row Level Security (RLS)
alter table public.patients enable row level security;
alter table public.appointments enable row level security;

-- Políticas permisivas para uso en clínica (Lectura y Escritura pública o autenticada)
create policy "Acceso público lectura pacientes" on public.patients for select using (true);
create policy "Acceso público inserción pacientes" on public.patients for insert with check (true);
create policy "Acceso público actualización pacientes" on public.patients for update using (true);
create policy "Acceso público borrado pacientes" on public.patients for delete using (true);

create policy "Acceso público lectura turnos" on public.appointments for select using (true);
create policy "Acceso público inserción turnos" on public.appointments for insert with check (true);
create policy "Acceso público actualización turnos" on public.appointments for update using (true);
create policy "Acceso público borrado turnos" on public.appointments for delete using (true);

-- Índices para búsquedas rápidas por fecha y paciente
create index if not exists idx_appointments_date on public.appointments(date);
create index if not exists idx_patients_name on public.patients(name);
create index if not exists idx_patients_owner on public.patients(owner_name);
`;
