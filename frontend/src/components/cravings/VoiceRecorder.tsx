import React, { useState } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please type your craving.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <button
      type="button"
      onClick={startListening}
      className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
        isListening
          ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse ring-2 ring-red-500/50'
          : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
      }`}
      title="Speak your craving"
    >
      {isListening ? (
        <div className="flex items-center space-x-1.5">
          <MicOff className="h-5 w-5 text-red-400" />
          <span className="text-xs font-bold">Listening...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-1.5">
          <Mic className="h-5 w-5 text-indigo-400" />
          <span className="text-xs font-medium hidden sm:inline">Voice Input</span>
        </div>
      )}
    </button>
  );
};
