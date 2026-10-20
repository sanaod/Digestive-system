import React, { useState } from 'react';
import { DigestiveCanvas } from '../3d/DigestiveCanvas';
import { AbqoorJourneyModal } from '../3d/AbqoorJourneyModal';
import { ORGANS_DATA } from '../../data/digestiveData';
import { ActiveTabType, OrganInfo } from '../../types/digestive';
import { toEasternArabic } from '../../utils/arabicNumerals';
import { soundFx } from '../../utils/audio';

interface HomeIntroProps {
  onSelectOrgan: (organ: OrganInfo) => void;
  selectedOrganId: string | null;
}

export const HomeIntro: React.FC<HomeIntroProps> = ({ onSelectOrgan, selectedOrganId }) => {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('all');
  const [isJourneyRunning, setIsJourneyRunning] = useState(false);
  const [journeyStepIndex, setJourneyStepIndex] = useState(0);
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);

  const canalCount = ORGANS_DATA.filter((o) => o.category === 'canal').length;
  const accessoriesCount = ORGANS_DATA.filter((o) => o.category === 'accessories').length;

  const filteredOrgans = ORGANS_DATA.filter((organ) => {
    if (activeTab === 'canal') return organ.category === 'canal';
    if (activeTab === 'accessories') return organ.category === 'accessories';
    return true;
  });

  const startJourney = () => {
    soundFx.playVictoryFanfare();
    setJourneyStepIndex(0);
    setIsJourneyRunning(true);
  };

  return (
    <div className="space-y-6 text-right animate-fadeIn">
      {/* Start Page Header Card featuring Official Teacher Dweikat Logo & Abqoor Logo */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
          {/* Teacher Abdel Rahman Dweikat Official Image Logo */}
          <img
            src="/assets/teacher_dweikat_logo.png"
            alt="شعار الأستاذ عبد الرحمن دويكات - التعليم المستند إلى مصادر التعليم المفتوحة ورخصة المشاع الإبداعي"
            className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-2xl shrink-0 hover:scale-105 transition-transform"
          />

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                العلوم والحياة – الصف الرابع الأساسي – المنهاج الفلسطيني
              </span>
              <span className="px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 text-xs font-bold">
                التعليم المستند إلى مصادر التعليم المفتوحة
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight">
              استكشف نموذج الجهاز الهضمي المطور ثلاثي الأبعاد 360°
            </h2>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              إعداد وإشراف: <strong className="text-emerald-300 font-bold">الأستاذ عبد الرحمن دويكات</strong>. انقر على الأعضاء في المجسم ثلاثي الأبعاد للتعرف على أسمائها ووظائفها وفق المنهاج الفلسطيني للصف الرابع.
            </p>
          </div>
        </div>

        {/* Start Guided Journey Trigger with Abqoor Official Logo */}
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={startJourney}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-3 scale-105 group"
          >
            <img
              src="/assets/abqoor_logo.png"
              alt="شعار عبقور التعليمي - تعليم ممتع لجيل فلسطيني مبدع"
              className="w-9 h-9 object-contain shrink-0 group-hover:rotate-12 transition-transform"
            />
            <span>ابدأ رحلة عبقور التفاعلية 🚀</span>
          </button>
        </div>
      </div>

      {/* Tabs for Sectioning (Requirement #6 & #7) */}
      <div className="flex items-center justify-center sm:justify-start gap-2 bg-slate-900/80 p-2 rounded-2xl border border-slate-800 max-w-2xl">
        <button
          onClick={() => {
            soundFx.playClick();
            setActiveTab('all');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'all'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>عرض الكل</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-950 text-emerald-400 text-[10px]">
            ({toEasternArabic(ORGANS_DATA.length)})
          </span>
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            setActiveTab('canal');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'canal'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-black'
              : 'text-slate-300 hover:text-white bg-slate-950/40'
          }`}
        >
          <span>🫁 القناة الهضمية</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-900 text-emerald-300 text-[10px]">
            ({toEasternArabic(canalCount)}) أعضاء
          </span>
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            setActiveTab('accessories');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'accessories'
              ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20 font-black'
              : 'text-slate-300 hover:text-white bg-slate-950/40'
          }`}
        >
          <span>🧪 ملحقات القناة الهضمية</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-900 text-sky-300 text-[10px]">
            ({toEasternArabic(accessoriesCount)}) ملحقات
          </span>
        </button>
      </div>

      {/* 3D Viewport Area */}
      <div className="relative">
        <DigestiveCanvas
          activeTab={activeTab}
          selectedOrganId={selectedOrganId}
          onSelectOrgan={onSelectOrgan}
          isJourneyRunning={isJourneyRunning}
          journeyStepIndex={journeyStepIndex}
        />

        {/* Guided Journey Active Modal Overlay */}
        {isJourneyRunning && (
          <AbqoorJourneyModal
            currentStepIndex={journeyStepIndex}
            onNextStep={() => setJourneyStepIndex((prev) => prev + 1)}
            onPrevStep={() => setJourneyStepIndex((prev) => Math.max(0, prev - 1))}
            onEndJourney={() => setIsJourneyRunning(false)}
          />
        )}
      </div>

      {/* Collapsible Bottom Control Dock */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="text-xs font-extrabold text-white flex items-center gap-2">
            <span>🗂️ بطاقات الأعضاء المحددة ({toEasternArabic(filteredOrgans.length)} أعضاء):</span>
          </div>

          <button
            onClick={() => setIsDockCollapsed((prev) => !prev)}
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
          >
            {isDockCollapsed ? '▴ إظهار بطاقات الأعضاء' : '▾ إخفاء البطاقات للوضع السينمائي'}
          </button>
        </div>

        {!isDockCollapsed && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-1">
            {filteredOrgans.map((organ) => {
              const isSelected = selectedOrganId === organ.id;
              return (
                <button
                  key={organ.id}
                  onClick={() => {
                    soundFx.playSelectOrgan();
                    onSelectOrgan(organ);
                  }}
                  className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-105'
                      : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: organ.colorHex }}
                    />
                    {organ.orderInCanal && (
                      <span className="text-[10px] text-emerald-400 font-bold">
                        #{toEasternArabic(organ.orderInCanal)}
                      </span>
                    )}
                  </div>

                  <span className="font-extrabold text-xs text-white truncate">{organ.name}</span>
                  <span className="text-[10px] text-slate-400 truncate">{organ.categoryLabel}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
