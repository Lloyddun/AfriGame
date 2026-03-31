import { useState, useEffect } from "react";
import { Trophy, Gamepad2, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { collection, query, where, limit, onSnapshot, orderBy } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";

export default function Home() {
  const [featuredStream, setFeaturedStream] = useState<any>(null);
  const [popularStreams, setPopularStreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const streamsRef = collection(db, "streams");
    
    // Fetch Featured Stream (Live with most viewers)
    const featuredQuery = query(streamsRef, where("isLive", "==", true), orderBy("viewers", "desc"), limit(1));
    const unsubFeatured = onSnapshot(featuredQuery, (snapshot) => {
      if (!snapshot.empty) {
        setFeaturedStream({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        setFeaturedStream(null);
      }
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, "streams"));

    // Fetch Popular Streams
    const popularQuery = query(streamsRef, where("isLive", "==", true), orderBy("viewers", "desc"), limit(8));
    const unsubPopular = onSnapshot(popularQuery, (snapshot) => {
      setPopularStreams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "streams"));

    return () => {
      unsubFeatured();
      unsubPopular();
    };
  }, []);

  const categories = [
    { name: "FIFA 24", icon: Gamepad2, color: "bg-blue-500" },
    { name: "PUBG Mobile", icon: Gamepad2, color: "bg-orange-500" },
    { name: "Free Fire", icon: Gamepad2, color: "bg-red-500" },
    { name: "Mobile Legends", icon: Gamepad2, color: "bg-purple-500" },
    { name: "Call of Duty", icon: Gamepad2, color: "bg-green-500" },
  ];

  if (loading) return <div className="flex items-center justify-center h-64 text-gold font-bold">CHARGEMENT D'AFRIGAME...</div>;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      {featuredStream ? (
        <section className="relative aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden group">
          <img src={featuredStream.thumbnail || "https://picsum.photos/seed/afrigame/1280/720"} alt={featuredStream.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-crimson text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  EN DIRECT
                </span>
                <span className="text-white/80 text-sm font-medium">{featuredStream.viewers || 0} spectateurs</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white">{featuredStream.title}</h1>
              <p className="text-gold font-bold">{featuredStream.streamerName} • {featuredStream.game}</p>
            </div>
            <Link to={`/stream/${featuredStream.id}`} className="bg-gold text-background px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform glow-gold">
              <Play className="w-5 h-5 fill-current" />
              REGARDER MAINTENANT
            </Link>
          </div>
        </section>
      ) : (
        <section className="bg-card border border-border rounded-2xl p-12 text-center space-y-4">
          <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto">
            <Play className="text-gold w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold">AUCUN STREAM EN VEDETTE</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Soyez le premier à lancer un live sur AfriGame et apparaissez ici !</p>
          <Link to="/dashboard" className="inline-block bg-gold text-background px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity">LANCER MON STREAM</Link>
        </section>
      )}

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Gamepad2 className="text-gold" />
            CATÉGORIES POPULAIRES
          </h2>
          <Link to="/browse" className="text-gold text-sm font-bold hover:underline">Tout voir</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <div key={cat.name} className="bg-card border border-border p-4 rounded-xl hover:border-gold transition-colors cursor-pointer group text-center">
              <div className={`w-12 h-12 ${cat.color} rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <cat.icon className="text-white" />
              </div>
              <p className="font-bold text-sm">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Play className="text-crimson" />
            STREAMS EN VOGUE
          </h2>
          <Link to="/browse" className="text-gold text-sm font-bold hover:underline">Tout voir</Link>
        </div>
        {popularStreams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularStreams.map((stream) => (
              <Link key={stream.id} to={`/stream/${stream.id}`} className="group space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img src={stream.thumbnail || "https://picsum.photos/seed/stream/400/225"} alt={stream.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 bg-crimson text-white text-[10px] font-bold px-1.5 py-0.5 rounded">LIVE</div>
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{stream.viewers || 0} viewers</div>
                </div>
                <div className="flex gap-3">
                  <img src={`https://picsum.photos/seed/${stream.streamerId}/100`} className="w-10 h-10 rounded-full border-2 border-border" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate group-hover:text-gold transition-colors">{stream.title}</h3>
                    <p className="text-xs text-muted-foreground">{stream.streamerName}</p>
                    <p className="text-xs text-gold font-medium">{stream.game}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border p-8 rounded-xl text-center text-muted-foreground">
            Aucun stream en direct pour le moment.
          </div>
        )}
      </section>

      {/* Tournaments */}
      <section className="bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-3 py-1 rounded-full text-xs font-bold">
            <Trophy className="w-4 h-4" />
            TOURNOIS AFRIQUE CENTRALE
          </div>
          <h2 className="text-3xl font-bold">REJOIGNEZ LA COUPE DES LIONS</h2>
          <p className="text-muted-foreground">Inscrivez-vous maintenant pour le plus grand tournoi Mobile Legends d'Afrique Centrale. Plus de 1,000,000 FCFA de cashprize !</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Link to="/tournaments" className="bg-gold text-background px-6 py-2.5 rounded-full font-bold hover:opacity-90 transition-opacity">S'inscrire</Link>
            <Link to="/tournaments" className="border border-border px-6 py-2.5 rounded-full font-bold hover:bg-border transition-colors">En savoir plus</Link>
          </div>
        </div>
        <div className="w-full md:w-1/3 aspect-square bg-gradient-to-br from-gold to-crimson rounded-2xl flex items-center justify-center p-8">
          <Trophy className="w-full h-full text-background opacity-20" />
        </div>
      </section>
    </div>
  );
}
