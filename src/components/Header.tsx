import React from 'react';
import { GradeLevel } from '../types';
import { Volume2, VolumeX, Languages, PlusCircle, Sparkles, BookOpen } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderProps {
  currentGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  showEnglish: boolean;
  onToggleEnglish: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenCustomModal: () => void;
  onGoHome?: () => void;
  totalScore: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentGrade,
  onSelectGrade,
  showEnglish,
  onToggleEnglish,
  soundEnabled,
  onToggleSound,
  onOpenCustomModal,
  onGoHome,
  totalScore,
}) => {
  const grades: { id: GradeLevel; labelGu: string; labelEn: string; badge: string }[] = [
    { id: 'all', labelGu: 'બધા ધોરણો', labelEn: 'All Grades', badge: 'Std 6-8' },
    { id: 'std6', labelGu: 'ધોરણ ૬', labelEn: 'Class 6', badge: 'Std 6' },
    { id: 'std7', labelGu: 'ધોરણ ૭', labelEn: 'Class 7', badge: 'Std 7' },
    { id: 'std8', labelGu: 'ધોરણ ૮', labelEn: 'Class 8', badge: 'Std 8' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo and Brand */}
          <div className="flex items-center justify-between">
            <button
              onClick={onGoHome}
              className="flex items-center gap-3 text-left group cursor-pointer focus:outline-hidden"
              title="હોમ પેજ પર જાઓ"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                    વિજ્ઞાન વર્ગીકરણ રમત
                  </h1>
                  <span className="text-[11px] font-semibold tracking-wide text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    ધો. ૬ થી ૮
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  ગુજરાત બોર્ડ / NCERT વિજ્ઞાન અભ્યાસક્રમ આધારિત સરળ વર્ગીકરણ
                </p>
              </div>
            </button>

            {/* Quick Actions for Mobile */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                onClick={onToggleSound}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title={soundEnabled ? 'અવાજ બંધ કરો' : 'અવાજ ચાલુ કરો'}
                aria-label="Toggle Sound"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
              </button>
              <button
                onClick={onToggleEnglish}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                  showEnglish
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
                title="ભાષા બદલો"
              >
                Eng
              </button>
            </div>
          </div>

          {/* Right Controls: Grade tabs & Settings */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 sm:gap-3">
            {/* Grade Segmented Control */}
            <div className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/70 text-xs">
              {grades.map((g) => {
                const isActive = currentGrade === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => {
                      sounds.playClick();
                      onSelectGrade(g.id);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-emerald-800 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{g.labelGu}</span>
                  </button>
                );
              })}
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={onToggleEnglish}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  showEnglish
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="અંગ્રેજી અનુવાદ ચાલુ/બંધ કરો"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>{showEnglish ? 'ગુજરાતી + Eng' : 'ગુજરાતી માત્ર'}</span>
              </button>

              <button
                onClick={onToggleSound}
                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                title={soundEnabled ? 'અવાજ બંધ કરો' : 'અવાજ ચાલુ કરો'}
                aria-label="Toggle Sound"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>

              <button
                onClick={onOpenCustomModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
                title="પોતાનું વર્ગીકરણ ઉમેરો"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>નવું વર્ગીકરણ</span>
              </button>
            </div>

            {/* Global Total Points Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>{totalScore} પોઇન્ટ્સ</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
