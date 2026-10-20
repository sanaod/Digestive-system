import React from 'react';

export const CreativeCommonsSection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 text-right animate-fadeIn">
      {/* Primary Header Card with Official Teacher Abdel Rahman Dweikat Image Logo */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-slate-800 pb-5">
          {/* Official Teacher Dweikat PNG Logo */}
          <img
            src="/assets/teacher_dweikat_logo.png"
            alt="شعار الأستاذ عبد الرحمن دويكات - التعليم المستند إلى مصادر التعليم المفتوحة ورخصة المشاع الإبداعي"
            className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl shrink-0 hover:scale-105 transition-transform"
          />

          <div className="space-y-2 text-center sm:text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <span>📜 مصادر التعليم المفتوحة (OER) ورخصة المشاع الإبداعي</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white">بطاقة التعريف والترخيص القانوني المفتوح</h2>

            <p className="text-xs text-slate-300">
              توثيق المرجعية العلمية والهوية التعليمية المفتوحة تحت إشراف الأستاذ عبد الرحمن دويكات.
            </p>
          </div>
        </div>

        {/* Mandatory Information Lines */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-2">
          <div className="text-base font-extrabold text-emerald-300">
            «العلوم والحياة – الصف الرابع الأساسي – المنهاج الفلسطيني»
          </div>
          <div className="text-sm font-bold text-sky-300">
            «التعليم المستند إلى مصادر التعليم المفتوحة»
          </div>
          <div className="text-sm font-extrabold text-amber-300">
            «إعداد وإشراف: الأستاذ عبد الرحمن دويكات»
          </div>
        </div>
      </div>

      {/* Creative Commons License Terms */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>⚖️</span>
          <span>بيان رخصة المشاع الإبداعي (Creative Commons License)</span>
        </h3>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs">
              CC BY-NC-SA 4.0
            </div>
            <span className="text-sm font-bold text-slate-200">
              نسب المصنف - غير تجاري - الترخيص بالمثل 4.0 دولي
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            يُتاح هذا التطبيق والمورد التعليمي المفتوح (OER) للجميع (معلمين، وطلاب، وأولياء أمور، وباحثين) للاستخدام والنسخ والتطوير وإعادة التوزيع لأغراض تعليمية وغير تجارية، بشرط:
          </p>

          <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5 font-medium">
            <li>
              <strong className="text-emerald-400">نسب العمل إلى صاحبه (Attribution):</strong> توثيق وإبراز اسم المنسق والمشرف «الأستاذ عبد الرحمن دويكات» والمنهاج الفلسطيني.
            </li>
            <li>
              <strong className="text-amber-400">الاستخدام غير التجاري (Non-Commercial):</strong> عدم استخدام هذا المورد أو أي جزء منه لأغراض تجارية أو ربحية.
            </li>
            <li>
              <strong className="text-sky-400">الترخيص بالمثل (ShareAlike):</strong> في حال التعديل أو الاشتقاق أو البناء على هذا المورد، يجب نشر العمل المشتق تحت نفس الترخيص المفتوح.
            </li>
          </ul>
        </div>
      </div>

      {/* External Sources & Documentation */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>📚</span>
          <span>توثيق المصادر العلمية والنماذج البرمجية الخارجية</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <h4 className="text-sm font-bold text-emerald-400">📖 المرجع العلمي الأكاديمي</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              كتاب «العلوم والحياة – للصف الرابع الأساسي» – وزارة التربية والتعليم الفلسطينية (مركز المناهج).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <h4 className="text-sm font-bold text-sky-400">💻 البرمجيات والمكتبات المفتوحة المصدر</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              محرك Three.js (رخصة MIT)، إطار عمل React (رخصة MIT)، ومكتبة Tailwind CSS (رخصة MIT). النماذج ثلاثية الأبعاد مولدة برمجياً بالكامل.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
          <strong>ملاحظة شفافة:</strong> لا تنسب الرخص المفتوحة إلى أي مواد خارجية لا يملك المطور حق إعادة ترخيصها، وتعتمد جميع عناصر هذا التطبيق على خوارزميات برمجية حرة ومصادر تعليمية مفتوحة OER.
        </div>
      </div>
    </div>
  );
};
