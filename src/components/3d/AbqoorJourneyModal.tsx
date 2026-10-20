import React, { useEffect, useState } from 'react';
import { ORGANS_DATA } from '../../data/digestiveData';
import { OrganInfo } from '../../types/digestive';
import { toEasternArabic } from '../../utils/arabicNumerals';
import { soundFx } from '../../utils/audio';

interface AbqoorJourneyModalProps {
  currentStepIndex: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onEndJourney: () => void;
}

export const AbqoorJourneyModal: React.FC<AbqoorJourneyModalProps> = ({
  currentStepIndex,
  onNextStep,
  onPrevStep,
  onEndJourney,
}) => {
  const canalOrgans = ORGANS_DATA.filter((o) => o.category === 'canal').sort(
    (a, b) => (a.orderInCanal || 0) - (b.orderInCanal || 0)
  );

  const currentOrgan: OrganInfo = canalOrgans[currentStepIndex] || canalOrgans[0];
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Auto speak on step change
  useEffect(() => {
    soundFx.stopSpeech();
    setIsSpeaking(true);
    const text = `المحطة ${toEasternArabic(currentStepIndex + 1)}: ${currentOrgan.name}. ${currentOrgan.foodProcess}`;
    soundFx.speakArabic(text, () => setIsSpeaking(false));

    return () => soundFx.stopSpeech();
  }, [currentStepIndex, currentOrgan]);

  return (
    <div className="absolute top-4 right-4 left-4 z-30 max-w-2xl mx-auto bg-slate-900/95 border border-emerald-500/50 rounded-2xl p-5 shadow-2xl backdrop-blur-xl text-right animate-fadeIn">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/abqoor_logo.svg"
            alt="شعار عبقور التعليمي - رحلة في الجهاز الهضمي"
            className="w-10 h-10 object-contain shrink-0 drop-shadow-md"
          />
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span>رحلة عبقور التفاعلية في القناة الهضمية</span>
            </h3>
            <p className="text-xs text-emerald-400 font-medium">
              المحطة رقم ({toEasternArabic(currentStepIndex + 1)}) من ({toEasternArabic(canalOrgans.length)})
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundFx.stopSpeech();
            soundFx.playClick();
            onEndJourney();
          }}
          className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all"
        >
          إنهاء الرحلة ✕
        </button>
      </div>

      {/* Active Organ Info Card */}
      <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold text-emerald-300 flex items-center gap-2">
            <span>{currentOrgan.name}</span>
            <span className="text-xs font-normal text-slate-400">({currentOrgan.englishName})</span>
          </h4>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
            {currentOrgan.categoryLabel}
          </span>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed font-medium">
          {currentOrgan.detailedFunction}
        </p>

        <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-xs text-sky-200">
          <span className="font-bold text-sky-400">تحول الطعام: </span>
          <span>{currentOrgan.foodProcess}</span>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-1.5 mb-4">
        {canalOrgans.map((org, idx) => (
          <div
            key={org.id}
            className={`h-2 rounded-full transition-all ${
              idx === currentStepIndex
                ? 'w-8 bg-emerald-400 shadow-lg shadow-emerald-500/50'
                : idx < currentStepIndex
                ? 'w-2 bg-emerald-600'
                : 'w-2 bg-slate-700'
            }`}
            title={org.name}
          />
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={() => {
            soundFx.playClick();
            onPrevStep();
          }}
          disabled={currentStepIndex === 0}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <span>◀</span>
          <span>المحطة السابقة</span>
        </button>

        <button
          onClick={() => {
            if (isSpeaking) {
              soundFx.stopSpeech();
              setIsSpeaking(false);
            } else {
              setIsSpeaking(true);
              const text = `المحطة ${toEasternArabic(currentStepIndex + 1)}: ${currentOrgan.name}. ${currentOrgan.detailedFunction}`;
              soundFx.speakArabic(text, () => setIsSpeaking(false));
            }
          }}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5"
        >
          <span>{isSpeaking ? '🔊 يتحدث...' : '🔈 إعادة الشرح'}</span>
        </button>

        {currentStepIndex < canalOrgans.length - 1 ? (
          <button
            onClick={() => {
              soundFx.playCorrect();
              onNextStep();
            }}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <span>المحطة التالية</span>
            <span>▶</span>
          </button>
        ) : (
          <button
            onClick={() => {
              soundFx.playVictoryFanfare();
              onEndJourney();
            }}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/30 transition-all flex items-center gap-1.5"
          >
            <span>🎉 اكتملت الرحلة بنجاح!</span>
          </button>
        )}
      </div>
    </div>
  );
};
