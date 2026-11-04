import React from 'react';

export const Logo = ({ variant = 'full', size = 'default', className = '' }) => {
  if (variant === 'icon') {
    const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';
    return (
      <div className={`relative flex-shrink-0 ${iconSize} ${className}`}>
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id="lhLogoBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="lhLogoCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" rx="14" fill="url(#lhLogoBg)" />
          <rect x="0.75" y="0.75" width="62.5" height="62.5" rx="13.25" stroke="#334155" strokeWidth="1.5" />
          <circle cx="32" cy="32" r="20" stroke="#1E293B" strokeWidth="1.5" />
          <circle cx="32" cy="32" r="14" stroke="url(#lhLogoCyan)" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="32" cy="32" r="7" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="32" y1="8" x2="32" y2="15" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="32" y1="49" x2="32" y2="56" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="8" y1="32" x2="15" y2="32" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="49" y1="32" x2="56" y2="32" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="32" r="2.5" fill="#FFFFFF" />
          <circle cx="45" cy="19" r="4.5" fill="#10B981" />
          <path d="M43 19L44.5 20.5L47.5 17.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo variant="icon" size={size} />
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-none">
            LeadHunter
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-900 text-sky-400">
            .ai
          </span>
        </div>
        <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-500 mt-0.5">
          Inteligência & Auditoria Forense
        </span>
      </div>
    </div>
  );
};

export default Logo;
