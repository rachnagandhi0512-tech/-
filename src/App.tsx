import React, { useState, useEffect, useMemo } from 'react';
import { ClassificationTopic, GradeLevel, UserAnswerRecord } from './types';
import { CURRICULUM_TOPICS } from './data/topics';
import { Header } from './components/Header';
import { TopicCard } from './components/TopicCard';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { CertificateModal } from './components/CertificateModal';
import { CustomTopicModal } from './components/CustomTopicModal';
import { sounds } from './utils/audio';
import {
  Sparkles,
  Search,
  BookOpen,
  Award,
  Zap,
  CheckCircle,
  HelpCircle,
  Layers,
  GraduationCap,
} from 'lucide-react';

export default function App() {
  const [currentGrade, setCurrentGrade] = useState<GradeLevel>('all');
  const [showEnglish, setShowEnglish] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Custom topics from local storage
  const [customTopics, setCustomTopics] = useState<ClassificationTopic[]>(() => {
    try {
      const saved = localStorage.getItem('vargikaran_custom_topics');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Best scores from local storage
  const [bestScores, setBestScores] = useState<
    Record<string, { stars: number; score: number; completedAt: number }>
  >(() => {
    try {
      const saved = localStorage.getItem('vargikaran_best_scores');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Active game session
  const [activeTopic, setActiveTopic] = useState<ClassificationTopic | null>(null);
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'result'>('lobby');
  const [lastAnswers, setLastAnswers] = useState<UserAnswerRecord[]>([]);
  const [lastScore, setLastScore] = useState(0);
  const [lastTimeSec, setLastTimeSec] = useState(0);

  // Modals
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Sync sound manager
  useEffect(() => {
    sounds.setSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  // Combined topic pool
  const allTopics = useMemo(() => {
    return [...customTopics, ...CURRICULUM_TOPICS];
  }, [customTopics]);

  // Filtered topics based on grade & search query
  const filteredTopics = useMemo(() => {
    return allTopics.filter((topic) => {
      const matchesGrade = currentGrade === 'all' || topic.grade === currentGrade;
      if (!matchesGrade) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        topic.titleGu.toLowerCase().includes(q) ||
        topic.titleEn.toLowerCase().includes(q) ||
        topic.chapterGu.toLowerCase().includes(q) ||
        topic.descriptionGu.toLowerCase().includes(q) ||
        topic.categories.some((c) => c.labelGu.toLowerCase().includes(q))
      );
    });
  }, [allTopics, currentGrade, searchQuery]);

  // Total points
  const totalScore = useMemo(() => {
    return Object.values(bestScores).reduce((acc, curr) => acc + curr.score, 0);
  }, [bestScores]);

  // Handlers
  const handleSelectTopic = (topic: ClassificationTopic) => {
    setActiveTopic(topic);
    setGameState('playing');
  };

  const handleFinishGame = (
    answers: UserAnswerRecord[],
    score: number,
    timeSpentSec: number
  ) => {
    setLastAnswers(answers);
    setLastScore(score);
    setLastTimeSec(timeSpentSec);
    setGameState('result');

    if (activeTopic) {
      const correctCount = answers.filter((a) => a.isCorrect).length;
      const accuracy = answers.length > 0 ? (correctCount / answers.length) * 100 : 0;
      const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1;

      const previous = bestScores[activeTopic.id];
      if (!previous || score > previous.score) {
        const updated = {
          ...bestScores,
          [activeTopic.id]: {
            stars,
            score,
            completedAt: Date.now(),
          },
        };
        setBestScores(updated);
        try {
          localStorage.setItem('vargikaran_best_scores', JSON.stringify(updated));
        } catch {
          // ignore storage quota error
        }
      }
    }
  };

  const handlePlayAgain = () => {
    if (activeTopic) {
      setGameState('playing');
    }
  };

  const handlePracticeMistakes = (mistakes: UserAnswerRecord[]) => {
    if (!activeTopic) return;
    const practiceTopic: ClassificationTopic = {
      ...activeTopic,
      id: `${activeTopic.id}-practice-${Date.now()}`,
      titleGu: `${activeTopic.titleGu} (પુનરાવર્તન)`,
      titleEn: `${activeTopic.titleEn} (Practice)`,
      items: mistakes.map((m) => m.item),
    };
    setActiveTopic(practiceTopic);
    setGameState('playing');
  };

  const handleBackToHome = () => {
    setActiveTopic(null);
    setGameState('lobby');
  };

  const handleSaveCustomTopic = (newTopic: ClassificationTopic) => {
    const updated = [newTopic, ...customTopics];
    setCustomTopics(updated);
    try {
      localStorage.setItem('vargikaran_custom_topics', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setActiveTopic(newTopic);
    setGameState('playing');
  };

  // Launch Mega Mixed Challenge
  const handleLaunchMixMegaChallenge = () => {
    sounds.playClick();
    // Gather 12 random questions from across Std 6, 7, 8
    const sampleItems = CURRICULUM_TOPICS.flatMap((t) => t.items)
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);

    // Create a 2-group binary challenge: e.g. "કુદરતી કે રાસાયણિક / વિજ્ઞાન મિશ્ર"
    // Better: Pick 2 random topics and play one!
    const randomTopic = CURRICULUM_TOPICS[Math.floor(Math.random() * CURRICULUM_TOPICS.length)];
    handleSelectTopic(randomTopic);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Persistent Navigation Header */}
      <Header
        currentGrade={currentGrade}
        onSelectGrade={(g) => setCurrentGrade(g)}
        showEnglish={showEnglish}
        onToggleEnglish={() => setShowEnglish(!showEnglish)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
        onGoHome={handleBackToHome}
        totalScore={totalScore}
      />

      {/* Main Body */}
      <main className="flex-1">
        {gameState === 'playing' && activeTopic && (
          <GameScreen
            topic={activeTopic}
            onFinish={handleFinishGame}
            onBackToHome={handleBackToHome}
            showEnglish={showEnglish}
            soundEnabled={soundEnabled}
          />
        )}

        {gameState === 'result' && activeTopic && (
          <ResultScreen
            topic={activeTopic}
            answers={lastAnswers}
            score={lastScore}
            timeSpentSec={lastTimeSec}
            onPlayAgain={handlePlayAgain}
            onPracticeMistakes={handlePracticeMistakes}
            onBackToHome={handleBackToHome}
            onOpenCertificate={() => setIsCertificateOpen(true)}
            showEnglish={showEnglish}
          />
        )}

        {gameState === 'lobby' && (
          <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
            {/* Hero Banner for Science Classification */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-6 sm:p-10 mb-8 shadow-xl">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-bold mb-3">
                  <GraduationCap className="w-4 h-4 text-emerald-300" />
                  <span>ગુજરાત રાજ્ય શિક્ષણ બોર્ડ (GSEB / NCERT) વિજ્ઞાન</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  ધોરણ ૬ થી ૮ વિજ્ઞાન વર્ગીકરણ રમત
                </h1>
                <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  ખોરાક, પદાર્થો, ચુંબક, એસિડ-બેઇઝ, ભૌતિક-રાસાયણિક ફેરફાર, ખરીફ-રવિ પાક અને ધાતુ-અધાતુ જેવા મહત્વના વૈજ્ઞાનિક વિષયોને રમત-રમતમાં સરળતાથી શીખો અને વર્ગીકૃત કરો!
                </p>

                {/* Quick actions inside hero */}
                <div className="flex flex-wrap items-center gap-3 mt-5">
                  <button
                    onClick={handleLaunchMixMegaChallenge}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm font-extrabold rounded-xl shadow-lg shadow-amber-500/25 transition-all hover:scale-102 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>રેન્ડમ વિજ્ઞાન ક્વિઝ રમો</span>
                  </button>

                  <button
                    onClick={() => setIsCustomModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl border border-white/20 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>શિક્ષક / વિદ્યાર્થી મોડ</span>
                  </button>
                </div>
              </div>

              {/* Decorative background shapes */}
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center pointer-events-none">
                <span className="text-9xl">🔬</span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="વિષય શોધો (દા.ત. એસિડ, પાક, ધાતુ, ચુંબક, રેશમ...)"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden shadow-2xs"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>
                  કુલ {filteredTopics.length} વિજ્ઞાન વિષયો ઉપલબ્ધ
                </span>
              </div>
            </div>

            {/* Topics Grid */}
            {filteredTopics.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-3xl mb-3">
                  🔍
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  કોઈ વિષય મળ્યો નથી
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  કૃપા કરીને અન્ય શબ્દ વડે શોધો અથવા બધા ધોરણો પસંદ કરો.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentGrade('all');
                  }}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  તમામ વિષયો બતાવો
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTopics.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    onSelect={handleSelectTopic}
                    showEnglish={showEnglish}
                    bestScore={bestScores[topic.id]}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Certificate Modal */}
      {isCertificateOpen && activeTopic && (
        <CertificateModal
          topic={activeTopic}
          score={lastScore}
          accuracy={
            lastAnswers.length > 0
              ? Math.round(
                  (lastAnswers.filter((a) => a.isCorrect).length /
                    lastAnswers.length) *
                    100
                )
              : 100
          }
          onClose={() => setIsCertificateOpen(false)}
          showEnglish={showEnglish}
        />
      )}

      {/* Custom Topic Modal */}
      <CustomTopicModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSave={handleSaveCustomTopic}
      />

      {/* Minimal Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            ધોરણ ૬ થી ૮ વિજ્ઞાન શિક્ષણ સહાયક • GCERT / GSEB અભ્યાસક્રમ આધારિત વર્ગીકરણ
          </p>
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
            <span>વિદ્યાર્થીઓ અને શિક્ષકો માટે ઉપયોગી</span>
            <span>•</span>
            <span>ગુજરાતી ભાષા સપોર્ટ</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
