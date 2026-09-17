import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ScheduleView } from './components/ScheduleView';
import { DentistDashboard } from './components/DentistDashboard';
import { PatientsView } from './components/PatientsView';
import { SupabaseRenderModal } from './components/SupabaseRenderModal';
import { AppointmentModal } from './components/AppointmentModal';
import { PatientModal } from './components/PatientModal';
import { db } from './lib/database';
import { Patient, Appointment } from './types';
import { getTodayDateString } from './data/mockData';
import { 
  Calendar, 
  Stethoscope, 
  PawPrint, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  Plus
} from 'lucide-react';

export default function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [currentTab, setCurrentTab] = useState<'schedule' | 'dentist' | 'patients' | 'database'>('schedule');
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [preselectedSlot, setPreselectedSlot] = useState<string | undefined>(undefined);
  const [preselectedPatient, setPreselectedPatient] = useState<Patient | null>(null);

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Load initial data
  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedPatients, fetchedAppointments] = await Promise.all([
        db.getPatients(),
        db.getAppointments(),
      ]);
      setPatients(fetchedPatients);
      setAppointments(fetchedAppointments);
    } catch (err) {
      console.error('Error loading database data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Today's appointments count for badges
  const todayDate = getTodayDateString();
  const todayAptsCount = appointments.filter((a) => a.date === todayDate).length;

  // Appointment actions
  const handleOpenNewAppointment = (slot?: string, date?: string, patient?: Patient) => {
    setEditingAppointment(null);
    setPreselectedSlot(slot);
    if (date) setSelectedDate(date);
    setPreselectedPatient(patient || null);
    setIsAppointmentModalOpen(true);
  };

  const handleEditAppointment = (apt: Appointment) => {
    setEditingAppointment(apt);
    setPreselectedSlot(apt.timeSlot);
    setSelectedDate(apt.date);
    setPreselectedPatient(null);
    setIsAppointmentModalOpen(true);
  };

  const handleSaveAppointment = async (data: Omit<Appointment, 'id' | 'createdAt'> | Appointment) => {
    if ('id' in data) {
      const updated = await db.updateAppointment(data);
      setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      showToast(`Turno de las ${updated.timeSlot} para ${updated.patientName} modificado correctamente.`);
    } else {
      const created = await db.addAppointment(data);
      setAppointments((prev) => [...prev, created]);
      showToast(`¡Turno reservado exitosamente para ${created.patientName} a las ${created.timeSlot}!`);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    await db.deleteAppointment(id);
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    showToast('Turno cancelado y eliminado correctamente.', 'info');
  };

  const handleStatusChange = async (apt: Appointment, newStatus: Appointment['status']) => {
    const updated = { ...apt, status: newStatus };
    await db.updateAppointment(updated);
    setAppointments((prev) => prev.map((a) => (a.id === apt.id ? updated : a)));
    showToast(`Estado de ${apt.patientName} actualizado a "${newStatus.replace('_', ' ')}".`);
  };

  // Patient actions
  const handleOpenNewPatient = () => {
    setEditingPatient(null);
    setIsPatientModalOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setIsPatientModalOpen(true);
  };

  const handleSavePatient = async (data: Omit<Patient, 'id' | 'createdAt'> | Patient) => {
    if ('id' in data) {
      const updated = await db.updatePatient(data);
      setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      // Also update patientName in appointments if changed
      setAppointments((prev) =>
        prev.map((a) => (a.patientId === updated.id ? { ...a, patientName: updated.name } : a))
      );
      showToast(`Ficha de ${updated.name} actualizada.`);
    } else {
      const created = await db.addPatient(data);
      setPatients((prev) => [created, ...prev]);
      showToast(`Paciente ${created.name} registrado con éxito.`);
    }
  };

  const handleDeletePatient = async (id: string) => {
    await db.deletePatient(id);
    setPatients((prev) => prev.filter((p) => p.id !== id));
    setAppointments((prev) => prev.filter((a) => a.patientId !== id));
    showToast('Paciente y sus citas eliminados correctamente.', 'info');
  };

  const handleResetDemoData = async () => {
    db.resetDemoData();
    await loadData();
    showToast('Datos de demostración restablecidos.');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl bg-slate-900 text-white text-xs font-semibold border border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Header / Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenNewAppointment={() => handleOpenNewAppointment()}
        onOpenNewPatient={handleOpenNewPatient}
        patientsCount={patients.length}
        todayAptsCount={todayAptsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">Cargando datos clínicos de la clínica...</p>
          </div>
        ) : (
          <>
            {currentTab === 'schedule' && (
              <ScheduleView
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                appointments={appointments}
                patients={patients}
                onBookSlot={(slot, date) => handleOpenNewAppointment(slot, date)}
                onEditAppointment={handleEditAppointment}
                onDeleteAppointment={handleDeleteAppointment}
                onStatusChange={handleStatusChange}
              />
            )}

            {currentTab === 'dentist' && (
              <DentistDashboard
                appointments={appointments}
                patients={patients}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                onStatusChange={handleStatusChange}
                onUpdateAppointment={async (apt) => {
                  const updated = await db.updateAppointment(apt);
                  setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
                  showToast('Diagnóstico odontológico y arancel actualizados.');
                }}
                onDeleteAppointment={handleDeleteAppointment}
                onEditAppointment={handleEditAppointment}
                onSelectPatient={(patientId) => {
                  const p = patients.find((pat) => pat.id === patientId);
                  if (p) {
                    handleEditPatient(p);
                  }
                }}
              />
            )}

            {currentTab === 'patients' && (
              <PatientsView
                patients={patients}
                appointments={appointments}
                onAddNewPatient={handleOpenNewPatient}
                onEditPatient={handleEditPatient}
                onDeletePatient={handleDeletePatient}
                onBookAppointmentForPatient={(p) => handleOpenNewAppointment(undefined, undefined, p)}
              />
            )}

            {currentTab === 'database' && (
              <SupabaseRenderModal onResetDemoData={handleResetDemoData} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium text-slate-600">
            VetCare Odontología & Salud Animal — Horarios de Atención: 08:00 a 13:00 y 14:00 a 18:00
          </p>
          <p className="text-slate-400">
            Compatible con PostgreSQL Supabase & Despliegue en Render
          </p>
        </div>
      </footer>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onSave={handleSaveAppointment}
        existingAppointment={editingAppointment}
        patients={patients}
        allAppointments={appointments}
        preselectedDate={selectedDate}
        preselectedSlot={preselectedSlot}
        preselectedPatient={preselectedPatient}
        onOpenNewPatientModal={handleOpenNewPatient}
      />

      {/* Patient Modal */}
      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSave={handleSavePatient}
        existingPatient={editingPatient}
      />
    </div>
  );
}
