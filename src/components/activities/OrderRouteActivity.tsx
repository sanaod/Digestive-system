import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ORGANS_DATA } from '../../data/digestiveData';
import { OrganInfo } from '../../types/digestive';
import { formatScoreEastern, getArabicOrdinal, toEasternArabic } from '../../utils/arabicNumerals';
import { soundFx } from '../../utils/audio';

export const OrderRouteActivity: React.FC = () => {
  const canalOrgans = ORGANS_DATA.filter((o) => o.category === 'canal').sort(
    (a, b) => (a.orderInCanal || 0) - (b.orderInCanal || 0)
  );

  const [currentOrder, setCurrentOrder] = useState<OrganInfo[]>(() =>
    [...canalOrgans].sort(() => Math.random() - 0.5)
  );

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const moveCard = (index: number, direction: 'up' | 'down') => {
    soundFx.playClick();
    const newOrder = [...currentOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;

    if (targetIdx >= 0 && targetIdx < newOrder.length) {
      const temp = newOrder[index];
      newOrder[index] = newOrder[targetIdx];
      newOrder[targetIdx] = temp;
      setCurrentOrder(newOrder);
      setIsSubmitted(false);
    }
  };

  const handleVerify = () => {
    let correctCount = 0;
    currentOrder.forEach((organ, idx) => {
      if (organ.orderInCanal === idx + 1) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setIsSubmitted(true);

    if (correctCount === canalOrgans.length) {
      soundFx.playVictoryFanfare();
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    } else {
      soundFx.playWrong();
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setCurrentOrder([...canalOrgans].sort(() => Math.random() - 0.5));
    setIsSubmitted(false);
    setScore(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-right animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/assets/abqoor_logo.svg"
            alt="شعار عبقور التعليمي - رحلة في الجهاز الهضمي"
            className="w-12 h-12 object-contain shrink-0 drop-shadow-md"
          />
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-1">
              <span>🔄 النشاط الثالث: ترتيب مسار الطعام</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white">ترتيب محطات القناة الهضمية بالترتيب الصحيح</h2>
          </div>
        </div>

        {isSubmitted && (
          <div className="px-5 py-3 rounded-2xl bg-slate-950 border border-emerald-500/40 text-center shrink-0">
            <span className="text-xs text-slate-400 block font-bold">المحطات الصحيحة</span>
            <span className="text-2xl font-black text-emerald-400">
              {formatScoreEastern(score, canalOrgans.length)}
            </span>
          </div>
        )}
      </div>

      {/* Ordering List Cards */}
      <div className="space-y-2.5">
        {currentOrder.map((organ, index) => {
          const isCorrectPos = isSubmitted && organ.orderInCanal === index + 1;
          const isWrongPos = isSubmitted && organ.orderInCanal !== index + 1;

          return (
            <div
              key={organ.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                isCorrectPos
                  ? 'bg-emerald-500/10 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                  : isWrongPos
                  ? 'bg-rose-500/10 border-rose-500/60'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-black text-sm flex items-center justify-center shrink-0">
                  {toEasternArabic(index + 1)}
                </span>

                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <span>{organ.name}</span>
                    <span className="text-xs font-normal text-slate-400">
                      (المحطة {getArabicOrdinal(index + 1)})
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">{organ.shortDesc}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isSubmitted && (
                  <span className="text-lg">
                    {isCorrectPos ? '✅' : '❌'}
                  </span>
                )}

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveCard(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 text-xs font-bold transition-all"
                    title="تحريك للأعلى"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveCard(index, 'down')}
                    disabled={index === currentOrder.length - 1}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 text-xs font-bold transition-all"
                    title="تحريك للأسفل"
                  >
                    ▼
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <button
          onClick={handleReset}
          className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
        >
          إعادة الخلط والتسلسل 🔄
        </button>

        <button
          onClick={handleVerify}
          className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all"
        >
          تحقق من الترتيب الصحيح 🎯
        </button>
      </div>
    </div>
  );
};
