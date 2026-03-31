import { useState, useEffect } from "react";
import { Key, Play, Square, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

/**
 * Composant StreamManager
 * Permet au streamer de créer, gérer et terminer son live stream via Mux
 */
export default function StreamManager() {
  const [streamData, setStreamData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("idle");

  // Charger le stream existant du localStorage pour la démo
  useEffect(() => {
    const savedStream = localStorage.getItem("afrigame_current_stream");
    if (savedStream) {
      const data = JSON.parse(savedStream);
      setStreamData(data);
      checkStatus(data.id);
    }
  }, []);

  /**
   * Créer un nouveau live stream
   */
  const createStream = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/mux/create-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      setStreamData(data);
      setStatus(data.status);
      localStorage.setItem("afrigame_current_stream", JSON.stringify(data));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Terminer le stream actuel
   */
  const deleteStream = async () => {
    if (!streamData?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/mux/delete-stream/${streamData.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      setStreamData(null);
      setStatus("idle");
      localStorage.removeItem("afrigame_current_stream");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Vérifier le statut du stream
   */
  const checkStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/mux/get-status/${id}`);
      const data = await response.json();
      if (data.status) setStatus(data.status);
    } catch (err) {
      console.error("Erreur statut:", err);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Key className="text-gold w-6 h-6" />
          GESTION DU LIVE
        </h3>
        {status === "active" && (
          <span className="flex items-center gap-1.5 bg-emerald/10 text-emerald text-xs font-bold px-3 py-1 rounded-full border border-emerald/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            EN LIGNE
          </span>
        )}
      </div>

      {error && (
        <div className="bg-crimson/10 border border-crimson/20 p-4 rounded-xl flex items-start gap-3 text-crimson text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {!streamData ? (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto">
            <Play className="text-gold w-8 h-8" />
          </div>
          <div className="space-y-1">
            <p className="font-bold">Prêt à diffuser ?</p>
            <p className="text-sm text-muted-foreground">Créez votre flux pour obtenir vos clés OBS.</p>
          </div>
          <button
            onClick={createStream}
            disabled={loading}
            className="bg-gold text-background px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity glow-gold flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : "DÉMARRER LE STREAM"}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Stream Key (OBS)</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  readOnly
                  value={streamData.stream_key}
                  className="flex-1 bg-background border border-border rounded-xl py-2.5 px-4 text-sm font-mono focus:outline-none"
                />
                <button 
                  onClick={() => navigator.clipboard.writeText(streamData.stream_key)}
                  className="bg-border px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-border/80 transition-colors"
                >
                  Copier
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Playback ID</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={streamData.playback_id}
                  className="flex-1 bg-background border border-border rounded-xl py-2.5 px-4 text-sm font-mono focus:outline-none"
                />
                <button 
                  onClick={() => navigator.clipboard.writeText(streamData.playback_id)}
                  className="bg-border px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-border/80 transition-colors"
                >
                  Copier
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gold/5 border border-gold/10 p-4 rounded-xl space-y-2">
            <p className="text-xs font-bold text-gold uppercase">Instructions OBS</p>
            <ul className="text-[11px] text-muted-foreground space-y-1 list-disc pl-4">
              <li>Serveur : <code className="text-foreground">rtmp://global-live.mux.com:5222/app</code></li>
              <li>Clé de stream : Utilisez la clé ci-dessus</li>
              <li>Encodeur : x264 ou NVENC (H.264)</li>
              <li>Débit : 2500 - 4000 Kbps (selon votre connexion)</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => checkStatus(streamData.id)}
              className="flex-1 border border-border py-3 rounded-xl font-bold hover:bg-border transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              ACTUALISER
            </button>
            <button
              onClick={deleteStream}
              disabled={loading}
              className="flex-1 bg-crimson text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4 fill-current" />}
              TERMINER LE STREAM
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
