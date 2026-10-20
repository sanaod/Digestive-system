import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ORGANS_DATA } from '../../data/digestiveData';
import { CategoryType, OrganInfo } from '../../types/digestive';
import { formatScoreEastern, toEasternArabic } from '../../utils/arabicNumerals';
import { soundFx } from '../../utils/audio';

export const ClassificationActivity: React.FC = () => {
  // Shuffle list on init
  const [remainingOrgans, setRemainingOrgans] = useState<OrganInfo[]>(() =>
    [...ORGANS_DATA].sort(() => Math.random() - 0.5)
  );

  const [classifiedCanal, setClassifiedCanal] = useState<OrganInfo[]>([]);
  const [classifiedAccessories, setClassifiedAccessories] = useState<OrganInfo[]>([]);

  const [currentOrganIndex, setCurrentOrganIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const activeOrgan = remainingOrgans[currentOrganIndex];

  const handleClassify = (chosenCategory: CategoryType) => {
    if (!activeOrgan) return;

    const isCorrect = activeOrgan.category === chosenCategory;

    if (isCorrect) {
      soundFx.playCorrect();
      setScore((prev) => prev + 1);
      setFeedback({
        isCorrect: true,
        text: `إجابة صحيحة بامتياز! العضو (${activeOrgan.name}) ينتمي إلى (${activeOrgan.categoryLabel}).`,
      });

      if (chosenCategory === 'canal') {
        setClassifiedCanal((prev) => [...prev, activeOrgan]);
      } else {
        setClassifiedAccessories((prev) => [...prev, activeOrgan]);
      }
    } else {
      soundFx.playWrong();
      setFeedback({
        isCorrect: false,
        text: `تنبيه: العضو (${activeOrgan.name}) ينتمي إلى (${activeOrgan.categoryLabel}) وليس إلى (${
          chosenCategory === 'canal' ? 'القناة الهضمية' : 'ملحقات القناة الهضمية'
        }).`,
      });

      if (activeOrgan.category === 'canal') {
        setClassifiedCanal((prev) => [...prev, activeOrgan]);
      } else {
        setClassifiedAccessories((prev) => [...prev, activeOrgan]);
      }
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentOrganIndex < remainingOrgans.length - 1) {
        setCurrentOrganIndex((prev) => prev + 1);
      } else {
        soundFx.playVictoryFanfare();
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    }, 1600);
  };

  const handleRestart = () => {
    soundFx.playClick();
    setRemainingOrgans([...ORGANS_DATA].sort(() => Math.random() - 0.5));
    setClassifiedCanal([]);
    setClassifiedAccessories([]);
    setCurrentOrganIndex(0);
    setScore(0);
    setFeedback(null);
  };

  const isFinished = currentOrganIndex >= remainingOrgans.length && classifiedCanal.length + classifiedAccessories.length === ORGANS_DATA.length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-right animate-fadeIn">
      {/* Activity Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/assets/abqoor_logo.svg"
            alt="شعار عبقور التعليمي - رحلة في الجهاز الهضمي"
            className="w-12 h-12 object-contain shrink-0 drop-shadow-md"
          />
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-1">
              <span>🗂️ النشاط الثاني: تصنيف الأعضاء</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white">تصنيف أعضاء الجهاز الهضمي إلى قسمين رئيسيين</h2>
          </div>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-center shrink-0">
          <span className="text-xs text-slate-400 block font-bold">النتيجة والتقدم</span>
          <span className="text-2xl font-black text-emerald-400">
            {formatScoreEastern(score, ORGANS_DATA.length)}
          </span>
        </div>
      </div>

      {/* Main Game Interface */}
      {!isFinished ? (
        <div className="space-y-6">
          {/* Active Card Question Box */}
          {activeOrgan && (
            <div className="p-6 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/40 shadow-2xl text-center space-y-4 max-w-xl mx-auto relative overflow-hidden">
              <div className="text-xs font-bold text-slate-400">
                العضو رقم ({toEasternArabic(currentOrganIndex + 1)}) من ({toEasternArabic(ORGANS_DATA.length)})
              </div>

              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl">
                🫀
              </div>

              <h3 className="text-2xl font-black text-white">{activeOrgan.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                {activeOrgan.shortDesc}
              </p>

              {/* Classification Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleClassify('canal')}
                  disabled={!!feedback}
                  className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>🫁</span>
                  <span>القناة الهضمية</span>
                </button>

                <button
                  onClick={() => handleClassify('accessories')}
                  disabled={!!feedback}
                  className="p-4 rounded-2xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-slate-950 font-extrabold text-sm shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>🧪</span>
                  <span>ملحقات القناة الهضمية</span>
                </button>
              </div>

              {/* Feedback Alert with Abqoor */}
              {feedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold transition-all border animate-fadeIn flex items-center justify-center gap-2 ${
                    feedback.isCorrect
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                  }`}
                >
                  <img src="/assets/abqoor_logo.svg" alt="عبقور" className="w-6 h-6 object-contain inline-block" />
                  <span>{feedback.text}</span>
                </div>
              )}
            </div>
          )}

          {/* Two Main Classification Bins */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-emerald-400 flex items-center gap-2 text-base">
                  <span>🫁</span>
                  <span>قسم: القناة الهضمية</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                  ({toEasternArabic(classifiedCanal.length)}) من ({toEasternArabic(8)}) أعضاء
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 min-h-[140px] p-2 rounded-2xl bg-slate-950/50 border border-slate-800/80">
                {classifiedCanal.map((org) => (
                  <div
                    key={org.id}
                    className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs font-bold text-slate-100 flex items-center gap-2 animate-fadeIn"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{org.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/80 border border-sky-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-sky-400 flex items-center gap-2 text-base">
                  <span>🧪</span>
                  <span>قسم: ملحقات القناة الهضمية</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold">
                  ({toEasternArabic(classifiedAccessories.length)}) من ({toEasternArabic(4)}) ملحقات
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 min-h-[140px] p-2 rounded-2xl bg-slate-950/50 border border-slate-800/80">
                {classifiedAccessories.map((org) => (
                  <div
                    key={org.id}
                    className="p-2.5 rounded-xl bg-slate-900 border border-sky-500/40 text-xs font-bold text-slate-100 flex items-center gap-2 animate-fadeIn"
                  >
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    <span>{org.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Completion Screen */
        <div className="p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 text-center space-y-5 max-w-xl mx-auto shadow-2xl">
          <img
            src="/assets/abqoor_logo.svg"
            alt="شعار عبقور التعليمي - أحسنت"
            className="w-20 h-20 mx-auto object-contain drop-shadow-xl"
          />

          <h3 className="text-2xl font-black text-white">أحسنت يا بطل العلوم!</h3>
          <p className="text-sm text-slate-300">
            لقد أكملت تصنيف جميع أعضاء القناة الهضمية وملحقاتها بنجاح ونتيجتك هي:
          </p>

          <div className="text-3xl font-black text-emerald-400">
            {formatScoreEastern(score, ORGANS_DATA.length)}
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/30 transition-all"
          >
            إعادة النشاط والتحدي 🔄
          </button>
        </div>
      )}
    </div>
  );
};
