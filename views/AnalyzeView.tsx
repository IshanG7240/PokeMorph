import React, { useState } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { analyzeImageForPokemon, checkApiKey } from '../services/geminiService';
import { Search, ScanEye } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Actually we don't need a library, we can do simple rendering or just pre-line
import { ApiKeyModal } from '../components/ApiKeyModal';

export const AnalyzeView: React.FC = () => {
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  const handleAnalyze = async () => {
    if (!inputImage) return;

    // Optional check: analyze uses Pro Preview which is free tier mostly but heavy usage might require paid.
    // The prompt snippet says "Analyze images... using model gemini-3-pro-preview".
    // Pro preview usually works with standard key but let's be safe.
    // If it fails we can prompt. 
    
    setIsProcessing(true);
    setAnalysis(null);

    try {
      const result = await analyzeImageForPokemon(inputImage);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      // If error suggests auth, show modal
      setShowKeyModal(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full space-y-8">
      <ApiKeyModal isOpen={showKeyModal} onClose={() => setShowKeyModal(false)} />
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <ScanEye className="text-red-500" size={32} />
          Poké-Scanner
        </h1>
        <p className="text-zinc-400">Upload an image to identify Pokémon or determine your Trainer persona.</p>
      </div>

      <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
         <ImageUploader
            selectedImage={inputImage}
            onImageSelect={setInputImage}
            onClear={() => { setInputImage(null); setAnalysis(null); }}
            label="Upload Image for Analysis"
          />
          
          <div className="mt-6 flex justify-center">
             <button
              onClick={handleAnalyze}
              disabled={isProcessing || !inputImage}
              className={`px-8 py-3 rounded-full font-bold text-lg transition-all flex items-center gap-2 ${
                isProcessing || !inputImage
                  ? 'bg-zinc-800 text-zinc-500'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
              }`}
            >
              {isProcessing ? <span className="animate-pulse">Scanning...</span> : <><Search size={20}/> Analyze</>}
            </button>
          </div>
      </div>

      {analysis && (
        <div className="bg-zinc-800/50 p-8 rounded-2xl border border-zinc-700 animate-in slide-in-from-bottom-4">
          <h3 className="text-lg font-bold text-blue-400 mb-4">Analysis Result</h3>
          <div className="prose prose-invert prose-p:text-zinc-300 max-w-none whitespace-pre-wrap">
            {analysis}
          </div>
        </div>
      )}
    </div>
  );
};
