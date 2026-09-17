import React, { useState } from 'react';
import { 
  Stethoscope, 
  Clock, 
  Calendar, 
  User, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  FileText, 
  Edit2, 
  Trash2, 
  DollarSign, 
  CheckCircle2, 
  Activity, 
  Smile,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { Appointment, Patient, Doctor } from '../types';
import { DOCTORS } from '../data/mockData';

interface DentistDashboardProps {
  appointments: Appointment[];
  patients: Patient[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onStatusChange: (apt: Appointment, newStatus: Appointment['status']) => void;
  onUpdateAppointment: (apt: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
  onEditAppointment: (apt: Appointment) => void;
  onSelectPatient: (patientId: string) => void;
}

export const DentistDashboard: React.FC<DentistDashboardProps> = ({
  appointments,
  patients,
  selectedDate,
  onSelectDate,
  onStatusChange,
  onUpdateAppointment,
  onDeleteAppointment,
  onEditAppointment,
  onSelectPatient,
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [editingAptId, setEditingAptId] = useState<string | null>(null);
  const [dentalGrade, setDentalGrade] = useState<Appointment['dentalGrade']>('Grado 2 (Sarro moderado)');
  const [clinicalNotes, setClinicalNotes] = useState<string>('');
  const [treatmentCost, setTreatmentCost] = useState<number>(0);

  // Appointments for the selected day
  const dayAppointments = appointments.filter((apt) => apt.date === selectedDate);

  // Filter by doctor if selected
  const filteredAppointments = selectedDoctor === 'all'
    ? dayAppointments
    : dayAppointments.filter((apt) => apt.veterinarian === selectedDoctor);

  // Sorting: time ascending
  filteredAppointments.sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

  // Metrics
  const totalToday = dayAppointments.length;
  const inConsultation = dayAppointments.filter((a) => a.status === 'en_consulta').length;
  const completed = dayAppointments.filter((a) => a.status === 'completada').length;
  const pending = dayAppointments.filter((a) => a.status === 'pendiente' || a.status === 'confirmada').length;
  const totalIncome = dayAppointments
    .filter((a) => a.status === 'completada' || a.status === 'en_consulta')
    .reduce((sum, a) => sum + (a.treatmentCost || 0), 0);

  const startEditingClinicalRecord = (apt: Appointment) => {
    setEditingAptId(apt.id);
    setDentalGrade(apt.dentalGrade || 'Grado 1 (Gingivitis leve)');
    setClinicalNotes(apt.notes || '');
    setTreatmentCost(apt.treatmentCost || 0);
  };

  const saveClinicalRecord = (apt: Appointment) => {
    onUpdateAppointment({
      ...apt,
      dentalGrade,
      notes: clinicalNotes,
      treatmentCost: Number(treatmentCost),
    });
    setEditingAptId(null);
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Top Header & Stats */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 rounded-2xl p-6 text-white shadow-md border border-teal-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                Panel Odontológico & Quirúrgico
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  Control Clínico
                </span>
              </h1>
              <p className="text-xs text-slate-300">
                Gestión diaria de intervenciones, diagnósticos bucodentales y seguimiento de pacientes
              </p>
            </div>
          </div>

          {/* Date & Doctor Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1.5 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onSelectDate(e.target.value)}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
              />
            </div>

            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="bg-slate-800/80 border border-slate-700 text-xs font-semibold text-white rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="all">Todos los Odontólogos/Vets</option>
              {DOCTORS.map((doc) => (
                <option key={doc.id} value={doc.name}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <span className="text-slate-400 text-[11px] font-medium block">Total Citas Hoy</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">{totalToday}</span>
              <span className="text-xs text-slate-400">pacientes</span>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
            <span className="text-purple-300 text-[11px] font-medium block">En Consulta Ahora</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-purple-200">{inConsultation}</span>
              <span className="text-xs text-purple-300">en atención</span>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
            <span className="text-amber-300 text-[11px] font-medium block">Por Atender</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-200">{pending}</span>
              <span className="text-xs text-amber-300">en espera</span>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
            <span className="text-emerald-300 text-[11px] font-medium block">Tratamientos Realizados</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-200">{completed}</span>
              <span className="text-xs text-emerald-300">(${totalIncome})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Appointments Queue for Dentists */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Cola de Atención Clínica de Hoy</h3>
            <p className="text-xs text-slate-500">
              Cambia el estado con un clic, añade notas de profilaxis/diagnóstico dental o reprograma turnos
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
            {filteredAppointments.length} turnos agendados
          </span>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
            <Stethoscope className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-600 font-semibold text-sm">No hay citas para esta fecha o especialista seleccionado</p>
            <p className="text-xs text-slate-400 mt-1">
              Puedes agendar un turno nuevo desde la pestaña "Agenda & Turnos"
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((apt) => {
              const patient = patients.find((p) => p.id === apt.patientId);
              const isEditing = editingAptId === apt.id;

              return (
                <div
                  key={apt.id}
                  id={`dentist-apt-${apt.id}`}
                  className={`rounded-xl border p-4 transition-all ${
                    apt.status === 'en_consulta'
                      ? 'bg-purple-50/50 border-purple-300 shadow-sm ring-1 ring-purple-300'
                      : apt.status === 'completada'
                      ? 'bg-emerald-50/30 border-emerald-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    {/* Time slot and Patient info */}
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="bg-slate-900 text-white font-mono font-black text-sm px-3 py-2 rounded-xl text-center">
                        <span className="block text-[10px] text-slate-400 font-normal">TURNO</span>
                        {apt.timeSlot}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-base text-slate-900">{apt.patientName}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-emerald-100 text-emerald-800">
                            {apt.species}
                          </span>
                          {patient?.breed && (
                            <span className="text-xs text-slate-500 font-medium">({patient.breed})</span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                          <span className="font-semibold text-emerald-700 flex items-center gap-1">
                            <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                            {apt.service}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            {apt.ownerName} ({apt.ownerPhone})
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-600 font-medium">{apt.veterinarian}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Status Control Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {apt.status !== 'en_consulta' && apt.status !== 'completada' && (
                        <button
                          onClick={() => onStatusChange(apt, 'en_consulta')}
                          className="px-3 py-1.5 text-xs font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg transition cursor-pointer flex items-center gap-1"
                        >
                          <Activity className="w-3.5 h-3.5" />
                          <span>Pasar a Consulta</span>
                        </button>
                      )}

                      {apt.status === 'en_consulta' && (
                        <button
                          onClick={() => onStatusChange(apt, 'completada')}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Finalizar Consulta</span>
                        </button>
                      )}

                      {apt.status === 'completada' && (
                        <span className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-lg flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Atendido</span>
                        </span>
                      )}

                      <button
                        onClick={() => startEditingClinicalRecord(apt)}
                        className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer flex items-center gap-1"
                        title="Registrar diagnóstico dental"
                      >
                        <FileText className="w-3.5 h-3.5 text-teal-600" />
                        <span>Diagnóstico Dental</span>
                      </button>

                      <button
                        onClick={() => onEditAppointment(apt)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer border border-slate-200"
                        title="Modificar turno"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar la cita de ${apt.patientName}?`)) {
                            onDeleteAppointment(apt.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer border border-slate-200"
                        title="Eliminar cita"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Dental Grade Badge & Notes */}
                  {(apt.dentalGrade || apt.notes) && !isEditing && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        {apt.dentalGrade && (
                          <span className="px-2.5 py-0.5 rounded-full font-bold bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1 text-[11px]">
                            <Smile className="w-3 h-3 text-teal-600" />
                            {apt.dentalGrade}
                          </span>
                        )}
                        {apt.notes && (
                          <span className="text-slate-600 italic">
                            "{apt.notes}"
                          </span>
                        )}
                      </div>

                      {apt.treatmentCost && apt.treatmentCost > 0 && (
                        <div className="font-bold text-emerald-700 text-xs">
                          Costo: ${apt.treatmentCost}
                        </div>
                      )}
                    </div>
                  )}

                  {/* INLINE DENTAL & CLINICAL RECORD EDITOR */}
                  {isEditing && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-teal-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                          <Stethoscope className="w-4 h-4 text-teal-600" />
                          Actualizar Diagnóstico Odontológico
                        </h5>
                        <button
                          onClick={() => setEditingAptId(null)}
                          className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Evaluación Periodontal / Grado de Sarro
                          </label>
                          <select
                            value={dentalGrade}
                            onChange={(e) => setDentalGrade(e.target.value as Appointment['dentalGrade'])}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          >
                            <option value="Grado 0 (Sano)">Grado 0 (Sano - Sin sarro)</option>
                            <option value="Grado 1 (Gingivitis leve)">Grado 1 (Gingivitis marginal leve)</option>
                            <option value="Grado 2 (Sarro moderado)">Grado 2 (Sarro moderado supragingival)</option>
                            <option value="Grado 3 (Periodontitis severa)">Grado 3 (Periodontitis / Sarro subgingival)</option>
                            <option value="Grado 4 (Avanzado)">Grado 4 (Avanzado con movilidad dental)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Arancel / Precio del Tratamiento ($)
                          </label>
                          <input
                            type="number"
                            value={treatmentCost}
                            onChange={(e) => setTreatmentCost(Number(e.target.value))}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            placeholder="Ej. 85"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Ficha del Paciente
                          </label>
                          {patient && (
                            <button
                              type="button"
                              onClick={() => onSelectPatient(patient.id)}
                              className="w-full py-2 px-3 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg hover:bg-emerald-100 flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <span>Ver Historial de {patient.name}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Notas Clínicas / Procedimiento realizado
                        </label>
                        <textarea
                          rows={2}
                          value={clinicalNotes}
                          onChange={(e) => setClinicalNotes(e.target.value)}
                          placeholder="Ej. Profilaxis ultrasónica completada, pulido con pasta de flúor, sin piezas móviles. Se receta enjuague de clorhexidina 0.12%."
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingAptId(null)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg transition cursor-pointer"
                        >
                          Cerrar
                        </button>
                        <button
                          type="button"
                          onClick={() => saveClinicalRecord(apt)}
                          className="px-4 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition cursor-pointer"
                        >
                          Guardar Diagnóstico
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
