
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { TopicSidebar } from './components/TopicSidebar';
import { QuestionDisplay } from './components/QuestionDisplay';
import { AnalysisModal } from './components/AnalysisModal';
import { generateQuestion } from './services/geminiService';
import { pastExams } from './pastExams';
import { getSavedQuestions, saveQuestion, removeQuestion, exportBackup, importBackup } from './services/storageService';
import type { Question, Topic } from './types';
import { FE_TOPICS, ISTQB_TOPICS, TOPIC_ANALYSIS_DATA } from './constants';
import { ComputerIcon, ShieldIcon, DownloadIcon, UploadIcon } from './components/icons/Icons';

type Mode = 'ai' | 'past' | 'saved';
type ExamType = 'FE' | 'ISTQB';

const App: React.FC = () => {
  const [examType, setExamType] = useState<ExamType | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [questionKey, setQuestionKey] = useState<number>(0);
  const [mode, setMode] = useState<Mode>('ai');
  const [pastQuestionIndex, setPastQuestionIndex] = useState(0);
  const [savedQuestionIndex, setSavedQuestionIndex] = useState(0);
  const [savedQuestions, setSavedQuestions] = useState<Question[]>([]);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use a ref to access savedQuestions inside fetchQuestion without creating a dependency loop
  const savedQuestionsRef = useRef<Question[]>([]);

  // Load saved questions on mount
  useEffect(() => {
    const loaded = getSavedQuestions();
    setSavedQuestions(loaded);
    savedQuestionsRef.current = loaded;
  }, []);

  // Update ref whenever savedQuestions state changes
  useEffect(() => {
    savedQuestionsRef.current = savedQuestions;
  }, [savedQuestions]);

  const fetchQuestion = useCallback(async (topic: Topic) => {
    if (!examType) return;
    
    setIsLoading(true);
    setError(null);
    setShowAnswer(false);
    setCurrentQuestion(null);

    try {
      if (mode === 'ai') {
        const questionData = await generateQuestion(topic.name, examType);
        setCurrentQuestion(questionData);
        
        // Auto-save the generated question
        const updatedSaved = saveQuestion(questionData);
        setSavedQuestions(updatedSaved);

      } else if (mode === 'past') {
        const topicExams = pastExams[topic.id] || [];
        if (topicExams.length > 0) {
          const newIndex = pastQuestionIndex % topicExams.length;
          setCurrentQuestion(topicExams[newIndex]);
        } else {
          // This case should theoretically not happen if the button is hidden, 
          // but safe to handle just in case.
          setError(`このトピックの過去問はありません。`);
          setCurrentQuestion(null);
        }
      } else if (mode === 'saved') {
         const currentSaved = savedQuestionsRef.current;
         if (currentSaved.length > 0) {
             const newIndex = savedQuestionIndex % currentSaved.length;
             setCurrentQuestion(currentSaved[newIndex]);
         } else {
             setError('保存された問題はありません。');
             setCurrentQuestion(null);
         }
      }
    } catch (err) {
      console.error(err);
      setError('問題の生成に失敗しました。APIキーを確認して、もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  }, [mode, pastQuestionIndex, savedQuestionIndex, examType]); 

  // Trigger fetch only when specific triggers change
  useEffect(() => {
    if (selectedTopic && examType) {
      fetchQuestion(selectedTopic);
    }
  }, [selectedTopic, questionKey, examType]); 

  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setPastQuestionIndex(0); 
    setSavedQuestionIndex(0);
    setQuestionKey(prev => prev + 1); 
    // If in past mode and new topic has no past questions, switch to AI
    if (mode === 'past' && (!pastExams[topic.id] || pastExams[topic.id].length === 0)) {
        setMode('ai');
    }
  };
  
  const handleNextQuestion = () => {
    if (mode === 'past') {
      setPastQuestionIndex(prev => prev + 1);
    } else if (mode === 'saved') {
      setSavedQuestionIndex(prev => prev + 1);
    }
    setQuestionKey(prev => prev + 1);
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setPastQuestionIndex(0);
    setSavedQuestionIndex(0);
    setError(null); 
    setQuestionKey(prev => prev + 1); 
  };

  const handleSaveQuestion = () => {
      if (currentQuestion) {
          const updated = saveQuestion(currentQuestion);
          setSavedQuestions(updated);
      }
  };

  const handleRemoveQuestion = () => {
      if (currentQuestion) {
          const updated = removeQuestion(currentQuestion.questionText.ja);
          setSavedQuestions(updated);
          
          if (mode === 'saved') {
              if (updated.length === 0) {
                  setCurrentQuestion(null);
                  setError('保存された問題はありません。');
              } else {
                  if (savedQuestionIndex >= updated.length) {
                      setSavedQuestionIndex(0);
                  }
                  setQuestionKey(prev => prev + 1);
              }
          }
      }
  };

  const handleExamSelect = (type: ExamType) => {
      setExamType(type);
      setMode('ai');
      // Set default topic based on exam type
      const topics = type === 'FE' ? FE_TOPICS : ISTQB_TOPICS;
      setSelectedTopic(topics[0]);
      setQuestionKey(prev => prev + 1);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
          const updatedQuestions = await importBackup(file);
          setSavedQuestions(updatedQuestions);
          alert(`インポートが完了しました。${updatedQuestions.length}件の問題が保存されています。`);
          setQuestionKey(prev => prev + 1); // Refresh display
      } catch (error) {
          alert('インポートに失敗しました。ファイル形式を確認してください。');
      }
      // Reset input
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  };

  const isCurrentSaved = currentQuestion 
    ? savedQuestions.some(q => q.questionText.ja === currentQuestion.questionText.ja) 
    : false;

  const currentTopics = examType === 'FE' ? FE_TOPICS : ISTQB_TOPICS;
  
  // Logic to check if "Past" button should be visible
  const hasPastExams = selectedTopic && pastExams[selectedTopic.id] && pastExams[selectedTopic.id].length > 0;

  if (!examType) {
      return (
          <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
              <div className="max-w-3xl w-full text-center space-y-12">
                  <div className="space-y-4">
                      <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500">
                          IT Certification Study
                      </h1>
                      <p className="text-slate-400 text-lg md:text-xl">
                          Select your certification path to start practicing with AI-powered questions.
                      </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <button 
                        onClick={() => handleExamSelect('FE')}
                        className="group relative bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-cyan-500 rounded-2xl p-8 transition-all duration-300 shadow-xl hover:shadow-cyan-900/20 text-left"
                      >
                          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                              <ComputerIcon className="w-24 h-24 text-cyan-400" />
                          </div>
                          <h2 className="text-2xl font-bold text-white mb-2">FE Exam</h2>
                          <p className="text-cyan-400 font-medium mb-4">Japan IT Standard</p>
                          <p className="text-slate-400 text-sm">Fundamental Information Technology Engineer Examination. Covers basics of hardware, software, strategy, and management.</p>
                      </button>

                      <button 
                        onClick={() => handleExamSelect('ISTQB')}
                        className="group relative bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-indigo-500 rounded-2xl p-8 transition-all duration-300 shadow-xl hover:shadow-indigo-900/20 text-left"
                      >
                          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                              <ShieldIcon className="w-24 h-24 text-indigo-400" />
                          </div>
                          <h2 className="text-2xl font-bold text-white mb-2">ISTQB</h2>
                          <p className="text-indigo-400 font-medium mb-4">Software Testing</p>
                          <p className="text-slate-400 text-sm">International Software Testing Qualifications Board. Covers fundamentals of software testing, life cycles, and techniques.</p>
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="flex h-screen font-sans bg-slate-900 text-slate-100">
      <TopicSidebar 
        topics={currentTopics} 
        selectedTopic={selectedTopic} 
        onSelectTopic={handleSelectTopic}
        onOpenAnalysis={() => setIsAnalysisOpen(true)}
        onBackToHome={() => setExamType(null)}
      />
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                    {examType === 'FE' ? 'FE Exam Prep' : 'ISTQB Prep'}
                </h1>
                <p className="text-slate-400 text-sm mt-1">AI-Powered Practice</p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
                 <button 
                  onClick={() => handleModeChange('ai')}
                  className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all ${mode === 'ai' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                  AI New
                </button>
                
                {/* Only show Past button if data exists for the selected topic */}
                {hasPastExams && (
                    <button 
                    onClick={() => handleModeChange('past')}
                    className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all ${mode === 'past' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                    >
                    Past
                    </button>
                )}
                
                 <button 
                  onClick={() => handleModeChange('saved')}
                  className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all ${mode === 'saved' ? 'bg-green-600 text-white shadow-lg shadow-green-900/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                  Saved ({savedQuestions.length})
                </button>

                {/* Show Export/Import controls only in Saved mode */}
                {mode === 'saved' && (
                    <div className="flex gap-2 ml-2 border-l border-slate-700 pl-2">
                         <button 
                            onClick={exportBackup}
                            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="バックアップをダウンロード"
                         >
                             <DownloadIcon className="w-5 h-5" />
                         </button>
                         <label className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer" title="バックアップを復元">
                             <UploadIcon className="w-5 h-5" />
                             <input 
                                type="file" 
                                accept=".json" 
                                className="hidden" 
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                             />
                         </label>
                    </div>
                )}
            </div>
          </header>

          <QuestionDisplay
            topicTitle={mode === 'saved' ? 'Saved Questions' : (selectedTopic?.name || '')}
            question={currentQuestion}
            isLoading={isLoading}
            error={error}
            showAnswer={showAnswer}
            setShowAnswer={setShowAnswer}
            onNextQuestion={handleNextQuestion}
            isSaved={isCurrentSaved}
            onSave={handleSaveQuestion}
            onRemove={handleRemoveQuestion}
          />
        </div>
      </main>
      <AnalysisModal 
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
        data={TOPIC_ANALYSIS_DATA}
      />
    </div>
  );
};

export default App;
