
import React from 'react';
import { XIcon, ChartBarIcon } from './icons/Icons';

interface AnalysisData {
  name: string;
  frequency: number;
}

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AnalysisData[];
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const sortedData = [...data].sort((a, b) => b.frequency - a.frequency);
  const maxFrequency = Math.max(...sortedData.map(d => d.frequency), 1);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in" role="dialog" aria-modal="true">
      <div className="bg-slate-800 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <ChartBarIcon className="w-6 h-6 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100">出題傾向分析</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors" aria-label="閉じる">
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        
        <main className="p-6 md:p-8">
            <p className="text-slate-400 mb-6">過去の試験データに基づく、各技術分野のおおよその出題頻度です。</p>
            <div className="space-y-4">
                {sortedData.map(item => (
                    <div key={item.name} className="flex items-center gap-4">
                        <span className="w-40 text-sm text-slate-300 text-right truncate">{item.name}</span>
                        <div className="flex-1 bg-slate-700 rounded-full h-6">
                            <div 
                                className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold"
                                style={{ width: `${(item.frequency / maxFrequency) * 100}%` }}
                            >
                                {item.frequency}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
      </div>
    </div>
  );
};
