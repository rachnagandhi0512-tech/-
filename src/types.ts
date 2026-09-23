export type GradeLevel = 'std6' | 'std7' | 'std8' | 'all';

export interface ClassificationItem {
  id: string;
  nameGu: string;
  nameEn: string;
  categoryKey: string;
  emoji?: string;
  hintGu?: string;
  hintEn?: string;
  explanationGu: string;
  explanationEn?: string;
}

export interface ClassificationCategory {
  key: string;
  labelGu: string;
  labelEn: string;
  color: 'emerald' | 'amber' | 'blue' | 'purple' | 'rose' | 'teal' | 'orange';
  iconName?: string;
}

export interface ClassificationTopic {
  id: string;
  grade: 'std6' | 'std7' | 'std8';
  subjectGu: string; // e.g. "વિજ્ઞાન" (Science) or "સામાજિક વિજ્ઞાન"
  subjectEn: string;
  chapterGu: string;
  titleGu: string;
  titleEn: string;
  descriptionGu: string;
  descriptionEn: string;
  categories: ClassificationCategory[];
  items: ClassificationItem[];
  icon: string;
}

export interface UserAnswerRecord {
  item: ClassificationItem;
  chosenCategoryKey: string;
  isCorrect: boolean;
  timestamp: number;
}
