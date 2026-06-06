
import React, { useState, useEffect } from 'react';
import type { Question } from '../types';
import LoadingIcon from './LoadingIcon';
import { AIChatModal } from './AIChatModal';
import { SparklesIcon, BookmarkIcon, TrashIcon } from './icons/Icons';

interface QuestionDisplayProps {
  topicTitle: string;
  question: Question | null;
  isLoading: boolean;
  error: string | null;
  showAnswer: boolean;
  setShowAnswer: (show: boolean) => void;
  onNextQuestion: () => void;
  isSaved: boolean;
  onSave: () => void;
  onRemove: () => void;
}

const optionLetters = ['ア', 'イ', 'ウ', 'エ'];

const LanguageLabel: React.FC<{ lang: string; emoji: string; color: string }> = ({ lang, emoji, color }) => (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 ${color} opacity-80 mb-1 select-none`}>
        <span role="img" aria-label={lang}>{emoji}</span> {lang}
    </span>
);

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  topicTitle,
  question,
  isLoading,
  error,
  showAnswer,
  setShowAnswer,
  onNextQuestion,
  isSaved,
  onSave,
  onRemove
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);

  // Reset selection when question changes
  useEffect(() => {
    setSelectedOptionIndex(null);
  }, [question]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingIcon />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-500 text-red-300 p-6 rounded-lg text-center">
        <h3 className="text-xl font-bold mb-2">エラーが発生しました</h3>
        <p>{error}</p>
        <button
          onClick={onNextQuestion}
          className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
        >
          もう一度試す
        </button>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center p-6 bg-slate-800 rounded-lg">
        <p>問題が見つかりませんでした。トピックを選択してください。</p>
      </div>
    );
  }

  const handleOptionClick = (index: number) => {
      if (!showAnswer) {
          setSelectedOptionIndex(index);
      }
  };

  return (
    <>
      <div className="bg-slate-800 shadow-lg rounded-xl p-6 md:p-8 relative">
        <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-cyan-400">{topicTitle}</h2>
            <div className="flex gap-2">
                 {isSaved ? (
                     <button 
                        onClick={onRemove}
                        className="p-2 bg-slate-700/50 hover:bg-red-900/50 text-slate-400 hover:text-red-400 rounded-full transition-colors"
                        title="保存を取り消す"
                     >
                        <BookmarkIcon solid className="w-6 h-6 text-yellow-500" />
                     </button>
                 ) : (
                     <button 
                        onClick={onSave}
                        className="p-2 bg-slate-700/50 hover:bg-slate-600 text-slate-400 hover:text-yellow-400 rounded-full transition-colors"
                        title="問題を保存する"
                     >
                        <BookmarkIcon className="w-6 h-6" />
                     </button>
                 )}
            </div>
        </div>
        
        {question.imageUrl && (
            <div className="mb-6 border border-slate-700 rounded-lg p-2 bg-slate-900">
                <img 
                    src={question.imageUrl} 
                    alt="Question illustration" 
                    className="max-w-full h-auto rounded-md mx-auto" 
                />
            </div>
        )}

        <div className="mb-8 space-y-4">
            <div className="bg-slate-700/30 p-4 rounded-lg border-l-4 border-cyan-500">
                <p className="text-lg text-slate-100 font-medium leading-relaxed mb-2">
                    {question.questionText.ja}
                </p>
                <div className="space-y-2 mt-3 pt-3 border-t border-slate-700/50">
                    <div>
                        <LanguageLabel lang="VI" emoji="🇻🇳" color="text-green-300" />
                        <p className="text-slate-300 text-sm leading-relaxed">{question.questionText.vi}</p>
                    </div>
                    <div>
                        <LanguageLabel lang="EN" emoji="🇺🇸" color="text-blue-300" />
                        <p className="text-slate-400 text-sm leading-relaxed">{question.questionText.en}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-6">
          {question.options.ja.map((optionJa, index) => {
            const isCorrect = index === question.correctAnswerIndex;
            const isSelected = index === selectedOptionIndex;
            const optionVi = question.options.vi[index];
            const optionEn = question.options.en[index];
            
            let optionClass = "bg-slate-700 border-slate-600 cursor-pointer hover:bg-slate-600";
            let indicatorColor = "text-cyan-400";
            
            if (showAnswer) {
                // Logic after answer is shown
                if (isCorrect) {
                    optionClass = "bg-green-900/40 border-green-500";
                    indicatorColor = "text-green-400";
                } else if (isSelected) {
                    optionClass = "bg-red-900/40 border-red-500";
                    indicatorColor = "text-red-400";
                } else {
                    optionClass = "bg-slate-800/50 border-transparent opacity-60";
                    indicatorColor = "text-slate-500";
                }
            } else {
                // Logic before answer is shown (Selection)
                if (isSelected) {
                    optionClass = "bg-cyan-900/30 border-cyan-400 ring-1 ring-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]";
                    indicatorColor = "text-cyan-300";
                }
            }
            
            return (
              <div 
                key={index} 
                onClick={() => handleOptionClick(index)}
                className={`relative flex items-start p-4 border rounded-lg transition-all duration-200 ${optionClass}`}
              >
                <span className={`font-bold text-xl mr-4 mt-0.5 ${indicatorColor}`}>
                    {optionLetters[index]}
                </span>
                <div className="flex-1 space-y-1">
                    <p className="text-slate-100 font-medium text-base">{optionJa}</p>
                    <div className="flex flex-col gap-0.5 text-sm">
                        <p className="text-slate-300"><span className="opacity-50 mr-1">🇻🇳</span>{optionVi}</p>
                        <p className="text-slate-400"><span className="opacity-50 mr-1">🇺🇸</span>{optionEn}</p>
                    </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-slate-700 pt-6">
          {showAnswer && (
            <div className="mb-6 animate-fade-in bg-slate-900/50 p-5 rounded-lg border border-slate-700/50">
              <h3 className="text-lg font-bold mb-3 text-green-400 flex items-center gap-2">
                <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                解説
              </h3>
              <div className="space-y-4">
                  <div>
                      <p className="text-slate-200 leading-relaxed mb-2">{question.explanation.ja}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-700/50">
                      <div>
                        <LanguageLabel lang="VI" emoji="🇻🇳" color="text-green-300" />
                        <p className="text-slate-300 text-sm leading-relaxed">{question.explanation.vi}</p>
                      </div>
                      <div>
                        <LanguageLabel lang="EN" emoji="🇺🇸" color="text-blue-300" />
                        <p className="text-slate-400 text-sm leading-relaxed">{question.explanation.en}</p>
                      </div>
                  </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 shadow-lg shadow-cyan-900/20"
              >
                答えを表示
              </button>
            ) : (
              <button
                onClick={() => setIsChatOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 shadow-lg shadow-indigo-900/20"
                >
                <SparklesIcon className="w-5 h-5"/>
                AIに質問する
              </button>
            )}
            <button
              onClick={onNextQuestion}
              className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75 shadow-lg shadow-slate-900/20"
            >
              次の問題へ
            </button>
          </div>
        </div>
      </div>
      <AIChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        question={question}
      />
    </>
  );
};
