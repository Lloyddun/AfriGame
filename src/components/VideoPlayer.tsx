import MuxPlayer from "@mux/mux-player-react";

interface VideoPlayerProps {
  playbackId: string;
  title?: string;
  viewerId?: string;
  streamType?: "live" | "on-demand";
  metadata?: any;
}

/**
 * Composant VideoPlayer
 * Intègre le lecteur Mux avec le design AfriGame
 */
export default function VideoPlayer({ 
  playbackId, 
  title = "AfriGame Stream", 
  viewerId = "anonymous", 
  streamType = "on-demand",
  metadata = {}
}: VideoPlayerProps) {
  
  const muxDataKey = import.meta.env.VITE_MUX_DATA_KEY;

  return (
    <div className="w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-border relative group">
      {/* Badge En Direct */}
      {streamType === "live" && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-crimson/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          🔴 EN DIRECT
        </div>
      )}

      <div className="aspect-video w-full">
        <MuxPlayer
          playbackId={playbackId}
          metadata={{
            video_id: playbackId,
            video_title: title,
            viewer_user_id: viewerId,
            ...metadata
          }}
          envKey={muxDataKey}
          streamType={streamType}
          accentColor="#FFD700"
          primaryColor="#FFFFFF"
          secondaryColor="#0D0D0D"
          placeholder="Chargement du stream..."
          className="w-full h-full"
          style={{ height: '100%', width: '100%' }}
        />
      </div>

      {/* Overlay de chargement ou d'erreur personnalisé si nécessaire */}
      {!playbackId && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm text-gold font-display font-bold">
          Flux non disponible ou terminé
        </div>
      )}
    </div>
  );
}
