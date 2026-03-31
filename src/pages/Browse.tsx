import { useState, useEffect } from "react";
import { Search, Filter, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";

export default function Browse() {
  const [streams, setStreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("En direct");

  useEffect(() => {
    const streamsRef = collection(db, "streams");
    let q;

    if (filter === "En direct") {
      q = query(streamsRef, where("isLive", "==", true), orderBy("viewers", "desc"));
    } else {
      q = query(streamsRef, where("isLive", "==", false), orderBy("startedAt", "desc"));
    }

    const unsub = onSnapshot(q, (snapshot) => {
      setStreams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, "streams"));

    return () => unsub();
  }, [filter]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">DÉCOUVRIR</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="bg-card border border-border rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-gold w-64"
            />
          </div>
          <button className="p-2 bg-card border border-border rounded-xl hover:border-gold transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {["En direct", "Replays", "Clips", "Catégories"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-colors ${
              filter === tab ? "bg-gold text-background" : "bg-card border border-border hover:border-gold"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-gold font-bold">CHARGEMENT...</div>
      ) : streams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {streams.map((stream) => (
            <Link key={stream.id} to={`/stream/${stream.id}`} className="group space-y-3">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <img src={stream.thumbnail || "https://picsum.photos/seed/stream/400/225"} alt={stream.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {stream.isLive && (
                  <div className="absolute top-2 left-2 bg-crimson text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                    <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                    LIVE
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {stream.viewers || 0}
                </div>
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {stream.language || "FR"}
                </div>
              </div>
              <div className="flex gap-3">
                <img src={`https://picsum.photos/seed/${stream.streamerId}/100`} className="w-10 h-10 rounded-full border-2 border-border" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm truncate group-hover:text-gold transition-colors">{stream.title}</h3>
                  <p className="text-xs text-muted-foreground">{stream.streamerName} • {stream.country}</p>
                  <p className="text-xs text-gold font-medium">{stream.game}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border p-12 rounded-2xl text-center text-muted-foreground">
          Aucun contenu trouvé pour cette catégorie.
        </div>
      )}
    </div>
  );
}
