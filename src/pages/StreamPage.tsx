import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Share2, DollarSign, MessageSquare, Send, Smile, Users, ShieldAlert } from "lucide-react";
import VideoPlayer from "../components/VideoPlayer";
import { collection, query, where, onSnapshot, orderBy, limit, addDoc, serverTimestamp, doc } from "firebase/firestore";
import { db, auth, handleFirestoreError, OperationType } from "../firebase";

export default function StreamPage() {
  const { id } = useParams();
  const [stream, setStream] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    // Fetch Stream Info
    const streamRef = doc(db, "streams", id);
    const unsubStream = onSnapshot(streamRef, (snapshot) => {
      if (snapshot.exists()) {
        setStream({ id: snapshot.id, ...snapshot.data() });
      }
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.GET, `streams/${id}`));

    // Fetch Chat Messages
    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("streamId", "==", id),
      orderBy("timestamp", "asc"),
      limit(50)
    );

    const unsubMessages = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "messages"));

    return () => {
      unsubStream();
      unsubMessages();
    };
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !auth.currentUser || !id) return;

    try {
      await addDoc(collection(db, "messages"), {
        streamId: id,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "Gamer AfriGame",
        text: chatMessage,
        timestamp: serverTimestamp(),
        isMod: false,
      });
      setChatMessage("");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "messages");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen text-gold font-bold">CHARGEMENT DU STREAM...</div>;
  if (!stream) return <div className="flex items-center justify-center h-screen text-crimson font-bold">STREAM INTROUVABLE</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-6rem)]">
      {/* Video Player Section */}
      <div className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto pr-2">
        <VideoPlayer 
          playbackId={stream.playbackId} 
          metadata={{
            video_id: stream.id,
            video_title: stream.title,
            viewer_user_id: auth.currentUser?.uid || "anonymous",
          }}
        />

        <div className="bg-card border border-border p-6 rounded-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={`https://picsum.photos/seed/${stream.streamerId}/100`} className="w-16 h-16 rounded-full border-4 border-gold" />
              <div>
                <h1 className="text-2xl font-bold">{stream.title}</h1>
                <p className="text-gold font-bold">{stream.streamerName}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="w-3 h-3" /> {stream.viewers || 0} spectateurs
                  </span>
                  <span className="text-xs text-muted-foreground">{stream.game}</span>
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
            <h3 className="font-bold mb-2 uppercase text-xs tracking-widest text-muted-foreground">À propos du stream</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {stream.description || "Bienvenue sur le stream ! Profitez de l'action et n'hésitez pas à participer au chat."}
            </p>
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
          <ShieldAlert className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-gold" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div key={msg.id} className="text-sm leading-relaxed group">
                <span className={`font-bold mr-2 ${msg.isMod ? "text-emerald" : "text-gold"}`}>{msg.userName}:</span>
                <span className="text-foreground/90">{msg.text}</span>
              </div>
            ))
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">
              Bienvenue dans le chat !
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-border space-y-3">
          <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder={auth.currentUser ? "Envoyer un message..." : "Connectez-vous pour chatter"}
              disabled={!auth.currentUser}
              className="flex-1 bg-transparent border-none focus:outline-none text-sm disabled:opacity-50"
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
            <button 
              type="submit" 
              disabled={!auth.currentUser || !chatMessage.trim()}
              className="bg-gold text-background p-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          {!auth.currentUser && (
            <p className="text-[10px] text-center text-muted-foreground">
              Vous devez être <Link to="/auth" className="text-gold hover:underline">connecté</Link> pour chatter.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
