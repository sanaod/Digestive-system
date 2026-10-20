import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS } from '../../data/digestiveData';
import { QuizQuestion } from '../../types/digestive';
import {
  formatPercentEastern,
  formatScoreEastern,
  getArabicOrdinal,
  toEasternArabic,
} from '../../utils/arabicNumerals';
import { soundFx } from '../../utils/audio';

export const DigestiveQuiz: React.FC = () => {
  const [questions] = useState<QuizQuestion[]>(QUIZ_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;

    soundFx.playClick();
    setSelectedOption(index);
    setIsAnswerSubmitted(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      soundFx.playCorrect();
      setScore((prev) => prev + 1);
    } else {
      soundFx.playWrong();
    }

    setUserAnswers((prev) => [...prev, index]);
  };

  const handleNextQuestion = () => {
    soundFx.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      soundFx.playVictoryFanfare();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      setCurrentIndex(questions.length);
    }
  };

  const handleRestartQuiz = () => {
    soundFx.playClick();
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setUserAnswers([]);
    setIsAnswerSubmitted(false);
  };

  const isFinished = currentIndex >= questions.length;
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-right animate-fadeIn">
      {/* Quiz Header with Official Abqoor PNG Logo */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/assets/abqoor_logo.png"
            alt="شعار عبقور التعليمي - تعليم ممتع لجيل فلسطيني مبدع"
            className="w-12 h-12 md:w-14 md:h-14 object-contain shrink-0 drop-shadow-md"
          />
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-1">
              <span>⭐ النشاط الرابع: اختبار العباقرة النهائي</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white">اختبار علوم الجهاز الهضمي للصف الرابع</h2>
          </div>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-center shrink-0">
          <span className="text-xs text-slate-400 block font-bold">النتيجة الحالية</span>
          <span className="text-2xl font-black text-amber-400">
            {formatScoreEastern(score, questions.length)}
          </span>
        </div>
      </div>

      {!isFinished ? (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
          {/* Progress Bar & Question Counter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-2">
                <img src="/assets/abqoor_logo.png" alt="عبقور" className="w-6 h-6 object-contain inline-block" />
                <span>السؤال {getArabicOrdinal(currentIndex + 1)}</span>
              </span>
              <span>
                السؤال ({toEasternArabic(currentIndex + 1)}) من ({toEasternArabic(questions.length)})
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed">
              {currentQ.questionText}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOpt = idx === currentQ.correctIndex;

              let style = 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-100';

              if (isAnswerSubmitted) {
                if (isCorrectOpt) {
                  style = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-extrabold';
                } else if (isSelected) {
                  style = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                } else {
                  style = 'bg-slate-950/40 border-slate-800/60 opacity-40';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-4 rounded-2xl border text-sm text-right transition-all flex items-center justify-between gap-3 ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-950 border border-slate-800 text-xs font-black flex items-center justify-center shrink-0">
                      {toEasternArabic(idx + 1)}
                    </span>
                    <span className="font-medium">{option}</span>
                  </div>

                  {isAnswerSubmitted && (
                    <span className="text-lg">
                      {isCorrectOpt ? '✅' : isSelected ? '❌' : ''}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box with Abqoor Image Logo Feedback */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 animate-fadeIn flex items-start gap-3">
              <img
                src="/assets/abqoor_logo.png"
                alt="تغذية راجعة من عبقور"
                className="w-10 h-10 object-contain shrink-0 mt-0.5"
              />
              <div className="space-y-1">
                <div className="text-xs font-bold text-emerald-400">
                  تغذية راجعة وشرح توضيحي من عبقور:
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {currentQ.explanation}
                </p>
              </div>
            </div>
          )}

          {/* Next button */}
          {isAnswerSubmitted && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
              >
                <span>{currentIndex < questions.length - 1 ? 'السؤال التالي ◀' : 'عرض النتيجة النهائية 🏆'}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Final Score Card with Abqoor Encouragement Image */
        <div className="p-8 rounded-3xl bg-slate-900 border border-amber-500/40 text-center space-y-6 max-w-xl mx-auto shadow-2xl">
          <img
            src="/assets/abqoor_logo.png"
            alt="شعار عبقور التعليمي - تعليم ممتع لجيل فلسطيني مبدع"
            className="w-28 h-28 mx-auto object-contain drop-shadow-2xl animate-bounce"
          />

          <div>
            <h3 className="text-2xl font-black text-white">مبروك إتمام اختبار العباقرة!</h3>
            <p className="text-xs text-slate-300 mt-1">
              العلوم والحياة – الصف الرابع الأساسي – المنهاج الفلسطيني
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 inline-block px-8">
            <div className="text-xs text-slate-400 font-bold mb-1">النتيجة والنسبة المئوية</div>
            <div className="text-4xl font-black text-amber-400">
              {formatScoreEastern(score, questions.length)}
            </div>
            <div className="text-sm font-bold text-emerald-400 mt-1">
              {formatPercentEastern(percentage)}
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
            {percentage >= 80
              ? 'ممتاز جداً! أنت عبقور حقيقي متميز في فهم أجزاء الجهاز الهضمي ووظائفها!'
              : 'أحسنت! حاول مراجعة المستكشف ثلاثي الأبعاد وإعادة التحدي للوصول إلى النتيجة الكاملة.'}
          </p>

          <button
            onClick={handleRestartQuiz}
            className="px-8 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 transition-all"
          >
            إعادة الاختبار 🔄
          </button>
        </div>
      )}
    </div>
  );
};
