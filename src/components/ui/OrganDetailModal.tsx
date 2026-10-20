import React, { useState } from 'react';
import { OrganInfo } from '../../types/digestive';
import { toEasternArabic } from '../../utils/arabicNumerals';
import { soundFx } from '../../utils/audio';

interface OrganDetailModalProps {
  organ: OrganInfo | null;
  onClose: () => void;
}

export const OrganDetailModal: React.FC<OrganDetailModalProps> = ({ organ, onClose }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!organ || !organ.name) return null;

  const handleSpeak = () => {
    if (isSpeaking) {
      soundFx.stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const textToSpeak = `${organ.name}. ${organ.categoryLabel}. ${organ.detailedFunction}. ماذا يحدث للطعام؟ ${organ.foodProcess}`;
      soundFx.speakArabic(textToSpeak, () => setIsSpeaking(false));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl overflow-hidden text-right">
        {/* Header Ribbon */}
        <div
          className="absolute top-0 right-0 left-0 h-3"
          style={{ backgroundColor: organ.colorHex }}
        />

        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.stopSpeech();
            soundFx.playClick();
            onClose();
          }}
          className="absolute top-5 left-5 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 flex items-center justify-center text-lg font-bold transition-all"
        >
          ✕
        </button>

        {/* Title, Category and Abqoor Logo */}
        <div className="flex items-start gap-4 mb-5 pt-2">
          <img
            src="/assets/abqoor_logo.svg"
            alt="شعار عبقور التعليمي - رحلة في الجهاز الهضمي"
            className="w-14 h-14 object-contain shrink-0 drop-shadow-md"
          />

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: organ.colorHex }}
              >
                {organ.categoryLabel}
              </span>
              {organ.orderInCanal && (
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold border border-slate-700">
                  الترتيب: {toEasternArabic(organ.orderInCanal)}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <span>{organ.name}</span>
              <span className="text-sm font-semibold text-slate-400">({organ.englishName})</span>
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-4 text-sm text-slate-200">
          {/* Detailed Function */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <h3 className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
              <span>📌</span>
              <span>الوظيفة الرئيسية في المنهاج:</span>
            </h3>
            <p className="leading-relaxed text-slate-100 font-medium">{organ.detailedFunction}</p>
          </div>

          {/* Food Process */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <h3 className="text-xs font-bold text-sky-400 mb-1 flex items-center gap-1.5">
              <span>🍎</span>
              <span>ماذا يحدث للطعام هنا؟</span>
            </h3>
            <p className="leading-relaxed text-slate-200">{organ.foodProcess}</p>
          </div>

          {/* Fun Fact with Abqoor */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-3">
            <img
              src="/assets/abqoor_logo.svg"
              alt="توصية من عبقور"
              className="w-8 h-8 object-contain shrink-0 mt-0.5"
            />
            <div>
              <h3 className="text-xs font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                <span>💡</span>
                <span>معلومة عبقور الذكية:</span>
              </h3>
              <p className="leading-relaxed">{organ.funFact}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={handleSpeak}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
              isSpeaking
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
            }`}
          >
            <span>{isSpeaking ? '⏹️ إيقاف القراءة' : '🔊 استمع للشرح الصوتي'}</span>
          </button>

          <button
            onClick={() => {
              soundFx.stopSpeech();
              soundFx.playClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
