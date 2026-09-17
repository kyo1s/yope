import React, { useState } from 'react';
import { 
  PawPrint, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Phone, 
  Mail, 
  Stethoscope, 
  FileText, 
  AlertCircle, 
  Tag, 
  Filter,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Patient, Appointment, Species } from '../types';

interface PatientsViewProps {
  patients: Patient[];
  appointments: Appointment[];
  onAddNewPatient: () => void;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (id: string) => void;
  onBookAppointmentForPatient: (patient: Patient) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  appointments,
  onAddNewPatient,
  onEditPatient,
  onDeletePatient,
  onBookAppointmentForPatient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Filter patients
  const filteredPatients = patients.filter((p) => {
    const matchesSpecies = speciesFilter === 'all' || p.species === speciesFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(term) ||
      p.ownerName.toLowerCase().includes(term) ||
      p.breed.toLowerCase().includes(term) ||
      (p.chipNumber && p.chipNumber.toLowerCase().includes(term)) ||
      p.ownerPhone.toLowerCase().includes(term);

    return matchesSpecies && matchesSearch;
  });

  const getSpeciesEmoji = (species: Species) => {
    switch (species) {
      case 'Perro': return '🐶';
      case 'Gato': return '🐱';
      case 'Conejo': return '🐰';
      case 'Hurón': return '🦡';
      default: return '🐾';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <PawPrint className="w-6 h-6 text-emerald-600" />
              Registro de Pacientes & Fichas Médicas
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Control clínico, antecedentes dentales, tutores responsables y edición directa
            </p>
          </div>

          <button
            onClick={onAddNewPatient}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Nueva Mascota</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por mascota, tutor, chip o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-400"
            />
          </div>

          {/* Species filter chips */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {['all', 'Perro', 'Gato', 'Conejo', 'Hurón', 'Otro'].map((spec) => (
              <button
                key={spec}
                onClick={() => setSpeciesFilter(spec)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  speciesFilter === spec
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {spec === 'all' ? 'Todas las especies' : spec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patients Grid */}
      {filteredPatients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <PawPrint className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No se encontraron pacientes</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No hay mascotas registradas con los filtros seleccionados. Puedes añadir una nueva ficha médica con el botón superior.
          </p>
          <button
            onClick={onAddNewPatient}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-300 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Paciente Ahora</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => {
            const patientApts = appointments.filter((a) => a.patientId === patient.id);
            const nextApt = patientApts.find(
              (a) => a.status === 'confirmada' || a.status === 'pendiente' || a.status === 'en_consulta'
            );

            return (
              <div
                key={patient.id}
                id={`patient-card-${patient.id}`}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top card header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {patient.avatarUrl ? (
                          <img
                            src={patient.avatarUrl}
                            alt={patient.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl border border-emerald-200">
                            {getSpeciesEmoji(patient.species)}
                          </div>
                        )}
                        <span className="absolute -bottom-1 -right-1 text-xs">
                          {getSpeciesEmoji(patient.species)}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-slate-900">{patient.name}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                            {patient.gender}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {patient.breed} • {patient.ageYears}a {patient.ageMonths}m • {patient.weightKg} kg
                        </p>
                      </div>
                    </div>

                    {/* Edit and Delete Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditPatient(patient)}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer border border-slate-200"
                        title="Editar datos del paciente"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Estás seguro de eliminar a ${patient.name}? Se borrarán también sus turnos asociados.`)) {
                            onDeletePatient(patient.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer border border-slate-200"
                        title="Eliminar paciente"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Tutor / Owner Info */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-700 font-medium">
                      <span className="text-slate-400 text-[11px]">Tutor responsable:</span>
                      <span className="font-bold text-slate-900">{patient.ownerName}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400 text-[11px]">Teléfono:</span>
                      <a href={`tel:${patient.ownerPhone}`} className="text-emerald-700 font-semibold hover:underline flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        {patient.ownerPhone}
                      </a>
                    </div>
                    {patient.chipNumber && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400 text-[11px]">Microchip:</span>
                        <span className="font-mono text-[11px] text-slate-700">{patient.chipNumber}</span>
                      </div>
                    )}
                  </div>

                  {/* Dental Notes / Historial Odontológico */}
                  <div className="mt-3 space-y-2">
                    {patient.dentalNotes ? (
                      <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-2.5 text-xs text-teal-950">
                        <span className="font-bold text-teal-900 flex items-center gap-1 text-[11px] uppercase tracking-wider mb-1">
                          <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
                          Odontograma & Registro Dental:
                        </span>
                        <p className="text-slate-700 text-xs line-clamp-3 leading-relaxed">
                          {patient.dentalNotes}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-2 text-center text-xs text-slate-400">
                        Sin notas dentales previas
                      </div>
                    )}

                    {patient.allergies && (
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                        <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="font-bold">Alergia:</span> {patient.allergies}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom card actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-500">
                    {nextApt ? (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Próx: {nextApt.date} ({nextApt.timeSlot})
                      </span>
                    ) : (
                      <span className="text-slate-400">Sin citas próximas</span>
                    )}
                  </div>

                  <button
                    onClick={() => onBookAppointmentForPatient(patient)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-lg border border-emerald-200 hover:border-emerald-600 transition cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>+ Agendar Turno</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
