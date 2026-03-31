import { useState, useEffect, useCallback, useRef } from 'react';
import AgoraRTC, { 
  IAgoraRTCClient, 
  ILocalVideoTrack, 
  ILocalAudioTrack, 
  IRemoteVideoTrack, 
  IRemoteAudioTrack,
  UID
} from 'agora-rtc-sdk-ng';

const APP_ID = import.meta.env.VITE_AGORA_APP_ID;

export type AgoraState = 'idle' | 'live' | 'watching';

/**
 * Hook personnalisé pour gérer la connexion et le streaming avec Agora.io
 */
export const useAgora = (channelName: string | null) => {
  const [state, setState] = useState<AgoraState>('idle');
  const [localVideoTrack, setLocalVideoTrack] = useState<ILocalVideoTrack | null>(null);
  const [remoteVideoTrack, setRemoteVideoTrack] = useState<IRemoteVideoTrack | null>(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const clientRef = useRef<IAgoraRTCClient | null>(null);

  // Initialisation du client Agora
  useEffect(() => {
    if (!APP_ID) {
      console.error("Agora App ID manquant dans les variables d'environnement.");
      return;
    }

    const client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
    clientRef.current = client;

    // Gestion des événements pour les viewers
    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === 'video') {
        setRemoteVideoTrack(user.videoTrack || null);
      }
      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }
    });

    client.on('user-unpublished', (user) => {
      if (user.uid === remoteVideoTrack?.getUserId()) {
        setRemoteVideoTrack(null);
      }
    });

    client.on('user-joined', () => {
      setViewerCount(prev => prev + 1);
    });

    client.on('user-left', () => {
      setViewerCount(prev => Math.max(0, prev - 1));
    });

    return () => {
      client.removeAllListeners();
      if (client.connectionState === 'CONNECTED') {
        client.leave();
      }
    };
  }, []);

  /**
   * Démarre le stream en tant que streamer (partage d'écran)
   */
  const startStream = useCallback(async () => {
    if (!clientRef.current || !channelName) return;

    try {
      setError(null);
      // Configuration du rôle en tant qu'hôte
      await clientRef.current.setClientRole('host');
      await clientRef.current.join(APP_ID, channelName, null, null);

      // Création de la piste vidéo à partir du partage d'écran
      const screenTrack = await AgoraRTC.createScreenVideoTrack({
        encoderConfig: '1080p_1',
        optimizationMode: 'detail'
      }, 'auto');

      // Si c'est un tableau (vidéo + audio), on prend la vidéo
      const videoTrack = Array.isArray(screenTrack) ? screenTrack[0] : screenTrack;
      const audioTrack = Array.isArray(screenTrack) ? screenTrack[1] : null;

      setLocalVideoTrack(videoTrack);
      
      const tracks: (ILocalVideoTrack | ILocalAudioTrack)[] = [videoTrack];
      if (audioTrack) tracks.push(audioTrack);

      await clientRef.current.publish(tracks);
      setState('live');

      // Gestion de l'arrêt du partage via l'interface du navigateur
      videoTrack.on('track-ended', () => {
        stopStream();
      });

    } catch (err: any) {
      console.error("Erreur lors du démarrage du stream:", err);
      if (err.code === 'PERMISSION_DENIED') {
        setError("Permission de partage d'écran refusée.");
      } else {
        setError("Impossible de démarrer le stream. Vérifiez votre connexion.");
      }
    }
  }, [channelName]);

  /**
   * Arrête le stream
   */
  const stopStream = useCallback(async () => {
    if (!clientRef.current) return;

    try {
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
        setLocalVideoTrack(null);
      }
      await clientRef.current.leave();
      setState('idle');
    } catch (err) {
      console.error("Erreur lors de l'arrêt du stream:", err);
    }
  }, [localVideoTrack]);

  /**
   * Rejoint le stream en tant que viewer
   */
  const joinAsViewer = useCallback(async () => {
    if (!clientRef.current || !channelName) return;

    try {
      setError(null);
      await clientRef.current.setClientRole('audience');
      await clientRef.current.join(APP_ID, channelName, null, null);
      setState('watching');
    } catch (err) {
      console.error("Erreur lors de la connexion au stream:", err);
      setError("Impossible de rejoindre le stream.");
    }
  }, [channelName]);

  return {
    state,
    localVideoTrack,
    remoteVideoTrack,
    viewerCount,
    error,
    startStream,
    stopStream,
    joinAsViewer
  };
};
