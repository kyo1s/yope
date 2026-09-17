import { Patient, Appointment } from '../types';
import { INITIAL_PATIENTS, INITIAL_APPOINTMENTS } from '../data/mockData';
import { supabase, isSupabaseConfigured } from './supabase';

const PATIENTS_STORAGE_KEY = 'vetcare_patients_v1';
const APPOINTMENTS_STORAGE_KEY = 'vetcare_appointments_v1';

// Local storage helpers
function getStoredPatients(): Patient[] {
  try {
    const raw = localStorage.getItem(PATIENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(INITIAL_PATIENTS));
      return INITIAL_PATIENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading patients from localStorage', e);
    return INITIAL_PATIENTS;
  }
}

function saveStoredPatients(patients: Patient[]): void {
  try {
    localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
  } catch (e) {
    console.error('Error saving patients to localStorage', e);
  }
}

function getStoredAppointments(): Appointment[] {
  try {
    const raw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(INITIAL_APPOINTMENTS));
      return INITIAL_APPOINTMENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading appointments from localStorage', e);
    return INITIAL_APPOINTMENTS;
  }
}

function saveStoredAppointments(appointments: Appointment[]): void {
  try {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
  } catch (e) {
    console.error('Error saving appointments to localStorage', e);
  }
}

export const db = {
  isCloudConnected(): boolean {
    return isSupabaseConfigured();
  },

  // Patients CRUD
  async getPatients(): Promise<Patient[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          // Map snake_case to camelCase
          return data.map((item) => ({
            id: item.id,
            name: item.name,
            species: item.species,
            breed: item.breed,
            ageYears: item.age_years,
            ageMonths: item.age_months,
            weightKg: Number(item.weight_kg),
            gender: item.gender,
            ownerName: item.owner_name,
            ownerPhone: item.owner_phone,
            ownerEmail: item.owner_email,
            chipNumber: item.chip_number,
            medicalNotes: item.medical_notes,
            dentalNotes: item.dental_notes,
            allergies: item.allergies,
            avatarUrl: item.avatar_url,
            createdAt: item.created_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local store:', err);
      }
    }
    return getStoredPatients();
  },

  async addPatient(patient: Omit<Patient, 'id' | 'createdAt'>): Promise<Patient> {
    const newId = `pat-${Date.now()}`;
    const createdAt = new Date().toISOString();
    const newPatient: Patient = {
      ...patient,
      id: newId,
      createdAt,
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('patients').insert({
          id: newId,
          name: newPatient.name,
          species: newPatient.species,
          breed: newPatient.breed,
          age_years: newPatient.ageYears,
          age_months: newPatient.ageMonths,
          weight_kg: newPatient.weightKg,
          gender: newPatient.gender,
          owner_name: newPatient.ownerName,
          owner_phone: newPatient.ownerPhone,
          owner_email: newPatient.ownerEmail,
          chip_number: newPatient.chipNumber || null,
          medical_notes: newPatient.medicalNotes || null,
          dental_notes: newPatient.dentalNotes || null,
          allergies: newPatient.allergies || null,
          avatar_url: newPatient.avatarUrl || null,
          created_at: createdAt,
        });
        if (error) console.error('Supabase insert error:', error);
      } catch (err) {
        console.warn('Supabase insert failed:', err);
      }
    }

    const current = getStoredPatients();
    const updated = [newPatient, ...current];
    saveStoredPatients(updated);
    return newPatient;
  },

  async updatePatient(patient: Patient): Promise<Patient> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('patients')
          .update({
            name: patient.name,
            species: patient.species,
            breed: patient.breed,
            age_years: patient.ageYears,
            age_months: patient.ageMonths,
            weight_kg: patient.weightKg,
            gender: patient.gender,
            owner_name: patient.ownerName,
            owner_phone: patient.ownerPhone,
            owner_email: patient.ownerEmail,
            chip_number: patient.chipNumber || null,
            medical_notes: patient.medicalNotes || null,
            dental_notes: patient.dentalNotes || null,
            allergies: patient.allergies || null,
            avatar_url: patient.avatarUrl || null,
          })
          .eq('id', patient.id);
        if (error) console.error('Supabase update error:', error);
      } catch (err) {
        console.warn('Supabase update failed:', err);
      }
    }

    const current = getStoredPatients();
    const updated = current.map((p) => (p.id === patient.id ? patient : p));
    saveStoredPatients(updated);
    return patient;
  },

  async deletePatient(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('patients').delete().eq('id', id);
        if (error) console.error('Supabase delete error:', error);
      } catch (err) {
        console.warn('Supabase delete failed:', err);
      }
    }

    const currentPatients = getStoredPatients();
    saveStoredPatients(currentPatients.filter((p) => p.id !== id));

    // Also delete associated appointments
    const currentApts = getStoredAppointments();
    saveStoredAppointments(currentApts.filter((a) => a.patientId !== id));

    return true;
  },

  // Appointments CRUD
  async getAppointments(): Promise<Appointment[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .order('date', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          return data.map((item) => ({
            id: item.id,
            patientId: item.patient_id,
            patientName: item.patient_name,
            species: item.species,
            ownerName: item.owner_name,
            ownerPhone: item.owner_phone,
            date: item.date,
            timeSlot: item.time_slot,
            service: item.service,
            veterinarian: item.veterinarian,
            status: item.status,
            notes: item.notes,
            dentalGrade: item.dental_grade,
            treatmentCost: Number(item.treatment_cost || 0),
            createdAt: item.created_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch appointments failed:', err);
      }
    }
    return getStoredAppointments();
  },

  async addAppointment(appointment: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> {
    const newId = `apt-${Date.now()}`;
    const createdAt = new Date().toISOString();
    const newApt: Appointment = {
      ...appointment,
      id: newId,
      createdAt,
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('appointments').insert({
          id: newId,
          patient_id: newApt.patientId,
          patient_name: newApt.patientName,
          species: newApt.species,
          owner_name: newApt.ownerName,
          owner_phone: newApt.ownerPhone,
          date: newApt.date,
          time_slot: newApt.timeSlot,
          service: newApt.service,
          veterinarian: newApt.veterinarian,
          status: newApt.status,
          notes: newApt.notes || null,
          dental_grade: newApt.dentalGrade || null,
          treatment_cost: newApt.treatmentCost || 0,
          created_at: createdAt,
        });
        if (error) console.error('Supabase appointment insert error:', error);
      } catch (err) {
        console.warn('Supabase appointment insert failed:', err);
      }
    }

    const current = getStoredAppointments();
    const updated = [...current, newApt];
    saveStoredAppointments(updated);
    return newApt;
  },

  async updateAppointment(appointment: Appointment): Promise<Appointment> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('appointments')
          .update({
            patient_id: appointment.patientId,
            patient_name: appointment.patientName,
            species: appointment.species,
            owner_name: appointment.ownerName,
            owner_phone: appointment.ownerPhone,
            date: appointment.date,
            time_slot: appointment.timeSlot,
            service: appointment.service,
            veterinarian: appointment.veterinarian,
            status: appointment.status,
            notes: appointment.notes || null,
            dental_grade: appointment.dentalGrade || null,
            treatment_cost: appointment.treatmentCost || 0,
          })
          .eq('id', appointment.id);
        if (error) console.error('Supabase appointment update error:', error);
      } catch (err) {
        console.warn('Supabase appointment update failed:', err);
      }
    }

    const current = getStoredAppointments();
    const updated = current.map((a) => (a.id === appointment.id ? appointment : a));
    saveStoredAppointments(updated);
    return appointment;
  },

  async deleteAppointment(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('appointments').delete().eq('id', id);
        if (error) console.error('Supabase appointment delete error:', error);
      } catch (err) {
        console.warn('Supabase appointment delete failed:', err);
      }
    }

    const current = getStoredAppointments();
    saveStoredAppointments(current.filter((a) => a.id !== id));
    return true;
  },

  // Reset to initial demo data
  resetDemoData(): void {
    localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(INITIAL_PATIENTS));
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(INITIAL_APPOINTMENTS));
  }
};
