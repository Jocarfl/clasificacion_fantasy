import React from 'react';
import { ShieldCheck, Github } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="mt-16 border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span>Liga Fantasy 2026-2027 • Control Oficial de Multas y Bote</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenAdmin}
            className="text-slate-400 hover:text-amber-400 underline underline-offset-4 transition-colors"
          >
            Añadir / Generar Jornada
          </button>
          <span className="text-slate-700">•</span>
          <span className="inline-flex items-center gap-1 text-slate-400">
            <Github className="w-3.5 h-3.5" /> GitHub Pages
          </span>
        </div>
      </div>
    </footer>
  );
};
