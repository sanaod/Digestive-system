import React from 'react';
import { GameMode } from '../../types/digestive';
import { toEasternArabic } from '../../utils/arabicNumerals';

interface FooterProps {
  onSelectMode: (mode: GameMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectMode }) => {
  return (
    <footer className="mt-16 bg-slate-900 border-t border-slate-800 py-8 px-4 text-center text-slate-400 text-xs leading-relaxed">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Core Metadata Lines */}
        <div className="flex flex-wrap items-center justify-center gap-3 font-bold text-slate-200">
          <span>العلوم والحياة – الصف الرابع الأساسي – المنهاج الفلسطيني</span>
          <span>•</span>
          <span className="text-emerald-400">التعليم المستند إلى مصادر التعليم المفتوحة</span>
          <span>•</span>
          <span className="text-amber-400">إعداد وإشراف: الأستاذ عبد الرحمن دويكات</span>
        </div>

        <p className="max-w-2xl mx-auto text-slate-400 text-[11px]">
          تطبيق تفاعلي تعليمي يُتيح للطلاب والمعلمين استكشاف الجهاز الهضمي والتعرف على القناة الهضمية وملحقاتها برؤية ثلاثية الأبعاد 360 درجة، وممارسة أنشطة واختبارات تفاعلية محفزة.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold pt-2 border-t border-slate-800/80">
          <button
            onClick={() => onSelectMode('license')}
            className="text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>📜 رخصة المشاع الإبداعي (CC BY-NC-SA {toEasternArabic(4.0)})</span>
          </button>
          <span>|</span>
          <span>جميع الحقوق محفوظة للأغراض التعليمية المفتوحة ({toEasternArabic(2026)})</span>
        </div>
      </div>
    </footer>
  );
};
