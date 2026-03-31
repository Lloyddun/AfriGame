import React, { useEffect, useRef } from 'react';
import { useAgora } from '../../hooks/useAgora';
import { Users, AlertCircle, Eye, Radio } from 'lucide-react';

interface ViewerViewProps {
  streamerId: string;
}

/**
 * Vue côté viewer : rejoint automatiquement le channel et affiche le stream
 */
export const ViewerView: React.FC<ViewerViewProps> = ({ streamerId }) => {
  const { state, remoteVideoTrack, viewerCount, error, joinAsViewer } = useAgora(streamerId);
  const videoRef = useRef<HTMLDivElement>(null);

  // Rejoint le stream dès que le composant est monté
  useEffect(() => {
    if (streamerId) {
      joinAsViewer();
    }
  }, [streamerId, joinAsViewer]);

  // Lecture de la piste vidéo distante dans le conteneur
  useEffect(() => {
    if (remoteVideoTrack && videoRef.current) {
      remoteVideoTrack.play(videoRef.current);
    }
    return () => {
      if (remoteVideoTrack) {
        remoteVideoTrack.stop();
      }
    };
  }, [remoteVideoTrack]);

  return (
    <div className="flex flex-col w-full h-full bg-[#0D0D0D] text-white rounded-xl overflow-hidden border border-[#FFD700]/10 shadow-2xl">
      {/* Barre de statut supérieure */}
      <div className="flex items-center justify-between p-4 bg-[#1A1A1A]/80 backdrop-blur-md border-b border-[#FFD700]/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FFD700]/10 flex items-center justify-center">
            <Radio className={`w-4 h-4 ${remoteVideoTrack ? 'text-[#FFD700]' : 'text-gray-600'}`} />
          </div>
          <span className="font-semibold text-sm tracking-wide uppercase">Diffusion en direct</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-full border border-white/5">
            <Users className="w-4 h-4 text-[#FFD700]" />
            <span className="text-sm font-mono font-bold text-[#FFD700]">{viewerCount}</span>
          </div>
          
          {remoteVideoTrack && (
            <div className="px-3 py-1 bg-red-600 text-[10px] font-black rounded-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              LIVE
            </div>
          )}
        </div>
      </div>

      {/* Zone vidéo (Ratio 16:9) */}
      <div className="relative flex-1 bg-black aspect-video flex items-center justify-center overflow-hidden">
        <div ref={videoRef} className="w-full h-full object-contain" />
        
        {/* État : Stream non démarré */}
        {!remoteVideoTrack && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-[#0D0D0D]/40 to-[#0D0D0D]">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
              <Eye className="w-10 h-10 text-gray-600" />
            </div>
            <h4 className="text-xl font-bold mb-2">Stream non démarré</h4>
            <p className="text-gray-500 max-w-xs text-sm leading-relaxed">
              Le streamer est actuellement hors ligne. Revenez plus tard pour ne rien manquer !
            </p>
          </div>
        )}

        {/* Affichage des erreurs réseau ou connexion */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-red-950/20 backdrop-blur-sm">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 border border-red-500/30">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-red-200 font-medium text-center max-w-xs">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}
      </div>

      {/* Pied de page informatif */}
      <div className="p-4 bg-[#1A1A1A] flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FFD700] to-[#B8860B] p-[1px]">
          <div className="w-full h-full bg-[#1A1A1A] rounded-[7px] flex items-center justify-center">
            <Radio className="w-5 h-5 text-[#FFD700]" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-0.5">Source</p>
          <p className="text-sm font-bold text-white">Flux Haute Définition (1080p)</p>
        </div>
      </div>
    </div>
  );
};
