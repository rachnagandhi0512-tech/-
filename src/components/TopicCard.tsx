import React from 'react';
import { ClassificationTopic } from '../types';
import { Play, CheckCircle2, Star, Sparkles, BookOpen } from 'lucide-react';
import { sounds } from '../utils/audio';

interface TopicCardProps {
  topic: ClassificationTopic;
  onSelect: (topic: ClassificationTopic) => void;
  showEnglish: boolean;
  bestScore?: { stars: number; score: number; completedAt: number };
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  onSelect,
  showEnglish,
  bestScore,
}) => {
  const gradeLabel =
    topic.grade === 'std6'
      ? 'ધોરણ ૬'
      : topic.grade === 'std7'
      ? 'ધોરણ ૭'
      : 'ધોરણ ૮';

  const gradeColor =
    topic.grade === 'std6'
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : topic.grade === 'std7'
      ? 'bg-teal-50 text-teal-700 border-teal-200'
      : 'bg-purple-50 text-purple-700 border-purple-200';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div className="p-5 sm:p-6">
        {/* Top Meta Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${gradeColor}`}>
            {gradeLabel}
          </span>

          {bestScore ? (
            <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 text-xs font-semibold">
              <div className="flex">
                {[...Array(3)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < bestScore.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-amber-800 ml-1 font-bold">{bestScore.score} પૉઇન્ટ</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 font-medium">નવો વિષય</span>
          )}
        </div>

        {/* Chapter Title Kicker */}
        <div className="text-[12px] text-emerald-700 font-medium flex items-center gap-1.5 mb-1.5">
          <BookOpen className="w-3.5 h-3.5 shrink-0" />
          <span className="line-clamp-1">{topic.chapterGu}</span>
        </div>

        {/* Main Topic Name */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
          {topic.titleGu}
        </h3>
        {showEnglish && (
          <p className="text-xs text-slate-500 mt-0.5 italic font-medium">
            {topic.titleEn}
          </p>
        )}

        {/* Description */}
        <p className="text-xs sm:text-[13px] text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
          {topic.descriptionGu}
        </p>

        {/* Categories to sort into */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            વર્ગીકરણ જૂથો ({topic.categories.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {topic.categories.map((cat) => (
              <span
                key={cat.key}
                className="text-xs bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md border border-slate-200/60"
              >
                {cat.labelGu}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer with CTA */}
      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{topic.items.length} પ્રશ્નો</span>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            onSelect(topic);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs hover:shadow-emerald-500/25 transition-all group-hover:scale-102 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>શરૂ કરો</span>
        </button>
      </div>
    </div>
  );
};
