import React, { useState } from 'react';
import { 
  X, 
  PawPrint, 
  User, 
  Phone, 
  Mail, 
  Stethoscope, 
  AlertCircle, 
  Check, 
  Image as ImageIcon 
} from 'lucide-react';
import { Patient, Species } from '../types';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Patient, 'id' | 'createdAt'> | Patient) => void;
  existingPatient?: Patient | null;
}

export const PatientModal: React.FC<PatientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingPatient,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(existingPatient?.name || '');
  const [species, setSpecies] = useState<Species>(existingPatient?.species || 'Perro');
  const [breed, setBreed] = useState(existingPatient?.breed || '');
  const [ageYears, setAgeYears] = useState<number>(existingPatient?.ageYears ?? 2);
  const [ageMonths, setAgeMonths] = useState<number>(existingPatient?.ageMonths ?? 0);
  const [weightKg, setWeightKg] = useState<number>(existingPatient?.weightKg ?? 10);
  const [gender, setGender] = useState<'Macho' | 'Hembra'>(existingPatient?.gender || 'Macho');
  const [ownerName, setOwnerName] = useState(existingPatient?.ownerName || '');
  const [ownerPhone, setOwnerPhone] = useState(existingPatient?.ownerPhone || '');
  const [ownerEmail, setOwnerEmail] = useState(existingPatient?.ownerEmail || '');
  const [chipNumber, setChipNumber] = useState(existingPatient?.chipNumber || '');
  const [medicalNotes, setMedicalNotes] = useState(existingPatient?.medicalNotes || '');
  const [dentalNotes, setDentalNotes] = useState(
    existingPatient?.dentalNotes || 'Revisión inicial recomendada: profilaxis y control de placa bacteriana.'
  );
  const [allergies, setAllergies] = useState(existingPatient?.allergies || 'Ninguna conocida');
  const [avatarUrl, setAvatarUrl] = useState(existingPatient?.avatarUrl || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !ownerName.trim() || !ownerPhone.trim()) {
      alert('Por favor completa el nombre de la mascota, el tutor y el teléfono.');
      return;
    }

    if (existingPatient) {
      onSave({
        ...existingPatient,
        name: name.trim(),
        species,
        breed: breed.trim() || 'Mestizo',
        ageYears: Number(ageYears),
        ageMonths: Number(ageMonths),
        weightKg: Number(weightKg),
        gender,
        ownerName: ownerName.trim(),
        ownerPhone: ownerPhone.trim(),
        ownerEmail: ownerEmail.trim(),
        chipNumber: chipNumber.trim() || undefined,
        medicalNotes: medicalNotes.trim() || undefined,
        dentalNotes: dentalNotes.trim() || undefined,
        allergies: allergies.trim() || undefined,
        avatarUrl: avatarUrl.trim() || undefined,
      });
    } else {
      onSave({
        name: name.trim(),
        species,
        breed: breed.trim() || 'Mestizo',
        ageYears: Number(ageYears),
        ageMonths: Number(ageMonths),
        weightKg: Number(weightKg),
        gender,
        ownerName: ownerName.trim(),
        ownerPhone: ownerPhone.trim(),
        ownerEmail: ownerEmail.trim(),
        chipNumber: chipNumber.trim() || undefined,
        medicalNotes: medicalNotes.trim() || undefined,
        dentalNotes: dentalNotes.trim() || undefined,
        allergies: allergies.trim() || undefined,
        avatarUrl: avatarUrl.trim() || undefined,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <PawPrint className="w-5 h-5 text-emerald-600" />
              {existingPatient ? 'Modificar Ficha de Paciente' : 'Registrar Nuevo Paciente (Mascota)'}
            </h3>
            <p className="text-xs text-slate-500">
              Datos clínicos, odontológicos y de contacto del tutor
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Pet Basic Information */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
              Datos de la Mascota
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Toby, Luna..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Especie *</label>
                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value as Species)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                >
                  <option value="Perro">🐶 Perro</option>
                  <option value="Gato">🐱 Gato</option>
                  <option value="Conejo">🐰 Conejo</option>
                  <option value="Hurón">🦡 Hurón</option>
                  <option value="Otro">🐾 Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Raza</label>
                <input
                  type="text"
                  placeholder="Ej. Golden, Mestizo..."
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Edad (Años)</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={ageYears}
                  onChange={(e) => setAgeYears(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Edad (Meses)</label>
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sexo</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'Macho' | 'Hembra')}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                >
                  <option value="Macho">Macho</option>
                  <option value="Hembra">Hembra</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Número de Microchip / Identificador
              </label>
              <input
                type="text"
                placeholder="Ej. ES-9840291048"
                value={chipNumber}
                onChange={(e) => setChipNumber(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Owner / Tutor Contact Info */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-600" />
              Datos del Tutor Responsable
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Mariana Duarte"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. +34 612 345 678"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="tutor@correo.com"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Clinical & Dental Records */}
          <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200 space-y-3">
            <h4 className="text-xs font-bold uppercase text-teal-900 tracking-wider flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-teal-700" />
              Antecedentes Dentales & Médicos
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ficha Odontológica / Estado Dental Inicial
              </label>
              <textarea
                rows={2}
                placeholder="Ej. Presencia de sarro en molares superiores, halitosis, encías retraídas..."
                value={dentalNotes}
                onChange={(e) => setDentalNotes(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notas Médicas Generales & Vacunas
                </label>
                <textarea
                  rows={2}
                  placeholder="Vacunas, desparasitación o cirugías previas..."
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alergias o Condiciones Especiales
                </label>
                <textarea
                  rows={2}
                  placeholder="Alergias a antibióticos, anestésicos..."
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
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
              <span>{existingPatient ? 'Guardar Cambios' : 'Registrar Paciente'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
