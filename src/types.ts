export type Species = 'Perro' | 'Gato' | 'Conejo' | 'Hurón' | 'Otro';

export type ServiceType = 
  | 'Limpieza Dental (Profilaxis)'
  | 'Extracción Dental'
  | 'Tratamiento Periodontal'
  | 'Revisión Dental Preventiva'
  | 'Cirugía Oral & Maxilofacial'
  | 'Consulta Médica General'
  | 'Vacunación & Desparasitación'
  | 'Urgencia Clínica';

export type AppointmentStatus = 
  | 'pendiente'
  | 'confirmada'
  | 'en_consulta'
  | 'completada'
  | 'cancelada';

export interface Patient {
  id: string;
  name: string;
  species: Species;
  breed: string;
  ageYears: number;
  ageMonths: number;
  weightKg: number;
  gender: 'Macho' | 'Hembra';
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  chipNumber?: string;
  medicalNotes?: string;
  dentalNotes?: string;
  allergies?: string;
  createdAt: string;
  avatarUrl?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  species: Species;
  ownerName: string;
  ownerPhone: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM (e.g. "08:30", "14:00")
  service: ServiceType;
  veterinarian: string;
  status: AppointmentStatus;
  notes?: string;
  dentalGrade?: 'Grado 0 (Sano)' | 'Grado 1 (Gingivitis leve)' | 'Grado 2 (Sarro moderado)' | 'Grado 3 (Periodontitis severa)' | 'Grado 4 (Avanzado)';
  treatmentCost?: number;
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  color: string;
}

export interface TimeSlotInfo {
  time: string; // "08:00", "08:30", etc.
  shift: 'morning' | 'afternoon';
  isAvailable: boolean;
  appointment?: Appointment;
}
