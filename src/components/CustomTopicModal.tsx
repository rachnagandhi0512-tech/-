import React, { useState } from 'react';
import { ClassificationTopic, ClassificationCategory, ClassificationItem } from '../types';
import { X, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface CustomTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (topic: ClassificationTopic) => void;
}

export const CustomTopicModal: React.FC<CustomTopicModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [grade, setGrade] = useState<'std6' | 'std7' | 'std8'>('std6');
  const [chapter, setChapter] = useState('વિજ્ઞાન પ્રકરણ');
  const [title, setTitle] = useState('');
  const [cat1, setCat1] = useState('');
  const [cat2, setCat2] = useState('');
  const [items, setItems] = useState<
    Array<{ name: string; category: 'cat1' | 'cat2'; explanation: string }>
  >([
    { name: '', category: 'cat1', explanation: '' },
    { name: '', category: 'cat2', explanation: '' },
  ]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems((prev) => [...prev, { name: '', category: 'cat1', explanation: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !cat1.trim() || !cat2.trim()) {
      alert('કૃપા કરીને વિષયનું નામ અને બંને જૂથોના નામ દાખલ કરો.');
      return;
    }

    const validItems = items.filter((it) => it.name.trim().length > 0);
    if (validItems.length < 2) {
      alert('કૃપા કરીને ઓછામાં ઓછા ૨ પ્રશ્ન પદાર્થો ઉમેરો.');
      return;
    }

    const categories: ClassificationCategory[] = [
      { key: 'cat1', labelGu: cat1.trim(), labelEn: cat1.trim(), color: 'emerald' },
      { key: 'cat2', labelGu: cat2.trim(), labelEn: cat2.trim(), color: 'rose' },
    ];

    const parsedItems: ClassificationItem[] = validItems.map((it, idx) => ({
      id: `custom-${Date.now()}-${idx}`,
      nameGu: it.name.trim(),
      nameEn: it.name.trim(),
      categoryKey: it.category,
      emoji: '🔬',
      explanationGu: it.explanation.trim() || `${it.name.trim()} એ ${it.category === 'cat1' ? cat1 : cat2} જૂથમાં આવે છે.`,
      explanationEn: `${it.name.trim()} belongs to ${it.category === 'cat1' ? cat1 : cat2}.`,
    }));

    const newTopic: ClassificationTopic = {
      id: `custom-topic-${Date.now()}`,
      grade,
      subjectGu: 'વિજ્ઞાન (શિક્ષક રચિત)',
      subjectEn: 'Science (Teacher Created)',
      chapterGu: chapter.trim() || 'વિશેષ વર્ગીકરણ',
      titleGu: title.trim(),
      titleEn: title.trim(),
      descriptionGu: 'શિક્ષક અથવા વિદ્યાર્થી દ્વારા તૈયાર કરાયેલ વર્ગીકરણ.',
      descriptionEn: 'Custom classification challenge.',
      categories,
      items: parsedItems,
      icon: 'Sparkles',
    };

    sounds.playCorrect();
    onSave(newTopic);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-200" />
            <h3 className="font-bold text-lg">નવું વર્ગીકરણ ઉમેરો (શિક્ષક / વિદ્યાર્થી મોડ)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Grade selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              ધોરણ પસંદ કરો
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['std6', 'std7', 'std8'] as const).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    grade === g
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {g === 'std6' ? 'ધોરણ ૬' : g === 'std7' ? 'ધોરણ ૭' : 'ધોરણ ૮'}
                </button>
              ))}
            </div>
          </div>

          {/* Chapter & Topic Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                પ્રકરણનું નામ
              </label>
              <input
                type="text"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="દા.ત. પ્રકરણ ૪: પદાર્થો"
                className="w-full text-xs font-medium px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                વર્ગીકરણ વિષયનું નામ *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="દા.ત. દ્રાવ્ય અને અદ્રાવ્ય પદાર્થો"
                className="w-full text-xs font-medium px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* 2 Categories */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              વર્ગીકરણના બે જૂથો (Categories)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-emerald-800 mb-1">
                  જૂથ ૧ (દા.ત. પાણીમાં દ્રાવ્ય)
                </label>
                <input
                  type="text"
                  required
                  value={cat1}
                  onChange={(e) => setCat1(e.target.value)}
                  placeholder="જૂથ ૧ નું નામ"
                  className="w-full text-xs font-medium px-3 py-2 border border-emerald-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-rose-800 mb-1">
                  જૂથ ૨ (દા.ત. પાણીમાં અદ્રાવ્ય)
                </label>
                <input
                  type="text"
                  required
                  value={cat2}
                  onChange={(e) => setCat2(e.target.value)}
                  placeholder="જૂથ ૨ નું નામ"
                  className="w-full text-xs font-medium px-3 py-2 border border-rose-300 rounded-xl bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Items list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                પદાર્થો / સજીવોની યાદી ({items.length})
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 text-xs text-emerald-700 font-bold hover:text-emerald-800 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>નવો પદાર્થ ઉમેરો</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {items.map((it, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                >
                  <input
                    type="text"
                    required
                    value={it.name}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[idx].name = e.target.value;
                      setItems(updated);
                    }}
                    placeholder={`પદાર્થ ${idx + 1} (દા.ત. મીઠું)`}
                    className="flex-1 text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden"
                  />

                  <select
                    value={it.category}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[idx].category = e.target.value as 'cat1' | 'cat2';
                      setItems(updated);
                    }}
                    className="text-xs font-medium px-2.5 py-1.5 border border-slate-300 rounded-lg bg-slate-50 focus:outline-hidden"
                  >
                    <option value="cat1">{cat1 || 'જૂથ ૧'}</option>
                    <option value="cat2">{cat2 || 'જૂથ ૨'}</option>
                  </select>

                  <input
                    type="text"
                    value={it.explanation}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[idx].explanation = e.target.value;
                      setItems(updated);
                    }}
                    placeholder="વૈજ્ઞાનિક સમજૂતી (શા માટે?)"
                    className="flex-1 text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden"
                  />

                  {items.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors self-end sm:self-center cursor-pointer"
                      title="કાઢી નાખો"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              રદ કરો
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>વર્ગીકરણ સાચવો અને રમો</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
