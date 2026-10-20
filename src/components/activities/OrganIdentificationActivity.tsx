import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ORGANS_DATA } from '../../data/digestiveData';
import { OrganInfo } from '../../types/digestive';
import { formatScoreEastern, toEasternArabic } from '../../utils/arabicNumerals';
import { soundFx } from '../../utils/audio';

export const OrganIdentificationActivity: React.FC = () => {
  const [shuffledOrgans] = useState<OrganInfo[]>(() =>
    [...ORGANS_DATA].sort(() => Math.random() - 0.5)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const currentOrgan = shuffledOrgans[currentIndex];

  const [options, setOptions] = useState<OrganInfo[]>(() => getFourChoices(currentOrgan));

  function getFourChoices(target: OrganInfo): OrganInfo[] {
    const distractors = ORGANS_DATA.filter((o) => o.id !== target.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return [target, ...distractors].sort(() => Math.random() - 0.5);
  }

  const handleSelectOption = (option: OrganInfo) => {
    if (selectedOptionId) return;
    setSelectedOptionId(option.id);

    const isCorrect = option.id === currentOrgan.id;
    if (isCorrect) {
      soundFx.playCorrect();
      setScore((prev) => prev + 1);
      setFeedback({
        isCorrect: true,
        text: `ممتاز يا عبقور! الإجابة الصحيحة هي (${currentOrgan.name}).`,
      });
    } else {
      soundFx.playWrong();
      setFeedback({
        isCorrect: false,
        text: `تنبيه: الإجابة الصحيحة هي (${currentOrgan.name}).`,
      });
    }

    setTimeout(() => {
      if (currentIndex < shuffledOrgans.length - 1) {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        setSelectedOptionId(null);
        setFeedback(null);
        setOptions(getFourChoices(shuffledOrgans[nextIdx]));
      } else {
        soundFx.playVictoryFanfare();
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        setCurrentIndex(shuffledOrgans.length);
      }
    }, 1800);
  };

  const handleRestart = () => {
    soundFx.playClick();
    setCurrentIndex(0);
    setScore(0);
    setSelectedOptionId(null);
    setFeedback(null);
    setOptions(getFourChoices(shuffledOrgans[0]));
  };

  const isFinished = currentIndex >= shuffledOrgans.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-right animate-fadeIn">
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
              <span>🔍 النشاط الأول: تحديد ووظائف الأعضاء</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white">اقرأ الوظيفة واكتشف اسم العضو المناسب</h2>
          </div>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-center shrink-0">
          <span className="text-xs text-slate-400 block font-bold">النقاط والتقدم</span>
          <span className="text-2xl font-black text-emerald-400">
            {formatScoreEastern(score, shuffledOrgans.length)}
          </span>
        </div>
      </div>

      {!isFinished ? (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
          <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
            <div className="text-xs text-emerald-400 font-bold">
              اللغز رقم ({toEasternArabic(currentIndex + 1)}) من ({toEasternArabic(shuffledOrgans.length)})
            </div>
            <h3 className="text-lg font-bold text-white leading-relaxed">
              «{currentOrgan.detailedFunction}»
            </h3>
            <div className="text-xs text-sky-300">
              💡 تلميح: {currentOrgan.shortDesc}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isCorrectOpt = opt.id === currentOrgan.id;

              let btnStyle = 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-white';

              if (selectedOptionId) {
                if (isCorrectOpt) {
                  btnStyle = 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-lg shadow-emerald-500/20';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500/30 border-rose-500 text-rose-200 font-bold';
                } else {
                  btnStyle = 'bg-slate-950/40 opacity-40 border-slate-800';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  disabled={!!selectedOptionId}
                  className={`p-4 rounded-2xl border text-sm font-bold text-right transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span>{opt.name}</span>
                  </span>
                  <span className="text-xs opacity-80 font-normal">({opt.categoryLabel})</span>
                </button>
              );
            })}
          </div>

          {feedback && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold border transition-all animate-fadeIn flex items-center gap-2 ${
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
      ) : (
        <div className="p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 text-center space-y-5 max-w-xl mx-auto shadow-2xl">
          <img
            src="/assets/abqoor_logo.svg"
            alt="شعار عبقور التعليمي - إنجاز"
            className="w-20 h-20 mx-auto object-contain drop-shadow-xl"
          />

          <h3 className="text-2xl font-black text-white">إنجاز رائع!</h3>
          <p className="text-sm text-slate-300">
            لقد نجحت في التعرف على وظائف وأعضاء الجهاز الهضمي بنجاح، وكانت النتيجة:
          </p>

          <div className="text-3xl font-black text-emerald-400">
            {formatScoreEastern(score, shuffledOrgans.length)}
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/30 transition-all"
          >
            إعادة النشاط واللعب 🔄
          </button>
        </div>
      )}
    </div>
  );
};
