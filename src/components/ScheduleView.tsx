import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Phone, 
  Stethoscope, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Sparkles,
  Coffee
} from 'lucide-react';
import { Appointment, Patient, Species } from '../types';
import { MORNING_SLOTS, AFTERNOON_SLOTS } from '../data/mockData';

interface ScheduleViewProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  appointments: Appointment[];
  patients: Patient[];
  onBookSlot: (slot: string, date: string) => void;
  onEditAppointment: (apt: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
  onStatusChange: (apt: Appointment, newStatus: Appointment['status']) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  selectedDate,
  onSelectDate,
  appointments,
  patients,
  onBookSlot,
  onEditAppointment,
  onDeleteAppointment,
  onStatusChange,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'free' | 'occupied'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Date navigation helpers
  const changeDateByDays = (days: number) => {
    const current = new Date(selectedDate + 'T00:00:00');
    current.setDate(current.getDate() + days);
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    const d = String(current.getDate()).padStart(2, '0');
    onSelectDate(`${y}-${m}-${d}`);
  };

  const setToday = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    onSelectDate(`${y}-${m}-${d}`);
  };

  // Appointments for the selected day
  const dayAppointments = appointments.filter((apt) => apt.date === selectedDate);

  // Map slots to occupied appointments
  const getAppointmentForSlot = (slot: string) => {
    return dayAppointments.find((apt) => apt.timeSlot === slot);
  };

  const morningOccupiedCount = MORNING_SLOTS.filter((s) => getAppointmentForSlot(s)).length;
  const afternoonOccupiedCount = AFTERNOON_SLOTS.filter((s) => getAppointmentForSlot(s)).length;
  const totalOccupied = morningOccupiedCount + afternoonOccupiedCount;
  const totalSlots = MORNING_SLOTS.length + AFTERNOON_SLOTS.length;
  const totalFree = totalSlots - totalOccupied;

  // Format date for readable title
  const dateObj = new Date(selectedDate + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'pendiente':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">Pendiente</span>;
      case 'confirmada':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">Confirmada</span>;
      case 'en_consulta':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-200 animate-pulse">En Consulta</span>;
      case 'completada':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">Completada</span>;
      case 'cancelada':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 border border-rose-200">Cancelada</span>;
      default:
        return null;
    }
  };

  const getSpeciesBadge = (species: Species) => {
    const colors: Record<Species, string> = {
      Perro: 'bg-blue-50 text-blue-700 border-blue-200',
      Gato: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Conejo: 'bg-amber-50 text-amber-700 border-amber-200',
      Hurón: 'bg-purple-50 text-purple-700 border-purple-200',
      Otro: 'bg-slate-50 text-slate-700 border-slate-200',
    };
    return (
      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${colors[species] || 'bg-slate-100 text-slate-700'}`}>
        {species}
      </span>
    );
  };

  const renderSlotCard = (slot: string, shift: 'morning' | 'afternoon') => {
    const appointment = getAppointmentForSlot(slot);
    const isFree = !appointment;

    // Filter filtering
    if (filterMode === 'free' && !isFree) return null;
    if (filterMode === 'occupied' && isFree) return null;

    if (searchQuery && appointment) {
      const match = 
        appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.veterinarian.toLowerCase().includes(searchQuery.toLowerCase());
      if (!match) return null;
    }

    return (
      <div
        key={slot}
        id={`slot-${slot.replace(':', '-')}`}
        className={`rounded-xl transition-all duration-200 border p-4 ${
          isFree
            ? 'bg-white border-dashed border-emerald-300 hover:border-emerald-500 hover:shadow-sm hover:bg-emerald-50/30'
            : appointment.status === 'en_consulta'
            ? 'bg-purple-50/60 border-purple-300 shadow-xs'
            : appointment.status === 'completada'
            ? 'bg-slate-50/80 border-slate-200 text-slate-600'
            : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Time and Slot Badge */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-sm ${
              isFree 
                ? 'bg-emerald-100 text-emerald-800' 
                : appointment.status === 'en_consulta'
                ? 'bg-purple-200 text-purple-900'
                : 'bg-slate-100 text-slate-800'
            }`}>
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>{slot}</span>
            </div>

            {isFree ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Horario Libre Disponible
              </span>
            ) : (
              <div className="flex items-center gap-2">
                {getStatusBadge(appointment.status)}
                {getSpeciesBadge(appointment.species)}
              </div>
            )}
          </div>

          {/* Action button if free */}
          {isFree ? (
            <button
              onClick={() => onBookSlot(slot, selectedDate)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-300 hover:border-emerald-600 rounded-lg transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Agendar en {slot}</span>
            </button>
          ) : (
            /* Action buttons if occupied (Edit and Delete) */
            <div className="flex items-center gap-2">
              <select
                value={appointment.status}
                onChange={(e) => onStatusChange(appointment, e.target.value as Appointment['status'])}
                className="text-xs font-medium bg-slate-50 border border-slate-300 rounded-md px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="en_consulta">En Consulta</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>

              <button
                onClick={() => onEditAppointment(appointment)}
                title="Modificar turno"
                className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition cursor-pointer border border-slate-200"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  if (confirm(`¿Estás seguro de cancelar y eliminar el turno de ${appointment.patientName} a las ${slot}?`)) {
                    onDeleteAppointment(appointment.id);
                  }
                }}
                title="Eliminar turno"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer border border-slate-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Details if occupied */}
        {!isFree && appointment && (
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-600">
            <div>
              <span className="font-medium text-slate-400 block text-[10px] uppercase">Paciente</span>
              <span className="font-bold text-slate-900 text-sm">{appointment.patientName}</span>
            </div>

            <div>
              <span className="font-medium text-slate-400 block text-[10px] uppercase">Procedimiento Dental / Médico</span>
              <span className="font-semibold text-emerald-800 flex items-center gap-1">
                <Stethoscope className="w-3 h-3 text-emerald-600" />
                {appointment.service}
              </span>
            </div>

            <div>
              <span className="font-medium text-slate-400 block text-[10px] uppercase">Tutor / Teléfono</span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <User className="w-3 h-3 text-slate-400" />
                {appointment.ownerName}
                <span className="text-slate-400">({appointment.ownerPhone})</span>
              </span>
            </div>

            {appointment.veterinarian && (
              <div className="sm:col-span-2">
                <span className="font-medium text-slate-400 block text-[10px] uppercase">Profesional a cargo</span>
                <span className="text-slate-800">{appointment.veterinarian}</span>
              </div>
            )}

            {appointment.treatmentCost && appointment.treatmentCost > 0 && (
              <div className="text-right sm:col-span-1">
                <span className="font-medium text-slate-400 block text-[10px] uppercase">Arancel Estimado</span>
                <span className="font-bold text-emerald-700 text-sm">${appointment.treatmentCost}</span>
              </div>
            )}

            {appointment.notes && (
              <div className="sm:col-span-3 bg-slate-50 p-2 rounded text-slate-600 italic border border-slate-100">
                Nota: "{appointment.notes}"
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Date Header and Summary Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Day Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeDateByDays(-1)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition cursor-pointer"
              title="Día anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => onSelectDate(e.target.value)}
                  className="bg-slate-50 border border-slate-300 font-semibold text-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                />
              </div>
              <button
                onClick={setToday}
                className="px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition cursor-pointer"
              >
                Hoy
              </button>
            </div>

            <button
              onClick={() => changeDateByDays(1)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition cursor-pointer"
              title="Día siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="hidden sm:block ml-2 pl-4 border-l border-slate-200">
              <h2 className="text-base font-bold capitalize text-slate-900">{formattedDate}</h2>
              <p className="text-xs text-slate-500">Horario de clínica: 08:00 a 13:00 y 14:00 a 18:00</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-slate-500 block text-[10px]">Libres</span>
                <span className="font-extrabold text-emerald-800 text-sm">{totalFree} disponibles</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <Clock className="w-4 h-4 text-slate-600" />
              <div>
                <span className="text-slate-500 block text-[10px]">Ocupados</span>
                <span className="font-extrabold text-slate-800 text-sm">{totalOccupied} turnos</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs">
              <Coffee className="w-4 h-4 text-amber-600" />
              <div>
                <span className="text-slate-500 block text-[10px]">Receso</span>
                <span className="font-bold text-amber-800 text-xs">13:00 a 14:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-medium w-full sm:w-auto">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                filterMode === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos los Horarios ({totalSlots})
            </button>
            <button
              onClick={() => setFilterMode('free')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                filterMode === 'free' ? 'bg-emerald-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Solo Libres ({totalFree})
            </button>
            <button
              onClick={() => setFilterMode('occupied')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                filterMode === 'occupied' ? 'bg-slate-800 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Solo Ocupados ({totalOccupied})
            </button>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar por mascota, tutor o doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* SHIFT 1: TURNO MAÑANA (08:00 A 13:00) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 to-teal-700 text-white px-4 py-2.5 rounded-xl shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse" />
            <span className="font-bold text-sm tracking-wide">🌅 Turno Mañana: 08:00 a 13:00</span>
          </div>
          <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-medium">
            {MORNING_SLOTS.length - morningOccupiedCount} horarios libres de {MORNING_SLOTS.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MORNING_SLOTS.map((slot) => renderSlotCard(slot, 'morning'))}
        </div>
      </div>

      {/* MIDDAY BREAK: RECESO (13:00 A 14:00) */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 text-center text-amber-900 flex flex-col sm:flex-row items-center justify-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-200/70 flex items-center justify-center text-amber-800 shrink-0">
          <Coffee className="w-5 h-5" />
        </div>
        <div className="text-left">
          <h4 className="font-bold text-sm text-amber-950">Receso Clínico, Almuerzo & Desinfección Instrumental</h4>
          <p className="text-xs text-amber-800">
            Horario cerrado de <strong>13:00 a 14:00</strong>. No se agendan turnos en esta ventana para garantizar la esterilización del box odontológico.
          </p>
        </div>
      </div>

      {/* SHIFT 2: TURNO TARDE (14:00 A 18:00) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-gradient-to-r from-teal-800 to-cyan-800 text-white px-4 py-2.5 rounded-xl shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-300 animate-pulse" />
            <span className="font-bold text-sm tracking-wide">🌇 Turno Tarde: 14:00 a 18:00</span>
          </div>
          <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-medium">
            {AFTERNOON_SLOTS.length - afternoonOccupiedCount} horarios libres de {AFTERNOON_SLOTS.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AFTERNOON_SLOTS.map((slot) => renderSlotCard(slot, 'afternoon'))}
        </div>
      </div>
    </div>
  );
};
