import { useState, useEffect } from 'react';
import { 
  Calendar, 
  PawPrint, 
  Stethoscope, 
  Database, 
  Clock, 
  PlusCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface NavbarProps {
  currentTab: 'schedule' | 'dentist' | 'patients' | 'database';
  onSelectTab: (tab: 'schedule' | 'dentist' | 'patients' | 'database') => void;
  onOpenNewAppointment: () => void;
  onOpenNewPatient: () => void;
  patientsCount: number;
  todayAptsCount: number;
}

export const Navbar = ({
  currentTab,
  onSelectTab,
  onOpenNewAppointment,
  onOpenNewPatient,
  patientsCount,
  todayAptsCount,
}: NavbarProps) => {
  const [timeStatus, setTimeStatus] = useState<{ status: 'morning' | 'recess' | 'afternoon' | 'closed'; text: string }>({
    status: 'morning',
    text: 'Cargando horario...',
  });

  useEffect(() => {
    const updateTimeStatus = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const timeVal = hours + minutes / 60;

      if (timeVal >= 8 && timeVal < 13) {
        setTimeStatus({
          status: 'morning',
          text: 'Turno Mañana (08:00 - 13:00)',
        });
      } else if (timeVal >= 13 && timeVal < 14) {
        setTimeStatus({
          status: 'recess',
          text: 'En Receso (13:00 - 14:00) • Reanuda 14:00',
        });
      } else if (timeVal >= 14 && timeVal < 18) {
        setTimeStatus({
          status: 'afternoon',
          text: 'Turno Tarde (14:00 - 18:00)',
        });
      } else {
        setTimeStatus({
          status: 'closed',
          text: 'Cerrado • Horario: 08:00-13:00 y 14:00-18:00',
        });
      }
    };

    updateTimeStatus();
    const interval = setInterval(updateTimeStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const isCloud = isSupabaseConfigured();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Top micro bar for operating hours & database status */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs font-medium flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline text-slate-400">Atención veterinaria:</span>
            <span className="text-white">08:00 - 13:00</span>
            <span className="text-slate-500">|</span>
            <span className="text-amber-300">Receso 13:00-14:00</span>
            <span className="text-slate-500">|</span>
            <span className="text-white">14:00 - 18:00</span>
          </span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] ${
            timeStatus.status === 'morning' || timeStatus.status === 'afternoon'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : timeStatus.status === 'recess'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'bg-slate-700 text-slate-300'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
              timeStatus.status === 'recess' ? 'bg-amber-400' : timeStatus.status === 'closed' ? 'bg-slate-400' : 'bg-emerald-400'
            }`} />
            {timeStatus.text}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('database')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs transition cursor-pointer ${
              isCloud 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900' 
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Database className="w-3 h-3 text-emerald-400" />
            <span>{isCloud ? 'Supabase Conectado' : 'Supabase (Modo Local Activo)'}</span>
            <span className="text-[10px] text-emerald-400 underline font-semibold">Configurar / SQL</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
              <PawPrint className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">VetCare</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold tracking-wide uppercase">
                  Odontología & Salud
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Clínica Médica & Odontológica para Mascotas</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onSelectTab('schedule')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                currentTab === 'schedule'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Agenda & Turnos</span>
            </button>

            <button
              onClick={() => onSelectTab('dentist')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                currentTab === 'dentist'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span>Panel Odontológico</span>
              {todayAptsCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-emerald-100 text-emerald-700 font-bold">
                  {todayAptsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('patients')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                currentTab === 'patients'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <PawPrint className="w-4 h-4 text-emerald-600" />
              <span>Pacientes ({patientsCount})</span>
            </button>

            <button
              onClick={() => onSelectTab('database')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                currentTab === 'database'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Database className="w-4 h-4 text-slate-600" />
              <span>Supabase & Render</span>
            </button>
          </nav>

          {/* Quick Actions Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNewPatient}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-4 h-4 text-slate-500" />
              <span>Registrar Paciente</span>
            </button>

            <button
              onClick={onOpenNewAppointment}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-lg transition cursor-pointer shadow-sm shadow-emerald-600/30"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Turno</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-200 text-xs">
          <button
            onClick={() => onSelectTab('schedule')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded font-medium ${
              currentTab === 'schedule' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Turnos</span>
          </button>
          <button
            onClick={() => onSelectTab('dentist')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded font-medium ${
              currentTab === 'dentist' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Dentistas</span>
          </button>
          <button
            onClick={() => onSelectTab('patients')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded font-medium ${
              currentTab === 'patients' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <PawPrint className="w-4 h-4" />
            <span>Pacientes</span>
          </button>
          <button
            onClick={() => onSelectTab('database')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded font-medium ${
              currentTab === 'database' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Supabase</span>
          </button>
        </div>
      </div>
    </header>
  );
};
