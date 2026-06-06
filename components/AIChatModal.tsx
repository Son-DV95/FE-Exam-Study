
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { Question } from '../types';
import LoadingIcon from './LoadingIcon';
import { XIcon, SendIcon, BrainIcon } from './icons/Icons';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question | null;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({ isOpen, onClose, question }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isOpen && question) {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const initialPrompt = `あなたは日本の基礎情報技術者試験(FE)のエキスパートチューターです。
                ユーザーは現在、以下の問題を表示しています。この問題には日本語、英語、ベトナム語の翻訳が含まれています。
                ユーザーからの質問に対し、親切で、分かりやすく、簡潔に説明してください。
                ユーザーが質問で使用した言語（日本語またはベトナム語）に合わせて回答してください。

                [問題]
                JA: ${question.questionText.ja}
                EN: ${question.questionText.en}
                VI: ${question.questionText.vi}

                [正解]
                JA: ${question.options.ja[question.correctAnswerIndex]}
                EN: ${question.options.en[question.correctAnswerIndex]}
                VI: ${question.options.vi[question.correctAnswerIndex]}

                [解説]
                JA: ${question.explanation.ja}
                EN: ${question.explanation.en}
                VI: ${question.explanation.vi}
                
                それでは、学習を始めましょう。何か質問はありますか？`;

                chatRef.current = ai.chats.create({
                    model: 'gemini-3.5-flash',
                    history: [
                        { role: 'user', parts: [{ text: initialPrompt }] },
                        { role: 'model', parts: [{ text: 'はい、承知いたしました。この問題について、日本語でもベトナム語でも、どのようなことでも質問してください。' }] }
                    ],
                });

                setMessages([{ sender: 'ai', text: 'はい、承知いたしました。この問題について、日本語でもベトナム語でも、どのようなことでも質問してください。' }]);
                setError(null);
            } catch (err) {
                console.error("Failed to initialize AI Chat:", err);
                setError("AIアシスタントの初期化に失敗しました。APIキーを確認してください。");
            }
        } else {
            setMessages([]);
            setUserInput('');
            setIsLoading(false);
            setError(null);
            chatRef.current = null;
        }
    }, [isOpen, question]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !chatRef.current) return;
        
        const textToSend = userInput;
        const userMessage: Message = { sender: 'user', text: textToSend };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);
        setError(null);

        try {
            const stream = await chatRef.current.sendMessageStream({ message: textToSend });
            
            let aiResponse = '';
            setMessages(prev => [...prev, { sender: 'ai', text: '' }]);

            for await (const chunk of stream) {
                const chunkText = chunk.text;
                if(chunkText){
                  aiResponse += chunkText;
                  setMessages(prev => {
                      const newMessages = [...prev];
                      newMessages[newMessages.length - 1].text = aiResponse;
                      return newMessages;
                  });
                }
            }
        } catch (err) {
            console.error('AI chat error:', err);
            const errorMessage = '申し訳ありません、エラーが発生しました。しばらくしてからもう一度お試しください。';
            setError(errorMessage);
            setMessages(prev => prev.slice(0, -1)); // Remove empty AI message placeholder
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in" role="dialog" aria-modal="true">
            <div className="bg-slate-800 w-full max-w-2xl h-[90vh] rounded-xl shadow-2xl flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <BrainIcon className="w-6 h-6 text-cyan-400" />
                        <h2 className="text-lg font-bold text-slate-100">AI学習アシスタント</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors" aria-label="閉じる">
                        <XIcon className="w-6 h-6" />
                    </button>
                </header>
                
                <main className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-md lg:max-w-lg p-3 rounded-lg prose prose-invert prose-p:my-0 ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="p-3 bg-slate-700 rounded-lg">
                                <LoadingIcon />
                             </div>
                        </div>
                    )}
                    {error && (
                        <div className="p-3 bg-red-900/50 text-red-300 rounded-lg">
                            {error}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </main>

                <footer className="p-4 border-t border-slate-700 flex-shrink-0">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder={error ? "エラーが発生しました" : "質問を入力してください..."}
                            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                            disabled={isLoading || !!error}
                            aria-label="質問"
                        />
                        <button 
                            type="submit"
                            disabled={isLoading || !userInput.trim() || !!error}
                            className="bg-cyan-600 text-white p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-500 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            aria-label="送信"
                        >
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
};
