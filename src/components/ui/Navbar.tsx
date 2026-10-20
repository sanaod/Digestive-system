import React from 'react';
import { GameMode } from '../../types/digestive';
import { soundFx } from '../../utils/audio';

interface NavbarProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  isMuted,
  onToggleMute,
}) => {
  const navItems: { id: GameMode; label: string; icon: string }[] = [
    { id: 'explore', label: 'المستكشف 3D', icon: '🧬' },
    { id: 'journey', label: 'رحلة عبقور', icon: '🚀' },
    { id: 'identify', label: 'تحديد ووظائف الأعضاء', icon: '🔍' },
    { id: 'classify', label: 'تصنيف الأعضاء', icon: '🗂️' },
    { id: 'order', label: 'ترتيب مسار الطعام', icon: '🔄' },
    { id: 'quiz', label: 'اختبار العباقرة', icon: '⭐' },
    { id: 'license', label: 'المصادر والتراخيص', icon: '📜' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Title & Official Abqoor Educational Logo */}
        <div className="flex items-center gap-3 text-right">
          <img
            src="/assets/abqoor_logo.png"
            alt="شعار عبقور التعليمي - تعليم ممتع لجيل فلسطيني مبدع"
            className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-md shrink-0 hover:scale-105 transition-transform"
          />

          <div>
            <h1 className="text-lg md:text-xl font-extrabold text-white tracking-wide flex items-center gap-2">
              <span>رحلة عبقور في الجهاز الهضمي</span>
            </h1>
            <p className="text-xs text-emerald-400 font-medium">
              العلوم والحياة – الصف الرابع الأساسي – المنهاج الفلسطيني
            </p>
          </div>
        </div>

        {/* Supervisor Badge with Official Teacher Dweikat Logo & Audio Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              soundFx.playClick();
              onSelectMode('license');
            }}
            className="hidden sm:flex items-center gap-2.5 bg-slate-950/80 hover:bg-slate-800 px-3 py-1.5 rounded-2xl border border-slate-700/80 text-slate-300 transition-all text-right group"
            title="الانتقال إلى صفحة المصادر والتراخيص"
          >
            <img
              src="/assets/teacher_dweikat_logo.png"
              alt="شعار الأستاذ عبد الرحمن دويكات - التعليم المستند إلى مصادر التعليم المفتوحة ورخصة المشاع الإبداعي"
              className="w-9 h-9 object-contain shrink-0 group-hover:scale-110 transition-transform"
            />
            <div className="flex flex-col text-xs">
              <span className="text-[10px] text-slate-400 font-medium">إعداد وإشراف</span>
              <span className="font-bold text-emerald-300 group-hover:text-emerald-200">الأستاذ عبد الرحمن دويكات</span>
            </div>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onToggleMute();
            }}
            className={`p-2.5 rounded-2xl border transition-all flex items-center justify-center text-lg ${
              isMuted
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 hover:bg-rose-500/20'
                : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20'
            }`}
            title={isMuted ? 'تفعيل الصوت والقراءة الصوتية' : 'كتم الصوت'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* Navigation Modes Bar */}
      <nav className="bg-slate-950/80 border-t border-slate-800/80 px-4 py-2 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center justify-center md:justify-start gap-1.5 min-w-max">
          {navItems.map((item) => {
            const isActive = currentMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundFx.playClick();
                  onSelectMode(item.id);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
