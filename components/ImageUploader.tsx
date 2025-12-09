import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  selectedImage: string | null;
  onClear: () => void;
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  selectedImage,
  onClear,
  label = "Upload an image",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Extract just the base64 part
      const base64 = result.split(',')[1];
      onImageSelect(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      {selectedImage ? (
        <div className="relative group rounded-xl overflow-hidden border-2 border-zinc-700 bg-zinc-800 aspect-square sm:aspect-video flex items-center justify-center">
          <img
            src={`data:image/png;base64,${selectedImage}`}
            alt="Uploaded preview"
            className="w-full h-full object-contain"
          />
          <button
            onClick={onClear}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center h-64 sm:h-80 gap-4
            ${isDragging 
              ? 'border-red-500 bg-red-500/10' 
              : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-500 hover:bg-zinc-800'
            }`}
        >
          <input
            type="file"
            ref={inputRef}
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            accept="image/*"
            className="hidden"
          />
          <div className={`p-4 rounded-full ${isDragging ? 'bg-red-500 text-white' : 'bg-zinc-700 text-zinc-400'}`}>
            <Upload size={32} />
          </div>
          <div className="text-center px-4">
            <p className="font-medium text-lg text-zinc-200">{label}</p>
            <p className="text-sm text-zinc-500 mt-1">Click or drag & drop (JPG, PNG)</p>
          </div>
        </div>
      )}
    </div>
  );
};
