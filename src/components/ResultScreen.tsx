import React, { useEffect } from 'react';
import { ClassificationTopic, UserAnswerRecord } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Star,
  Award,
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface ResultScreenProps {
  topic: ClassificationTopic;
  answers: UserAnswerRecord[];
  score: number;
  timeSpentSec: number;
  onPlayAgain: () => void;
  onPracticeMistakes: (mistakenItems: UserAnswerRecord[]) => void;
  onBackToHome: () => void;
  onOpenCertificate: () => void;
  showEnglish: boolean;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  topic,
  answers,
  score,
  timeSpentSec,
  onPlayAgain,
  onPracticeMistakes,
  onBackToHome,
  onOpenCertificate,
  showEnglish,
}) => {
  const total = answers.length;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  // Calculate stars
  const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1;

  // Trigger celebration confetti
  useEffect(() => {
    sounds.playLevelComplete();
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const mistakes = answers.filter((a) => !a.isCorrect);

  const getPraiseText = () => {
    if (accuracy === 100) return 'અદ્ભુત! ૧૦૦% સાચા જવાબો! તમે વિજ્ઞાન ચેમ્પિયન છો! 🏆';
    if (accuracy >= 80) return 'ખૂબ સરસ પ્રદર્શન! વિજ્ઞાન પર તમારી પકડ ઉત્તમ છે! 🌟';
    if (accuracy >= 60) return 'સારો પ્રયત્ન! થોડી પ્રેક્ટિસથી તમે ૧૦૦% મેળવી શકશો! 👍';
    return 'સારું શીખ્યા! ભૂલોમાંથી જ નવું વિજ્ઞાન શીખાય છે! 💪';
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return mins > 0 ? `${mins} મિ. ${s} સે.` : `${s} સેકન્ડ`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
      {/* Result Card Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-8">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-6 py-8 text-center text-white relative">
          <div className="text-xs uppercase tracking-widest font-extrabold text-emerald-200 mb-1">
            પરિણામ પત્રક (RESULT)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {topic.titleGu}
          </h2>
          {showEnglish && (
            <p className="text-xs sm:text-sm text-emerald-100 font-medium italic mt-0.5">
              {topic.titleEn}
            </p>
          )}

          {/* Stars display */}
          <div className="flex items-center justify-center gap-3 my-4">
            {[1, 2, 3].map((starNum) => (
              <div
                key={starNum}
                className={`p-2.5 rounded-full transition-transform ${
                  starNum <= stars
                    ? 'bg-amber-400 text-white shadow-lg scale-110'
                    : 'bg-white/20 text-white/40'
                }`}
              >
                <Star
                  className={`w-7 h-7 sm:w-8 sm:h-8 ${
                    starNum <= stars ? 'fill-white' : 'stroke-white/40'
                  }`}
                />
              </div>
            ))}
          </div>

          <p className="text-sm sm:text-base font-bold text-emerald-50">
            {getPraiseText()}
          </p>
        </div>

        {/* Score & Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100 bg-slate-50 border-b border-slate-200">
          <div className="p-4 text-center">
            <div className="text-xs text-slate-500 font-semibold mb-1">કુલ ગુણ</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {score}
            </div>
          </div>
          <div className="p-4 text-center">
            <div className="text-xs text-slate-500 font-semibold mb-1">ચોકસાઈ (Accuracy)</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600">
              {accuracy}%
            </div>
          </div>
          <div className="p-4 text-center">
            <div className="text-xs text-slate-500 font-semibold mb-1">સાચા / કુલ</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {correctCount} / {total}
            </div>
          </div>
          <div className="p-4 text-center">
            <div className="text-xs text-slate-500 font-semibold mb-1">સમય લીધો</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {formatTime(timeSpentSec)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-white flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              onOpenCertificate();
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-amber-500/25 transition-transform hover:scale-102 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>વિજ્ઞાન પ્રમાણપત્ર મેળવો</span>
          </button>

          {mistakes.length > 0 && (
            <button
              onClick={() => {
                sounds.playClick();
                onPracticeMistakes(mistakes);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-rose-500/25 transition-transform hover:scale-102 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>ભૂલો ફરીથી ઉકેલો ({mistakes.length})</span>
            </button>
          )}

          <button
            onClick={() => {
              sounds.playClick();
              onPlayAgain();
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ફરીથી રમો</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onBackToHome();
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>અન્ય વિષય</span>
          </button>
        </div>
      </div>

      {/* Review Section with Explanations */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
        <h3 className="text-lg font-extrabold text-slate-900 mb-1 flex items-center gap-2">
          <span>વિગતવાર સમીક્ષા અને વિજ્ઞાન સમજૂતી</span>
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          દરેક પદાર્થ શા માટે તે જ જૂથમાં આવે છે તેનું વૈજ્ઞાનિક કારણ વાંચો:
        </p>

        <div className="space-y-3.5">
          {answers.map((ans, idx) => {
            const correctCategory = topic.categories.find(
              (c) => c.key === ans.item.categoryKey
            );
            const chosenCategory = topic.categories.find(
              (c) => c.key === ans.chosenCategoryKey
            );

            return (
              <div
                key={ans.item.id + idx}
                className={`p-4 rounded-2xl border transition-all ${
                  ans.isCorrect
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-rose-50/50 border-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl p-2 bg-white rounded-xl shadow-2xs border border-slate-100">
                      {ans.item.emoji || '🔬'}
                    </span>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {ans.item.nameGu}
                        {showEnglish && (
                          <span className="text-xs text-slate-500 ml-2 font-normal italic">
                            ({ans.item.nameEn})
                          </span>
                        )}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                        <span className="font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                          સાચું જૂથ: {correctCategory?.labelGu}
                        </span>
                        {!ans.isCorrect && (
                          <span className="font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                            તમારો જવાબ: {chosenCategory?.labelGu}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {ans.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    )}
                  </div>
                </div>

                {/* Explanation text */}
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-xs sm:text-[13px] text-slate-700 leading-relaxed flex items-start gap-1.5">
                  <span className="font-bold text-slate-900 shrink-0">
                    વૈજ્ઞાનિક સમજૂતી:
                  </span>
                  <span>{ans.item.explanationGu}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
