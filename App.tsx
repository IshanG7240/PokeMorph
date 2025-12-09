import React, { useState } from 'react';
import { TransformView } from './views/TransformView';
import { GenerateView } from './views/GenerateView';
import { AnalyzeView } from './views/AnalyzeView';
import { AppMode } from './types';
import { Sparkles, Wand2, ScanEye, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.TRANSFORM);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-900/50">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">PokeMorph <span className="text-red-500">AI</span></span>
          </div>
          
          <div className="text-xs text-zinc-500 font-mono hidden sm:block">
            Powered by Gemini 2.5 Flash & 3.0 Pro
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center mb-8">
          <div className="bg-zinc-900 p-1 rounded-xl border border-zinc-800 inline-flex shadow-xl">
            <button
              onClick={() => setMode(AppMode.TRANSFORM)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === AppMode.TRANSFORM
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Wand2 size={16} /> Transform
            </button>
            <button
              onClick={() => setMode(AppMode.GENERATE)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === AppMode.GENERATE
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Sparkles size={16} /> Generate
            </button>
            <button
              onClick={() => setMode(AppMode.ANALYZE)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === AppMode.ANALYZE
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <ScanEye size={16} /> Analyze
            </button>
          </div>
        </div>

        {/* Content Area */}
        <main className="max-w-6xl mx-auto pb-12">
          {mode === AppMode.TRANSFORM && <TransformView />}
          {mode === AppMode.GENERATE && <GenerateView />}
          {mode === AppMode.ANALYZE && <AnalyzeView />}
        </main>
      </div>
      
      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-900 py-6 bg-zinc-950">
        <div className="container mx-auto px-4 text-center text-zinc-600 text-sm">
          <p>© {new Date().getFullYear()} PokeMorph AI. Not affiliated with Nintendo/Game Freak.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
