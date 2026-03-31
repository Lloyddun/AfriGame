import React, { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
import { Heart, Share2, DollarSign, MessageSquare, Send, Smile } from "lucide-react";

export default function StreamPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([
    { user: "DakarGamer", text: "C'est incroyable ce move !", color: "text-blue-400" },
    { user: "QueenLagos", text: "GG WP !", color: "text-pink-400" },
    { user: "AbidjanFan", text: "Don de 5000 FCFA ! 🔥", color: "text-gold" },
    { user: "YaoundePro", text: "Quelqu'un sait quel build il utilise ?", color: "text-emerald" },
  ]);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      // Mock HLS stream (using a sample HLS stream)
      const streamUrl = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      }
    }
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setMessages([...messages, { user: "Moi", text: chatMessage, color: "text-white" }]);
    setChatMessage("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-6rem)]">
      {/* Video Player Section */}
      <div className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto pr-2">
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden group">
          <video ref={videoRef} className="w-full h-full" controls autoPlay muted />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="bg-crimson text-white text-xs font-bold px-2 py-1 rounded">EN DIRECT</span>
            <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded">12,453 spectateurs</span>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src="https://picsum.photos/seed/streamer/100" className="w-16 h-16 rounded-full border-4 border-gold" />
              <div>
                <h1 className="text-2xl font-bold">AbidjanGaming</h1>
                <p className="text-gold font-bold">FINALE TOURNOI FIFA 24 - ABIDJAN OPEN</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-muted-foreground">1.2M followers</span>
                  <span className="text-xs text-muted-foreground">FIFA 24</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-gold text-background px-6 py-2 rounded-full font-bold hover:opacity-90 transition-opacity">Suivre</button>
              <button className="bg-emerald text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:opacity-90 transition-opacity glow-emerald">
                <DollarSign className="w-4 h-4" />
                Soutenir
              </button>
              <button className="p-2 hover:bg-border rounded-full border border-border">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-border rounded-full border border-border">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-bold mb-2">À propos du stream</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bienvenue sur la chaîne officielle d'AbidjanGaming ! Aujourd'hui, nous vivons ensemble la finale de l'Abidjan Open sur FIFA 24. 
              N'oubliez pas de soutenir la chaîne via Mobile Money (Orange, MTN, Moov) pour débloquer des badges exclusifs !
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["FIFA24", "AbidjanOpen", "GamingAfrica", "Esports"].map(tag => (
                <span key={tag} className="bg-border text-xs font-medium px-3 py-1 rounded-full">#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden h-full">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-gold" />
            CHAT EN DIRECT
          </h3>
          <span className="text-[10px] text-muted-foreground uppercase font-bold">Mode lent activé</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className="text-sm leading-relaxed">
              <span className={`font-bold ${msg.color} mr-2`}>{msg.user}:</span>
              <span className="text-foreground/90">{msg.text}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-border space-y-3">
          <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Envoyer un message..."
              className="flex-1 bg-transparent border-none focus:outline-none text-sm"
            />
            <button type="button" className="text-muted-foreground hover:text-gold transition-colors">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <button type="button" className="w-6 h-6 bg-emerald/20 text-emerald rounded flex items-center justify-center text-[10px] font-bold">500</button>
              <button type="button" className="w-6 h-6 bg-gold/20 text-gold rounded flex items-center justify-center text-[10px] font-bold">1k</button>
              <button type="button" className="w-6 h-6 bg-crimson/20 text-crimson rounded flex items-center justify-center text-[10px] font-bold">5k</button>
            </div>
            <button type="submit" className="bg-gold text-background p-2 rounded-lg hover:opacity-90 transition-opacity">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
