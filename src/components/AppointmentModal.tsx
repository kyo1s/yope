import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Stethoscope, 
  User, 
  Phone, 
  FileText, 
  DollarSign, 
  AlertCircle, 
  Plus,
  Check
} from 'lucide-react';
import { Appointment, Patient, ServiceType, Species } from '../types';
import { MORNING_SLOTS, AFTERNOON_SLOTS, SERVICE_OPTIONS, DOCTORS } from '../data/mockData';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Appointment, 'id' | 'createdAt'> | Appointment) => void;
  existingAppointment?: Appointment | null;
  patients: Patient[];
  allAppointments: Appointment[];
  preselectedDate?: string;
  preselectedSlot?: string;
  preselectedPatient?: Patient | null;
  onOpenNewPatientModal: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingAppointment,
  patients,
  allAppointments,
  preselectedDate,
  preselectedSlot,
  preselectedPatient,
  onOpenNewPatientModal,
}) => {
  if (!isOpen) return null;

  const [date, setDate] = useState<string>(
    existingAppointment?.date || preselectedDate || new Date().toISOString().split('T')[0]
  );
  const [selectedSlot, setSelectedSlot] = useState<string>(
    existingAppointment?.timeSlot || preselectedSlot || '08:30'
  );
  const [patientId, setPatientId] = useState<string>(
    existingAppointment?.patientId || preselectedPatient?.id || (patients[0]?.id || '')
  );
  const [service, setService] = useState<ServiceType>(
    existingAppointment?.service || 'Limpieza Dental (Profilaxis)'
  );
  const [veterinarian, setVeterinarian] = useState<string>(
    existingAppointment?.veterinarian || DOCTORS[0].name
  );
  const [status, setStatus] = useState<Appointment['status']>(
    existingAppointment?.status || 'pendiente'
  );
  const [notes, setNotes] = useState<string>(existingAppointment?.notes || '');
  const [treatmentCost, setTreatmentCost] = useState<number>(
    existingAppointment?.treatmentCost || 85
  );

  // Update cost when service changes if new appointment
  const handleServiceChange = (newService: ServiceType) => {
    setService(newService);
    const found = SERVICE_OPTIONS.find((s) => s.label === newService);
    if (found && !existingAppointment) {
      setTreatmentCost(found.price);
    }
  };

  // Find selected patient details
  const currentPatient = patients.find((p) => p.id === patientId);

  // Check occupied slots for the selected date (excluding the current appointment if editing)
  const occupiedSlots = allAppointments
    .filter((a) => a.date === date && a.id !== existingAppointment?.id)
    .map((a) => a.timeSlot);

  // If currently selected slot is taken on this new date, auto-pick first free slot
  useEffect(() => {
    if (occupiedSlots.includes(selectedSlot)) {
      const freeMorning = MORNING_SLOTS.find((s) => !occupiedSlots.includes(s));
      const freeAfternoon = AFTERNOON_SLOTS.find((s) => !occupiedSlots.includes(s));
      if (freeMorning) setSelectedSlot(freeMorning);
      else if (freeAfternoon) setSelectedSlot(freeAfternoon);
    }
  }, [date]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPatient) {
      alert('Por favor selecciona un paciente o registra uno nuevo.');
      return;
    }

    if (occupiedSlots.includes(selectedSlot)) {
      alert(`El horario ${selectedSlot} ya está reservado para esa fecha.`);
      return;
    }

    if (existingAppointment) {
      onSave({
        ...existingAppointment,
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        species: currentPatient.species,
        ownerName: currentPatient.ownerName,
        ownerPhone: currentPatient.ownerPhone,
        date,
        timeSlot: selectedSlot,
        service,
        veterinarian,
        status,
        notes,
        treatmentCost: Number(treatmentCost),
      });
    } else {
      onSave({
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        species: currentPatient.species,
        ownerName: currentPatient.ownerName,
        ownerPhone: currentPatient.ownerPhone,
        date,
        timeSlot: selectedSlot,
        service,
        veterinarian,
        status,
        notes,
        dentalGrade: 'Grado 1 (Gingivitis leve)',
        treatmentCost: Number(treatmentCost),
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              {existingAppointment ? 'Modificar Turno Clínico' : 'Agendar Nuevo Turno de Odontología & Salud'}
            </h3>
            <p className="text-xs text-slate-500">
              Atención: 08:00 a 13:00 y 14:00 a 18:00 (Receso 13:00 a 14:00)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Patient Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase text-slate-700">
                Seleccionar Paciente (Mascota)
              </label>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenNewPatientModal();
                }}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Registrar Nueva Mascota</span>
              </button>
            </div>

            {patients.length === 0 ? (
              <div className="p-3 bg-amber-50 text-amber-900 text-xs rounded-xl border border-amber-200">
                No hay pacientes registrados aún. Por favor registra uno primero.
              </div>
            ) : (
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.species} - {p.breed}) • Tutor: {p.ownerName} ({p.ownerPhone})
                  </option>
                ))}
              </select>
            )}

            {currentPatient && (
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-950">
                <span>
                  <strong>{currentPatient.name}</strong> ({currentPatient.species}) • Tutor: {currentPatient.ownerName}
                </span>
                <span className="font-mono text-[11px] text-emerald-800 font-semibold">
                  Tel: {currentPatient.ownerPhone}
                </span>
              </div>
            )}
          </div>

          {/* Date Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Fecha del Turno
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Especialista / Odontólogo
              </label>
              <select
                value={veterinarian}
                onChange={(e) => setVeterinarian(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                {DOCTORS.map((doc) => (
                  <option key={doc.id} value={doc.name}>
                    {doc.name} ({doc.specialty})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time Slots Selector (Morning & Afternoon) */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
              Horario Disponible para {date}
            </label>

            {/* Morning Shift */}
            <div className="mb-3">
              <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide block mb-1.5">
                🌅 Turno Mañana (08:00 a 13:00)
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {MORNING_SLOTS.map((slot) => {
                  const isTaken = occupiedSlots.includes(slot);
                  const isSelected = selectedSlot === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isTaken}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-1 text-center rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                          : isTaken
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                          : 'bg-white hover:bg-emerald-50 text-slate-800 border-slate-200'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Afternoon Shift */}
            <div>
              <span className="text-[11px] font-bold text-teal-900 uppercase tracking-wide block mb-1.5">
                🌇 Turno Tarde (14:00 a 18:00)
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-4 gap-1.5">
                {AFTERNOON_SLOTS.map((slot) => {
                  const isTaken = occupiedSlots.includes(slot);
                  const isSelected = selectedSlot === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isTaken}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-1 text-center rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
                        isSelected
                          ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                          : isTaken
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                          : 'bg-white hover:bg-teal-50 text-slate-800 border-slate-200'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 italic">
              * El receso de 13:00 a 14:00 está reservado para esterilización de instrumental y almuerzo médico.
            </p>
          </div>

          {/* Procedure & Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Servicio / Procedimiento
              </label>
              <select
                value={service}
                onChange={(e) => handleServiceChange(e.target.value as ServiceType)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt.label} value={opt.label}>
                    {opt.label} — ${opt.price}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Precio / Arancel ($)
              </label>
              <input
                type="number"
                value={treatmentCost}
                onChange={(e) => setTreatmentCost(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Status (if editing or creating) */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Estado de la Cita
            </label>
            <div className="flex flex-wrap gap-2">
              {(['pendiente', 'confirmada', 'en_consulta', 'completada', 'cancelada'] as Appointment['status'][]).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer border ${
                      status === st
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Clinical Notes / Motivo */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Motivo de Consulta / Observaciones Odontológicas
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Mal aliento persistente, sarro en caninos superiores, tutor solicita presupuesto de limpieza dental..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{existingAppointment ? 'Guardar Cambios' : 'Confirmar Turno'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
