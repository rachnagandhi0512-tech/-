import React, { useState } from 'react';
import { ClassificationTopic } from '../types';
import { Award, Printer, X, Star, CheckCircle } from 'lucide-react';
import { sounds } from '../utils/audio';

interface CertificateModalProps {
  topic: ClassificationTopic;
  score: number;
  accuracy: number;
  onClose: () => void;
  showEnglish: boolean;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  topic,
  score,
  accuracy,
  onClose,
  showEnglish,
}) => {
  const [studentName, setStudentName] = useState('હોશિયાર વિદ્યાર્થી');
  const [isEditing, setIsEditing] = useState(false);

  const gradeName =
    topic.grade === 'std6'
      ? 'ધોરણ ૬'
      : topic.grade === 'std7'
      ? 'ધોરણ ૭'
      : 'ધોરણ ૮';

  const today = new Date().toLocaleDateString('gu-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden relative print:border-none print:shadow-none print:m-0 print:p-0">
        {/* Close Button (Hidden on Print) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors print:hidden cursor-pointer"
          title="બંધ કરો"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Inner Canvas */}
        <div className="p-6 sm:p-10 border-8 border-double border-amber-600/30 m-2 sm:m-3 rounded-2xl bg-radial from-amber-50/70 via-white to-amber-50/40 text-center">
          {/* Header Seal */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-lg mb-3">
            <Award className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <div className="text-xs uppercase tracking-widest font-black text-amber-800 mb-1">
            ગુજરાત શૈક્ષણિક વિજ્ઞાન સન્માન
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
            વિજ્ઞાન વર્ગીકરણ સિદ્ધિ પ્રમાણપત્ર
          </h2>

          <div className="text-xs text-slate-500 font-medium italic mt-0.5">
            Certificate of Science Classification Excellence
          </div>

          <div className="w-24 h-1 bg-amber-400 mx-auto my-3 rounded-full" />

          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            આ પ્રમાણપત્ર ગૌરવપૂર્વક એનાયત કરવામાં આવે છે:
          </p>

          {/* Student Name */}
          <div className="my-3">
            {isEditing ? (
              <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full text-center text-xl font-bold border-b-2 border-amber-500 focus:outline-hidden py-1"
                  placeholder="તમારું નામ લખો"
                  autoFocus
                />
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 bg-emerald-600 text-white text-xs rounded-md font-bold cursor-pointer"
                >
                  સાચવો
                </button>
              </div>
            ) : (
              <div
                onClick={() => setIsEditing(true)}
                className="text-2xl sm:text-3xl font-extrabold text-amber-900 border-b-2 border-dashed border-amber-400 inline-block px-4 py-1 hover:bg-amber-100/50 cursor-pointer rounded-sm"
                title="નામ બદલવા ક્લિક કરો"
              >
                {studentName} ✏️
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed my-2">
            તેમણે <strong className="text-slate-900 font-bold">{gradeName} વિજ્ઞાન</strong> વિષયના પ્રકરણ આધારિત{' '}
            <strong className="text-emerald-800 font-bold">"{topic.titleGu}"</strong> વર્ગીકરણ પ્રવૃત્તિમાં ઉત્સાહપૂર્વક ભાગ લઈ{' '}
            <strong className="text-amber-700 font-black">{accuracy}% ચોકસાઈ</strong> અને{' '}
            <strong className="text-amber-700 font-black">{score} ગુણ</strong> સાથે સફળતા મેળવી છે.
          </p>

          {/* Rating stars */}
          <div className="flex items-center justify-center gap-1.5 my-3">
            {[1, 2, 3].map((star) => (
              <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>

          {/* Certificate Footer */}
          <div className="mt-8 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
            <div className="text-left">
              <div className="font-bold text-slate-800">તારીખ: {today}</div>
              <div className="text-[11px]">શૈક્ષણિક વિજ્ઞાન પ્રયોગશાળા</div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>ચકાસાયેલ ગુણવત્તા</span>
              </div>
            </div>

            <div className="text-right">
              <div className="font-serif italic font-bold text-slate-800 border-b border-slate-400 pb-0.5 mb-0.5">
                વિજ્ઞાન શિક્ષક શ્રી
              </div>
              <div className="text-[10px]">સત્તાવાર પ્રમાણપત્ર</div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden on Print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between print:hidden">
          <div className="text-xs text-slate-500 font-medium">
            નામ બદલવા માટે નામ પર ક્લિક કરો
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>પ્રિન્ટ / PDF સાચવો</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer"
            >
              બંધ કરો
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
