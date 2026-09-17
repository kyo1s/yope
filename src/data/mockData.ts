import { Patient, Appointment, Doctor } from '../types';

export const DOCTORS: Doctor[] = [
  { id: 'doc-1', name: 'Dra. Camila Morales', specialty: 'Odontología & Cirugía Oral Veterinaria', color: 'emerald' },
  { id: 'doc-2', name: 'Dr. Alejandro Peña', specialty: 'Medicina General & Periodoncia Canina', color: 'teal' },
  { id: 'doc-3', name: 'Dra. Sofía Rivas', specialty: 'Odontología Felina & Profilaxis', color: 'cyan' },
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    name: 'Toby',
    species: 'Perro',
    breed: 'Golden Retriever',
    ageYears: 4,
    ageMonths: 6,
    weightKg: 31.5,
    gender: 'Macho',
    ownerName: 'Carlos Benítez',
    ownerPhone: '+34 612 345 678',
    ownerEmail: 'carlos.benitez@gmail.com',
    chipNumber: 'ES-9840291048',
    medicalNotes: 'Vacunas al día. Desparasitado el mes pasado.',
    dentalNotes: 'Acumulación de sarro en premolares superiores. Requiere profilaxis dental por ultrasonido.',
    allergies: 'Ninguna conocida',
    createdAt: '2026-09-01T10:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'pat-2',
    name: 'Luna',
    species: 'Gato',
    breed: 'Siamés',
    ageYears: 3,
    ageMonths: 2,
    weightKg: 4.2,
    gender: 'Hembra',
    ownerName: 'Mariana Duarte',
    ownerPhone: '+34 678 912 345',
    ownerEmail: 'mariana.d@yahoo.com',
    chipNumber: 'ES-9840291992',
    medicalNotes: 'Esterilizada. Test de leucemia felina negativo.',
    dentalNotes: 'Gingivitis marginal leve en incisivos. Se recomienda pasta enzimática felina.',
    allergies: 'Sensibilidad a la penicilina',
    createdAt: '2026-09-03T11:30:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'pat-3',
    name: 'Max',
    species: 'Perro',
    breed: 'Bulldog Francés',
    ageYears: 5,
    ageMonths: 0,
    weightKg: 13.0,
    gender: 'Macho',
    ownerName: 'Gonzalo Silva',
    ownerPhone: '+34 644 221 100',
    ownerEmail: 'gonzalo.s@outlook.com',
    chipNumber: 'ES-9840294432',
    medicalNotes: 'Síndrome braquiocefálico leve. Monitorizar oxigenación en anestesia.',
    dentalNotes: 'Maloclusión clase 3 típica de la raza, sarro moderado grado 2 en caninos.',
    allergies: 'Ninguna',
    createdAt: '2026-09-05T09:15:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'pat-4',
    name: 'Mimi',
    species: 'Gato',
    breed: 'Europeo Común',
    ageYears: 7,
    ageMonths: 4,
    weightKg: 5.1,
    gender: 'Hembra',
    ownerName: 'Lucía Fernández',
    ownerPhone: '+34 699 887 766',
    ownerEmail: 'lucia.fer@gmail.com',
    chipNumber: 'ES-9840296711',
    medicalNotes: 'Control renal anual pendiente. Dieta renal prescrita.',
    dentalNotes: 'Resorción dental felina (FORL) en pieza 307. Programar radiografía intraoral y exodoncia.',
    allergies: 'Polen estacional',
    createdAt: '2026-09-08T14:20:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'pat-5',
    name: 'Copito',
    species: 'Conejo',
    breed: 'Belier Enano',
    ageYears: 2,
    ageMonths: 1,
    weightKg: 1.8,
    gender: 'Macho',
    ownerName: 'Andrea Gómez',
    ownerPhone: '+34 622 113 344',
    ownerEmail: 'andrea.gomez@gmail.com',
    chipNumber: 'ES-9840298810',
    medicalNotes: 'Dieta alta en heno timothy. Desgaste dental continuo.',
    dentalNotes: 'Sobrecrecimiento en molares inferiores con puntas hacia lengua. Requiere limado dental bajo sedación.',
    allergies: 'Ninguna',
    createdAt: '2026-09-10T16:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=300&q=80',
  }
];

// Today's date helper in YYYY-MM-DD
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const today = getTodayDateString();

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    patientId: 'pat-1',
    patientName: 'Toby',
    species: 'Perro',
    ownerName: 'Carlos Benítez',
    ownerPhone: '+34 612 345 678',
    date: today,
    timeSlot: '08:30',
    service: 'Limpieza Dental (Profilaxis)',
    veterinarian: 'Dra. Camila Morales',
    status: 'en_consulta',
    notes: 'Profilaxis ultrasónica iniciada. Sarro en molares.',
    dentalGrade: 'Grado 2 (Sarro moderado)',
    treatmentCost: 85,
    createdAt: '2026-09-15T08:00:00Z',
  },
  {
    id: 'apt-2',
    patientId: 'pat-2',
    patientName: 'Luna',
    species: 'Gato',
    ownerName: 'Mariana Duarte',
    ownerPhone: '+34 678 912 345',
    date: today,
    timeSlot: '10:00',
    service: 'Revisión Dental Preventiva',
    veterinarian: 'Dra. Sofía Rivas',
    status: 'confirmada',
    notes: 'Revisión periódica de encías y aplicación de gel antiséptico.',
    dentalGrade: 'Grado 1 (Gingivitis leve)',
    treatmentCost: 40,
    createdAt: '2026-09-15T09:30:00Z',
  },
  {
    id: 'apt-3',
    patientId: 'pat-3',
    patientName: 'Max',
    species: 'Perro',
    ownerName: 'Gonzalo Silva',
    ownerPhone: '+34 644 221 100',
    date: today,
    timeSlot: '11:30',
    service: 'Extracción Dental',
    veterinarian: 'Dra. Camila Morales',
    status: 'pendiente',
    notes: 'Extracción de diente de leche retenido en maxilar superior.',
    dentalGrade: 'Grado 2 (Sarro moderado)',
    treatmentCost: 110,
    createdAt: '2026-09-16T12:00:00Z',
  },
  {
    id: 'apt-4',
    patientId: 'pat-4',
    patientName: 'Mimi',
    species: 'Gato',
    ownerName: 'Lucía Fernández',
    ownerPhone: '+34 699 887 766',
    date: today,
    timeSlot: '14:30',
    service: 'Tratamiento Periodontal',
    veterinarian: 'Dr. Alejandro Peña',
    status: 'confirmada',
    notes: 'Tratamiento de lesión FORL y curación gingival.',
    dentalGrade: 'Grado 3 (Periodontitis severa)',
    treatmentCost: 135,
    createdAt: '2026-09-16T15:40:00Z',
  },
  {
    id: 'apt-5',
    patientId: 'pat-5',
    patientName: 'Copito',
    species: 'Conejo',
    ownerName: 'Andrea Gómez',
    ownerPhone: '+34 622 113 344',
    date: today,
    timeSlot: '16:00',
    service: 'Cirugía Oral & Maxilofacial',
    veterinarian: 'Dra. Camila Morales',
    status: 'pendiente',
    notes: 'Limado de picos molares con anestesia inhalatoria.',
    dentalGrade: 'Grado 2 (Sarro moderado)',
    treatmentCost: 75,
    createdAt: '2026-09-16T17:10:00Z',
  }
];

// Strict clinic operating schedule:
// Turno Mañana: 08:00 a 13:00 (08:00, 08:30, 09:00, 09:30, 10:00, 10:30, 11:00, 11:30, 12:00, 12:30)
// Receso / Almuerzo: 13:00 a 14:00 (NO se agendan turnos)
// Turno Tarde: 14:00 a 18:00 (14:00, 14:30, 15:00, 15:30, 16:00, 16:30, 17:00, 17:30)

export const MORNING_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00',
  '10:30', '11:00', '11:30', '12:00', '12:30'
];

export const AFTERNOON_SLOTS = [
  '14:00', '14:30', '15:00', '15:30', '16:00',
  '16:30', '17:00', '17:30'
];

export const ALL_WORKING_SLOTS = [...MORNING_SLOTS, ...AFTERNOON_SLOTS];

export const SERVICE_OPTIONS: { label: string; price: number; description: string }[] = [
  { label: 'Limpieza Dental (Profilaxis)', price: 85, description: 'Limpieza ultrasónica de sarro con pulido dental' },
  { label: 'Extracción Dental', price: 110, description: 'Exodoncia simple o quirúrgica de piezas dañadas' },
  { label: 'Tratamiento Periodontal', price: 135, description: 'Tratamiento de encías inflamadas y bolsas periodontales' },
  { label: 'Revisión Dental Preventiva', price: 40, description: 'Examen de cavidad oral, encías y placa bacteriana' },
  { label: 'Cirugía Oral & Maxilofacial', price: 180, description: 'Intervención de tejidos blandos y correcciones orales' },
  { label: 'Consulta Médica General', price: 45, description: 'Chequeo físico integral de la mascota' },
  { label: 'Vacunación & Desparasitación', price: 35, description: 'Inmunización anual y control antiparasitario' },
  { label: 'Urgencia Clínica', price: 70, description: 'Atención prioritaria inmediata' },
];
