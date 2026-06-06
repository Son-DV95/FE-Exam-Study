
import type React from 'react';

export interface Topic {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface LocalizedContent {
  ja: string;
  en: string;
  vi: string;
}

export interface Question {
  questionText: LocalizedContent;
  options: {
    ja: string[];
    en: string[];
    vi: string[];
  };
  correctAnswerIndex: number;
  explanation: LocalizedContent;
  imageUrl?: string;
}
