
import React from 'react';
import type { Topic } from '../types';
import { ChartBarIcon, BriefcaseIcon } from './icons/Icons';

interface TopicSidebarProps {
  topics: Topic[];
  selectedTopic: Topic | null;
  onSelectTopic: (topic: Topic) => void;
  onOpenAnalysis: () => void;
  onBackToHome: () => void;
}

export const TopicSidebar: React.FC<TopicSidebarProps> = ({ topics, selectedTopic, onSelectTopic, onOpenAnalysis, onBackToHome }) => {
  return (
    <aside className="w-64 bg-slate-800 p-4 flex-shrink-0 hidden md:flex md:flex-col border-r border-slate-700">
      <div className="mb-6">
          <button 
            onClick={onBackToHome}
            className="flex items-center text-slate-400 hover:text-white transition-colors mb-4 text-sm font-bold"
          >
              ← Back to Home
          </button>
        <h2 className="text-xl font-bold mb-4 text-cyan-300">Topics</h2>
        <nav className="overflow-y-auto max-h-[calc(100vh-200px)]">
          <ul>
            {topics.map((topic) => (
              <li key={topic.id} className="mb-1">
                <button
                  onClick={() => onSelectTopic(topic)}
                  className={`w-full text-left flex items-center p-3 rounded-lg transition-all duration-200 ${
                    selectedTopic?.id === topic.id
                      ? 'bg-gradient-to-r from-cyan-900/50 to-transparent text-cyan-300 font-semibold border-l-2 border-cyan-400'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <topic.icon className="w-5 h-5 mr-3 flex-shrink-0 opacity-70" />
                  <span className="flex-1 text-sm">{topic.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mt-auto pt-4 border-t border-slate-700">
         <button
            onClick={onOpenAnalysis}
            className="w-full text-left flex items-center p-3 rounded-lg transition-all duration-200 text-slate-300 hover:bg-slate-700/50 hover:text-white"
          >
            <ChartBarIcon className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="flex-1 text-sm">Analysis</span>
          </button>
      </div>
    </aside>
  );
};
