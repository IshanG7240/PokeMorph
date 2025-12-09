import React from 'react';
import { Key } from 'lucide-react';
import { requestApiKey } from '../services/geminiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleConnect = async () => {
    try {
      await requestApiKey();
      onClose();
    } catch (e) {
      console.error("Failed to select key", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-full text-red-500">
            <Key size={32} />
          </div>
          <h2 className="text-xl font-bold text-white">API Key Required</h2>
          <p className="text-zinc-400 text-sm">
            To use the advanced Pro models for this feature, you need to connect a paid Google Cloud Project API key.
            <br/><br/>
            Please review the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-red-400 underline hover:text-red-300">billing documentation</a> for details.
          </p>
          <button
            onClick={handleConnect}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Connect Google Cloud Project
          </button>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
