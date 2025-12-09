import React, { useState } from 'react';
import { generatePokemonImage, checkApiKey, requestApiKey } from '../services/geminiService';
import { AspectRatio, ImageSize } from '../types';
import { Sparkles, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { ApiKeyModal } from '../components/ApiKeyModal';

const ASPECT_RATIOS = Object.values(AspectRatio);
const SIZES = Object.values(ImageSize);

export const GenerateView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [imageSize, setImageSize] = useState<ImageSize>(ImageSize.ONE_K);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;

    // Check for API key first as this uses Pro model
    const hasKey = await checkApiKey();
    if (!hasKey) {
      setShowKeyModal(true);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // Re-verify key state just before call in case
      const result = await generatePokemonImage(prompt, aspectRatio, imageSize);
      setGeneratedImage(result);
    } catch (err: any) {
      if (err.message && err.message.includes('404')) {
         // Key might be invalid or not found, prompt again
         setShowKeyModal(true);
      }
      setError("Generation failed. Ensure you have a valid key connected.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 h-full">
      <ApiKeyModal isOpen={showKeyModal} onClose={() => setShowKeyModal(false)} />
      
      {/* Controls Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-xl font-bold mb-6 text-red-400 flex items-center gap-2">
            <Sparkles size={20} /> Generator Settings
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A hyper-realistic Charizard flying over a volcano..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 h-32 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`p-2 text-xs rounded-lg transition-all ${
                      aspectRatio === ratio
                        ? 'bg-zinc-200 text-zinc-900 font-bold'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Resolution</label>
              <div className="flex gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setImageSize(size)}
                    className={`flex-1 p-2 text-sm rounded-lg transition-all ${
                      imageSize === size
                        ? 'bg-zinc-200 text-zinc-900 font-bold'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isProcessing || !prompt}
              className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
                isProcessing || !prompt
                  ? 'bg-zinc-800 text-zinc-500'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20'
              }`}
            >
              {isProcessing ? 'Generating...' : 'Generate Art'}
            </button>
             {error && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-900/10 p-2 rounded">
                <AlertCircle size={14} /> {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="lg:col-span-8">
        <div className="h-full min-h-[500px] bg-zinc-900/50 rounded-2xl border border-zinc-800 flex items-center justify-center relative overflow-hidden p-8">
          {generatedImage ? (
            <img
              src={generatedImage}
              alt="Generated Art"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          ) : (
            <div className="text-center text-zinc-600">
              <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
              <p>Enter a prompt and settings to generate high-quality images.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
