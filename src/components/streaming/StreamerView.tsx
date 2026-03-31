import React, { useEffect, useRef } from 'react';
import { useAgora } from '../../hooks/useAgora';
import { Play, Square, Radio, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StreamerViewProps {
  streamerId: string;
}

/**
 * Vue côté streamer : permet de démarrer et d'arrêter le partage d'écran
 */
export const StreamerView: React.FC<StreamerViewProps> = ({ streamerId }) => {
  const { state, localVideoTrack, error, startStream, stopStream } = useAgora(streamerId);
  const videoRef = useRef<HTMLDivElement>(null);

  // Lecture de la piste vidéo locale dans le conteneur
  useEffect(() => {
    if (localVideoTrack && videoRef.current) {
      localVideoTrack.play(videoRef.current);
    }
    return () => {
      if (localVideoTrack) {
        localVideoTrack.stop();
      }
    };
  }, [localVideoTrack]);

  return (
    <div className="flex flex-col w-full h-full bg-[#0D0D0D] text-white rounded-xl overflow-hidden border border-[#FFD700]/20">
      {/* En-tête avec statut */}
      <div className="flex items-center justify-between p-4 bg-[#1A1A1A]">
        <div className="flex items-center gap-3">
          <Radio className={`w-5 h-5 ${state === 'live' ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} />
          <h3 className="font-semibold text-lg tracking-tight">Console de Streaming</h3>
        </div>
        
        <AnimatePresence>
          {state === 'live' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-white rounded-full animate-ping" />
              🔴 EN DIRECT
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Zone de prévisualisation vidéo */}
      <div className="relative flex-1 bg-black aspect-video flex items-center justify-center overflow-hidden">
        <div ref={videoRef} className="w-full h-full object-cover" />
        
        {state === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-[#0D0D0D]/80">
            <div className="w-16 h-16 bg-[#FFD700]/10 rounded-full flex items-center justify-center mb-4">
              <Play className="w-8 h-8 text-[#FFD700]" />
            </div>
            <p className="text-gray-400 max-w-xs">
              Prêt à partager votre écran avec la communauté AfriGame ?
            </p>
          </div>
        )}

        {/* Affichage des erreurs */}
        {error && (
          <div className="absolute bottom-4 left-4 right-4 p-3 bg-red-900/80 border border-red-500 rounded-lg flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Contrôles */}
      <div className="p-6 flex justify-center gap-4 bg-[#1A1A1A]">
        {state === 'idle' ? (
          <button
            onClick={startStream}
            className="flex items-center gap-2 px-8 py-3 bg-[#FFD700] text-black font-bold rounded-full hover:bg-[#E6C200] transition-all active:scale-95 shadow-lg shadow-[#FFD700]/20"
          >
            <Play className="w-5 h-5 fill-current" />
            Démarrer le stream
          </button>
        ) : (
          <button
            onClick={stopStream}
            className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-600/20"
          >
            <Square className="w-5 h-5 fill-current" />
            Terminer le stream
          </button>
        )}
      </div>
    </div>
  );
};
