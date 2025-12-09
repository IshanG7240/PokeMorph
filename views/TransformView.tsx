import React, { useState } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { POKEMON_LIST } from '../constants';
import { transformImageToPokemon } from '../services/geminiService';
import { Wand2, RefreshCcw, Download, Share2 } from 'lucide-react';

export const TransformView: React.FC = () => {
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTransform = async () => {
    if (!inputImage) {
      setError("Please upload an image first.");
      return;
    }
    if (!selectedPokemon && !customPrompt) {
      setError("Please select a Pokémon or enter a custom name.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setOutputImage(null);

    const name = selectedPokemon || customPrompt;

    try {
      const result = await transformImageToPokemon(inputImage, name, customPrompt);
      setOutputImage(result);
    } catch (err: any) {
      setError(err.message || "Failed to transform image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 h-full">
      {/* Input Section */}
      <div className="space-y-6">
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-400">
            <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
            Upload Photo
          </h2>
          <ImageUploader
            selectedImage={inputImage}
            onImageSelect={setInputImage}
            onClear={() => { setInputImage(null); setOutputImage(null); }}
            label="Upload yourself or a friend"
          />
        </div>

        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 flex flex-col max-h-[600px]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-400 flex-shrink-0">
            <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
            Select Target
          </h2>
          
          <div className="space-y-4 flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <label className="block text-sm font-medium text-zinc-400 mb-2 sticky top-0 bg-zinc-900/95 py-1 z-10 backdrop-blur">Choose a Pokémon</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {POKEMON_LIST.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedPokemon(p.name); setCustomPrompt(''); }}
                    className={`p-3 rounded-lg text-sm transition-all flex flex-col items-center justify-center gap-1.5 border border-transparent ${
                      selectedPokemon === p.name 
                      ? 'bg-red-600/20 border-red-500 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-750 hover:border-zinc-600'
                    }`}
                  >
                    <span className="font-semibold">{p.name}</span>
                    <div className="flex flex-wrap justify-center gap-1">
                      {p.type.map(t => (
                        <span key={t} className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded text-zinc-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-shrink-0 pt-4 border-t border-zinc-800">
              <label className="block text-sm font-medium text-zinc-400 mb-2">Or type any name</label>
              <input
                type="text"
                value={selectedPokemon ? selectedPokemon : customPrompt}
                onChange={(e) => { setCustomPrompt(e.target.value); setSelectedPokemon(e.target.value); }}
                placeholder="e.g. Mecha-Mewtwo"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              />
            </div>

            <button
              onClick={handleTransform}
              disabled={isProcessing || !inputImage}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all flex-shrink-0 ${
                isProcessing || !inputImage
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-xl shadow-red-900/30 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCcw className="animate-spin" /> Morphing Structure...
                </>
              ) : (
                <>
                  <Wand2 /> Transform
                </>
              )}
            </button>
            
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-200 text-sm animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Output Section */}
      <div className="flex flex-col h-full">
        <div className="flex-1 bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 flex flex-col items-center justify-center relative min-h-[400px]">
           <h2 className="absolute top-6 left-6 text-xl font-bold text-zinc-200 flex items-center gap-2">
            Result
          </h2>
          
          {outputImage ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-6 animate-in zoom-in duration-500">
              <div className="relative w-full flex-1 flex items-center justify-center">
                 <img
                  src={outputImage}
                  alt="Transformed result"
                  className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-2xl shadow-black ring-1 ring-zinc-700"
                />
              </div>
              <div className="flex gap-4">
                <a
                  href={outputImage}
                  download={`pokemorph-${Date.now()}.png`}
                  className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-lg transition-colors border border-zinc-700"
                >
                  <Download size={18} /> Download
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center text-zinc-600">
              <div className="mb-4 mx-auto w-24 h-24 rounded-full bg-zinc-800/50 flex items-center justify-center">
                <Wand2 size={32} className="opacity-50"/>
              </div>
              <p className="text-lg">Your evolution awaits...</p>
              <p className="text-sm mt-2 max-w-xs mx-auto">Upload an image and select a target to see the magic happen.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};