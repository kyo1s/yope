import React, { useState } from 'react';
import { 
  Database, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Server, 
  RefreshCw, 
  AlertCircle, 
  Terminal,
  Layers,
  Sparkles
} from 'lucide-react';
import { isSupabaseConfigured, SUPABASE_SQL_SCHEMA } from '../lib/supabase';

interface SupabaseRenderModalProps {
  onResetDemoData: () => void;
}

export const SupabaseRenderModal: React.FC<SupabaseRenderModalProps> = ({
  onResetDemoData,
}) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const isCloud = isSupabaseConfigured();

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner Status */}
      <div className={`rounded-2xl p-6 border ${
        isCloud 
          ? 'bg-emerald-950 text-white border-emerald-800' 
          : 'bg-slate-900 text-white border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isCloud ? 'bg-emerald-500/20 text-emerald-400' : 'bg-teal-500/20 text-teal-400'
            }`}>
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">
                  {isCloud ? 'Conectado a Supabase Database' : 'Supabase Conexión & Almacenamiento'}
                </h2>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isCloud 
                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {isCloud ? 'En Vivo (Cloud Postgres)' : 'Persistencia Local Activa (100% Funcional)'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {isCloud 
                  ? 'Las tablas de pacientes, turnos y diagnósticos odontológicos se sincronizan en tiempo real con tu base de datos Supabase.'
                  : 'Todos los pacientes, turnos y notas odontológicas se guardan de forma persistente. Puedes conectar tu proyecto de Supabase en cualquier momento.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (confirm('¿Restablecer los datos iniciales de ejemplo (pacientes y turnos)?')) {
                onResetDemoData();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restablecer Datos de Ejemplo</span>
          </button>
        </div>
      </div>

      {/* Grid: Supabase Setup + Render Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supabase Step by Step */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              Configuración en Supabase (PostgreSQL)
            </h3>
          </div>

          <ol className="space-y-3 text-xs text-slate-700">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                A
              </span>
              <div>
                <strong>Crea un proyecto en Supabase:</strong>
                <p className="text-slate-500">
                  Ingresa a <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-semibold">supabase.com</a> y crea un proyecto nuevo gratuito.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                B
              </span>
              <div>
                <strong>Ejecuta el Script SQL:</strong>
                <p className="text-slate-500">
                  Ve a la sección <strong>SQL Editor</strong> en Supabase, pega el script de la derecha y haz clic en <strong>Run</strong>. Creará las tablas <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-800 font-mono">patients</code> y <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-800 font-mono">appointments</code> con RLS y claves foráneas.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                C
              </span>
              <div>
                <strong>Copia tus credenciales:</strong>
                <p className="text-slate-500">
                  En <strong>Project Settings → API</strong>, copia tu <em>Project URL</em> y <em>anon public key</em> y colócalas en tus variables de entorno:
                </p>
                <div className="mt-1 bg-slate-900 text-emerald-300 p-2.5 rounded-lg font-mono text-[11px] space-y-1">
                  <div>VITE_SUPABASE_URL="https://tu-id.supabase.co"</div>
                  <div>VITE_SUPABASE_ANON_KEY="tu-anon-key-aqui"</div>
                </div>
              </div>
            </li>
          </ol>
        </div>

        {/* Render Deployment Step by Step */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              Despliegue en Render (Hosting Gratis)
            </h3>
          </div>

          {/* Solución al error de 'dist' */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>¿Error en Render: "directory dist does not exist"?</span>
            </div>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              Ocurre si el <strong>Build Command</strong> no incluye la instalación de dependencias previa. 
              Asegúrate de colocar <strong>npm install && npm run build</strong> en lugar de solo <em>npm run build</em>.
            </p>
          </div>

          <ol className="space-y-3 text-xs text-slate-700">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                A
              </span>
              <div>
                <strong>Crear Static Site en Render:</strong>
                <p className="text-slate-500">
                  En <a href="https://render.com" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline font-semibold">dashboard.render.com</a>, haz clic en <strong>New +</strong> y selecciona <strong>Static Site</strong> (¡no Web Service!).
                </p>
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                B
              </span>
              <div>
                <strong>Configuración exacta en Settings de Render:</strong>
                <div className="mt-1.5 bg-slate-900 text-slate-200 rounded-lg p-3 font-mono text-[11px] space-y-2 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-400">Build Command:</span>
                      <div className="text-emerald-400 font-bold">npm install && npm run build</div>
                    </div>
                  </div>
                  <div className="border-t border-slate-800 pt-1.5">
                    <span className="text-slate-400">Publish Directory:</span>
                    <div className="text-cyan-400 font-bold">dist</div>
                  </div>
                </div>
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                C
              </span>
              <div>
                <strong>Variables de Entorno en Render (Environment):</strong>
                <p className="text-slate-500 mb-1">
                  En la pestaña <em>Environment</em> de tu servicio en Render, agrega:
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-[10px] space-y-1 text-slate-700">
                  <div><strong>NODE_VERSION:</strong> <span className="text-emerald-600 font-bold">20</span> (asegura compatibilidad)</div>
                  <div><strong>VITE_SUPABASE_URL:</strong> <span className="text-slate-500">https://tu-id.supabase.co</span></div>
                  <div><strong>VITE_SUPABASE_ANON_KEY:</strong> <span className="text-slate-500">tu-clave-anon</span></div>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </div>

      {/* SQL Script Viewer and 1-Click Copy */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-600" />
              Script SQL Completo para Supabase
            </h3>
            <p className="text-xs text-slate-500">
              Tablas: <span className="font-mono font-semibold">patients</span> y <span className="font-mono font-semibold">appointments</span> con restricciones de turnos (08:00 a 13:00 y 14:00 a 18:00) y políticas de seguridad RLS
            </p>
          </div>

          <button
            onClick={handleCopySql}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-xl shadow-xs transition cursor-pointer"
          >
            {copiedSql ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">¡Copiado al portapapeles!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Script SQL</span>
              </>
            )}
          </button>
        </div>

        <div className="relative">
          <pre className="bg-slate-950 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-96 border border-slate-800 leading-relaxed">
            {SUPABASE_SQL_SCHEMA}
          </pre>
        </div>
      </div>
    </div>
  );
};
