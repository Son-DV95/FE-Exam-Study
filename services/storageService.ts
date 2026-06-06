
import type { Question } from '../types';

const STORAGE_KEY = 'fe_exam_saved_questions';

export const getSavedQuestions = (): Question[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load saved questions:', error);
    return [];
  }
};

export const saveQuestion = (question: Question): Question[] => {
  let current: Question[] = [];
  try {
    current = getSavedQuestions();
    // Avoid duplicates based on question text (Japanese)
    if (!current.some(q => q.questionText.ja === question.questionText.ja)) {
      const updated = [...current, question];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    }
    return current;
  } catch (error) {
    console.error('Failed to save question:', error);
    return current;
  }
};

export const removeQuestion = (questionTextJa: string): Question[] => {
  try {
    const current = getSavedQuestions();
    const updated = current.filter(q => q.questionText.ja !== questionTextJa);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to remove question:', error);
    return [];
  }
};

export const isQuestionSaved = (question: Question): boolean => {
    const current = getSavedQuestions();
    return current.some(q => q.questionText.ja === question.questionText.ja);
}

// Function to export saved questions to a JSON file
export const exportBackup = () => {
  try {
    const questions = getSavedQuestions();
    const dataStr = JSON.stringify(questions, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `fe_exam_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export failed", error);
    alert("バックアップの作成に失敗しました。");
  }
};

// Function to import saved questions from a JSON file
export const importBackup = (file: File): Promise<Question[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const importedQuestions = JSON.parse(json);
        
        if (!Array.isArray(importedQuestions)) {
          throw new Error("Invalid file format");
        }
        
        // Basic validation check (check for first item structure)
        if (importedQuestions.length > 0 && (!importedQuestions[0].questionText || !importedQuestions[0].options)) {
             throw new Error("Invalid question data structure");
        }

        // Merge with existing
        const current = getSavedQuestions();
        const existingIds = new Set(current.map(q => q.questionText.ja));
        
        const newQuestions = importedQuestions.filter(q => !existingIds.has(q.questionText.ja));
        const merged = [...current, ...newQuestions];
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        resolve(merged);
      } catch (error) {
        console.error("Import failed", error);
        reject(error);
      }
    };
    reader.readAsText(file);
  });
};
