
import React, { useState, useCallback } from 'react';
import { generateImage } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { ImageIcon } from './icons/ImageIcon';
import { Spinner } from './Spinner';

type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

const aspectRatios: AspectRatio[] = ["1:1", "16:9", "9:16", "4:3", "3:4"];

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Please enter a description for the image.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const base64Image = await generateImage(prompt, aspectRatio);
      setImageUrl(`data:image/jpeg;base64,${base64Image}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-800 rounded-2xl shadow-2xl shadow-purple-500/10 overflow-hidden flex flex-col lg:flex-row">
      {/* Control Panel */}
      <div className="p-8 lg:w-1/2 flex flex-col space-y-6">
        <header className="flex items-center space-x-3">
          <SparklesIcon className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-gray-100">AI Image Weaver</h1>
        </header>
        <p className="text-gray-400">
          Describe your vision and watch it materialize. The more descriptive you are, the better the result.
        </p>

        {/* Prompt Input */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="prompt" className="text-sm font-medium text-gray-300">Your Vision</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A majestic lion wearing a crown, cinematic lighting, fantasy art"
            className="bg-slate-700 border border-slate-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none transition duration-200 h-32 resize-none"
            rows={4}
          />
        </div>

        {/* Aspect Ratio Selector */}
        <div className="flex flex-col space-y-3">
          <label className="text-sm font-medium text-gray-300">Aspect Ratio</label>
          <div className="grid grid-cols-5 gap-2">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-500 ${
                  aspectRatio === ratio ? 'bg-purple-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>
        
        {/* Action Button */}
        <button
          onClick={handleGenerateImage}
          disabled={isLoading}
          className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading && <Spinner className="w-5 h-5" />}
          <span>{isLoading ? 'Weaving...' : 'Generate Image'}</span>
        </button>

        {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
                <p><span className="font-bold">Error:</span> {error}</p>
            </div>
        )}
      </div>

      {/* Image Display */}
      <div className="lg:w-1/2 bg-slate-900/50 p-4 flex items-center justify-center min-h-[300px] lg:min-h-0">
        <div className="w-full h-full aspect-square border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center text-gray-400">
              <Spinner className="w-10 h-10 mb-4" />
              <p className="text-lg">Weaving your vision...</p>
              <p className="text-sm">This can take a moment.</p>
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt={prompt} className="w-full h-full object-contain" />
          ) : (
            <div className="text-center text-gray-500">
              <ImageIcon className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-xl font-semibold">Your image will appear here</h2>
              <p className="text-sm">Enter a description to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
