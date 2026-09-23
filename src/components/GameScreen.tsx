import React, { useState, useEffect, useRef } from 'react';
import { ClassificationTopic, ClassificationItem, UserAnswerRecord } from '../types';
import { sounds, speakText } from '../utils/audio';
import {
  Volume2,
  Lightbulb,
  ArrowRight,
  Flame,
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GameScreenProps {
  topic: ClassificationTopic;
  onFinish: (answers: UserAnswerRecord[], score: number, timeSpentSec: number) => void;
  onBackToHome: () => void;
  showEnglish: boolean;
  soundEnabled: boolean;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  topic,
  onFinish,
  onBackToHome,
  showEnglish,
  soundEnabled,
}) => {
  // Shuffle items once at start
  const [items] = useState<ClassificationItem[]>(() => {
    return [...topic.items].sort(() => Math.random() - 0.5);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswerRecord[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [timeSpentSec, setTimeSpentSec] = useState(0);

  // Immediate feedback state
  const [feedback, setFeedback] = useState<{
    status: 'correct' | 'incorrect';
    chosenCategoryKey: string;
    pointsGained: number;
    explanationGu: string;
    explanationEn?: string;
  } | null>(null);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);

  // Bucket counters for visual satisfaction
  const [bucketCounts, setBucketCounts] = useState<Record<string, number>>({});

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpentSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentItem = items[currentIndex];

  // Auto speak item when new question appears (if sound is enabled)
  useEffect(() => {
    setShowHint(false);
  }, [currentIndex]);

  const handleClassify = (chosenCategoryKey: string) => {
    if (feedback || !currentItem) return;

    const isCorrect = chosenCategoryKey === currentItem.categoryKey;
    let points = 0;

    if (isCorrect) {
      const currentStreak = streak + 1;
      setStreak(currentStreak);
      if (currentStreak > maxStreak) setMaxStreak(currentStreak);

      // Streak multiplier bonus
      const bonus = Math.min(Math.floor(currentStreak / 3) * 5, 15);
      points = 10 + bonus;
      setScore((prev) => prev + points);

      sounds.playCorrect();

      // Update bucket count
      setBucketCounts((prev) => ({
        ...prev,
        [chosenCategoryKey]: (prev[chosenCategoryKey] || 0) + 1,
      }));

      const record: UserAnswerRecord = {
        item: currentItem,
        chosenCategoryKey,
        isCorrect: true,
        timestamp: Date.now(),
      };
      const updatedAnswers = [...userAnswers, record];
      setUserAnswers(updatedAnswers);

      setFeedback({
        status: 'correct',
        chosenCategoryKey,
        pointsGained: points,
        explanationGu: currentItem.explanationGu,
        explanationEn: currentItem.explanationEn,
      });

      // Automatically proceed after 900ms for swift gameplay
      setTimeout(() => {
        proceedToNext(updatedAnswers);
      }, 950);
    } else {
      setStreak(0);
      sounds.playIncorrect();

      const record: UserAnswerRecord = {
        item: currentItem,
        chosenCategoryKey,
        isCorrect: false,
        timestamp: Date.now(),
      };
      const updatedAnswers = [...userAnswers, record];
      setUserAnswers(updatedAnswers);

      setFeedback({
        status: 'incorrect',
        chosenCategoryKey,
        pointsGained: 0,
        explanationGu: currentItem.explanationGu,
        explanationEn: currentItem.explanationEn,
      });
      // For mistakes, we keep feedback open so student reads the scientific explanation!
    }
  };

  const proceedToNext = (answersToSubmit?: UserAnswerRecord[]) => {
    setFeedback(null);
    const answers = answersToSubmit || userAnswers;
    if (currentIndex + 1 >= items.length) {
      sounds.playLevelComplete();
      onFinish(answers, score, timeSpentSec);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Keyboard shortcut support (1, 2, 3...)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (feedback?.status === 'incorrect') {
        if (e.key === 'Enter' || e.key === ' ') {
          proceedToNext();
        }
        return;
      }
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= topic.categories.length) {
        const cat = topic.categories[num - 1];
        if (cat) {
          handleClassify(cat.key);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [feedback, currentIndex, topic, userAnswers, score, streak]);

  const progressPercent = Math.round((currentIndex / items.length) * 100);

  // Category Color Map
  const getCategoryStyles = (color: string) => {
    switch (color) {
      case 'emerald':
        return {
          bg: 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-300 text-emerald-950',
          dropActive: 'ring-4 ring-emerald-400 bg-emerald-100',
          badge: 'bg-emerald-200 text-emerald-900',
        };
      case 'rose':
        return {
          bg: 'bg-rose-50 hover:bg-rose-100/70 border-rose-300 text-rose-950',
          dropActive: 'ring-4 ring-rose-400 bg-rose-100',
          badge: 'bg-rose-200 text-rose-900',
        };
      case 'blue':
        return {
          bg: 'bg-blue-50 hover:bg-blue-100/70 border-blue-300 text-blue-950',
          dropActive: 'ring-4 ring-blue-400 bg-blue-100',
          badge: 'bg-blue-200 text-blue-900',
        };
      case 'purple':
        return {
          bg: 'bg-purple-50 hover:bg-purple-100/70 border-purple-300 text-purple-950',
          dropActive: 'ring-4 ring-purple-400 bg-purple-100',
          badge: 'bg-purple-200 text-purple-900',
        };
      case 'amber':
      default:
        return {
          bg: 'bg-amber-50 hover:bg-amber-100/70 border-amber-300 text-amber-950',
          dropActive: 'ring-4 ring-amber-400 bg-amber-100',
          badge: 'bg-amber-200 text-amber-900',
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <button
          onClick={() => {
            sounds.playClick();
            onBackToHome();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        >
          <Home className="w-4 h-4 text-slate-500" />
          <span>મુખ્ય મેનૂ</span>
        </button>

        <div className="flex-1 max-w-xs text-center">
          <h2 className="text-sm font-bold text-slate-800 line-clamp-1">
            {topic.titleGu}
          </h2>
          <div className="text-[11px] text-emerald-700 font-semibold">
            {topic.chapterGu}
          </div>
        </div>

        {/* Score & Streak */}
        <div className="flex items-center gap-2">
          {streak > 1 && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-2.5 py-1 bg-orange-100 border border-orange-300 rounded-lg text-orange-800 text-xs font-bold"
            >
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-bounce" />
              <span>{streak}x સ્ટ્રીક</span>
            </motion.div>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>{score} ગુણ</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-1.5">
          <span>
            પ્રશ્ન {currentIndex + 1} / {items.length}
          </span>
          <span>{progressPercent}% પૂર્ણ</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Playing Arena */}
      <div className="relative">
        {/* Active Question Card */}
        <div className="mb-8">
          <div className="text-center text-xs text-slate-500 mb-2 font-medium">
            👇 આ પદાર્થ/સજીવને સાચા જૂથમાં ખેંચો (Drag) અથવા નીચેના બટન પર ક્લિક કરો
          </div>

          <AnimatePresence mode="wait">
            {currentItem && (
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                draggable={!feedback}
                onDragStart={(e: unknown) => {
                  setIsDragging(true);
                  const dragEvt = e as React.DragEvent;
                  if (dragEvt?.dataTransfer) {
                    dragEvt.dataTransfer.setData('text/plain', currentItem.id);
                  }
                }}
                onDragEnd={() => setIsDragging(false)}
                className={`max-w-md mx-auto bg-white rounded-3xl border-2 border-slate-200/90 shadow-lg p-6 sm:p-8 text-center cursor-grab active:cursor-grabbing transition-all select-none ${
                  isDragging ? 'opacity-50 scale-95 border-dashed border-emerald-400' : 'hover:border-emerald-300'
                }`}
              >
                {/* Large Emoji / Icon */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-4xl sm:text-5xl shadow-inner mb-4 group-hover:scale-105 transition-transform">
                  <span>{currentItem.emoji || '🔬'}</span>
                </div>

                {/* Gujarati Name */}
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
                  {currentItem.nameGu}
                </h3>

                {/* English Subtitle */}
                {showEnglish && (
                  <p className="text-sm sm:text-base text-slate-500 font-medium italic mb-2">
                    {currentItem.nameEn}
                  </p>
                )}

                {/* Helper action buttons: Audio Read Aloud & Hint */}
                <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      speakText(currentItem.nameGu, 'gu-IN');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    title="શબ્દ સાંભળો (Speak text aloud)"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>સાંભળો</span>
                  </button>

                  {currentItem.hintGu && (
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        showHint
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      title="સંકેત જુઓ"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <span>{showHint ? 'સંકેત છુપાવો' : 'સંકેત (Hint)'}</span>
                    </button>
                  )}
                </div>

                {/* Collapsible Hint Drawer */}
                {showHint && currentItem.hintGu && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-left text-xs text-amber-900 font-medium leading-relaxed"
                  >
                    <div className="font-bold flex items-center gap-1 mb-0.5">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                      <span>મદદ સંકેત:</span>
                    </div>
                    <p>{currentItem.hintGu}</p>
                    {showEnglish && currentItem.hintEn && (
                      <p className="text-[11px] text-amber-800/80 italic mt-0.5">
                        {currentItem.hintEn}
                      </p>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Classification Buckets / Drop Zones */}
        <div className="mt-6">
          <div className="text-center text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">
            સાચું જૂથ પસંદ કરો ({topic.categories.length} વિકલ્પો)
          </div>

          <div
            className={`grid gap-3 sm:gap-4 ${
              topic.categories.length === 2
                ? 'grid-cols-1 sm:grid-cols-2'
                : topic.categories.length === 3
                ? 'grid-cols-1 sm:grid-cols-3'
                : 'grid-cols-2 sm:grid-cols-4'
            }`}
          >
            {topic.categories.map((cat, idx) => {
              const styles = getCategoryStyles(cat.color);
              const isOver = dragOverCategory === cat.key;
              const count = bucketCounts[cat.key] || 0;

              return (
                <div
                  key={cat.key}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverCategory(cat.key);
                  }}
                  onDragLeave={() => setDragOverCategory(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverCategory(null);
                    handleClassify(cat.key);
                  }}
                  onClick={() => handleClassify(cat.key)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md active:scale-98 ${
                    styles.bg
                  } ${isOver ? styles.dropActive : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-white/80 border border-slate-200/50 text-slate-700">
                      કી {idx + 1}
                    </span>
                    {count > 0 && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${styles.badge}`}>
                        {count} સાચા
                      </span>
                    )}
                  </div>

                  <div className="text-center my-2">
                    <h4 className="text-base sm:text-lg font-extrabold tracking-tight">
                      {cat.labelGu}
                    </h4>
                    {showEnglish && (
                      <p className="text-xs text-slate-500 font-medium italic mt-0.5">
                        {cat.labelEn}
                      </p>
                    )}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200/40 text-center">
                    <span className="text-[11px] font-semibold text-slate-500">
                      અહીં મૂકો (Tap / Drop)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Immediate Feedback Modal / Notification Drawer */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
            >
              <div
                className={`max-w-md w-full rounded-3xl p-6 sm:p-7 shadow-2xl text-center border-2 ${
                  feedback.status === 'correct'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                    : 'bg-white border-rose-400 text-slate-900'
                }`}
              >
                {/* Status Icon */}
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3">
                  {feedback.status === 'correct' ? (
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shadow-md">
                      <XCircle className="w-10 h-10" />
                    </div>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-black mb-1">
                  {feedback.status === 'correct'
                    ? 'ખૂબ સરસ! સાચો જવાબ! 🎉'
                    : 'અરેરે! જવાબ ખોટો છે 🤔'}
                </h3>

                {feedback.status === 'correct' ? (
                  <div className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full mb-3">
                    <Sparkles className="w-4 h-4 fill-emerald-600" />
                    <span>+{feedback.pointsGained} પોઇન્ટ્સ મળ્યા</span>
                  </div>
                ) : (
                  <div className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full inline-block mb-3">
                    સાચું જૂથ:{' '}
                    <span className="font-extrabold underline">
                      {topic.categories.find((c) => c.key === currentItem.categoryKey)?.labelGu}
                    </span>
                  </div>
                )}

                {/* Scientific Explanation Box */}
                <div className="bg-white/90 rounded-2xl p-4 border border-slate-200 text-left text-xs sm:text-sm text-slate-700 leading-relaxed shadow-inner my-3">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                    <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span>વિજ્ઞાન સમજૂતી (શા માટે?):</span>
                  </div>
                  <p className="font-medium text-slate-800">{feedback.explanationGu}</p>
                  {showEnglish && feedback.explanationEn && (
                    <p className="text-xs text-slate-500 italic mt-1 border-t border-slate-100 pt-1">
                      {feedback.explanationEn}
                    </p>
                  )}
                </div>

                {/* Next Button */}
                <div className="mt-4">
                  <button
                    onClick={() => proceedToNext()}
                    className={`w-full py-3 px-6 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      feedback.status === 'correct'
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>આગળનો પ્રશ્ન</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="text-[11px] text-slate-400 mt-2">
                    Enter અથવા Space કી દબાવીને પણ આગળ વધી શકો છો
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
