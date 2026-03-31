import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, Shield, Award, Calendar, Play, Heart, Users, Edit3, MapPin, Trophy } from "lucide-react";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { db, auth, handleFirestoreError, OperationType } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profileId, setProfileId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [stats, setStats] = useState([
    { label: "Followers", value: "0", icon: Heart, color: "text-crimson" },
    { label: "Following", value: "0", icon: Users, color: "text-blue-400" },
    { label: "Streams", value: "0", icon: Play, color: "text-gold" },
    { label: "Badges", value: "0", icon: Award, color: "text-emerald" },
  ]);
  const [replays, setReplays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (id) {
        setProfileId(id);
      } else if (user) {
        setProfileId(user.uid);
      } else {
        navigate("/auth");
      }
    });
    return () => unsub();
  }, [id, navigate]);

  useEffect(() => {
    if (!profileId) return;

    // Fetch User Profile
    const userRef = doc(db, "users", profileId);
    const unsubUser = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setUserProfile(data);
        setStats(prev => prev.map(s => {
          if (s.label === "Followers") return { ...s, value: (data.followersCount || 0).toString() };
          if (s.label === "Following") return { ...s, value: (data.followingCount || 0).toString() };
          if (s.label === "Badges") return { ...s, value: (data.badges?.length || 0).toString() };
          return s;
        }));
      } else {
        // If profile doesn't exist in Firestore, use basic info if it's the current user
        if (profileId === auth.currentUser?.uid) {
          setUserProfile({
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            country: "Afrique",
            bio: "Passionné de gaming africain.",
            followersCount: 0,
            followingCount: 0,
            badges: [],
            isVerified: false,
            createdAt: new Date().toISOString(),
          });
        }
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, `users/${profileId}`));

    // Fetch Replays (Past Streams)
    const streamsRef = collection(db, "streams");
    const q = query(streamsRef, where("streamerId", "==", profileId), where("isLive", "==", false));
    const unsubReplays = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReplays(docs);
      setStats(prev => prev.map(s => {
        if (s.label === "Streams") return { ...s, value: docs.length.toString() };
        return s;
      }));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, "streams"));

    return () => {
      unsubUser();
      unsubReplays();
    };
  }, [profileId]);

  if (loading) return <div className="flex items-center justify-center h-screen text-gold font-bold">CHARGEMENT DU PROFIL...</div>;

  const isOwnProfile = auth.currentUser?.uid === profileId;

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden">
        <img src="https://picsum.photos/seed/banner/1200/400" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        <div className="absolute bottom-6 left-6 flex items-end gap-6">
          <div className="relative">
            <img src={userProfile?.photoURL || `https://picsum.photos/seed/${profileId}/200`} className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-background shadow-xl object-cover" />
            <div className="absolute -bottom-2 -right-2 bg-gold text-background p-1.5 rounded-lg shadow-lg">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="pb-2">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {userProfile?.displayName || "Gamer AfriGame"}
              {userProfile?.isVerified && <Shield className="w-5 h-5 text-blue-400 fill-current" />}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {userProfile?.country || "Afrique"}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Membre depuis {userProfile?.createdAt ? new Date(userProfile.createdAt).getFullYear() : "2026"}</span>
            </div>
          </div>
        </div>
        {isOwnProfile && (
          <button className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/20 hover:bg-black/80 transition-colors">
            <Edit3 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="font-bold uppercase text-xs text-muted-foreground tracking-widest">À propos</h3>
            <p className="text-sm leading-relaxed">
              {userProfile?.bio || "Passionné de gaming africain. Rejoignez l'aventure sur AfriGame !"}
            </p>
            <div className="flex gap-4">
              {stats.map(s => (
                <div key={s.label} className="text-center flex-1">
                  <p className="text-xl font-bold">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">{s.label}</p>
                </div>
              ))}
            </div>
            {!isOwnProfile && (
              <button className="w-full bg-gold text-background py-2 rounded-xl font-bold hover:opacity-90 transition-opacity">
                Suivre
              </button>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="font-bold uppercase text-xs text-muted-foreground tracking-widest">Badges gagnés</h3>
            <div className="flex flex-wrap gap-3">
              {userProfile?.badges?.length > 0 ? (
                userProfile.badges.map((badge: any, i: number) => (
                  <div key={i} className="group relative">
                    <div className={`w-12 h-12 bg-gold rounded-xl flex items-center justify-center text-white shadow-lg cursor-help`}>
                      <Award className="w-6 h-6" />
                    </div>
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {badge.name}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic">Aucun badge pour le moment</p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <button className="text-gold font-bold border-b-2 border-gold pb-4 -mb-4.5">Derniers Replays</button>
            <button className="text-muted-foreground font-bold hover:text-foreground transition-colors pb-4 -mb-4.5">Clips Favoris</button>
            <button className="text-muted-foreground font-bold hover:text-foreground transition-colors pb-4 -mb-4.5">Tournois</button>
          </div>

          {replays.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {replays.map(replay => (
                <div key={replay.id} className="group cursor-pointer space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-border">
                    <img src={replay.thumbnail || "https://picsum.photos/seed/replay/400/225"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {replay.duration || "00:00"}
                    </div>
                  </div>
                  <h4 className="font-bold text-sm group-hover:text-gold transition-colors">{replay.title}</h4>
                  <p className="text-xs text-muted-foreground">Il y a {Math.floor((Date.now() - new Date(replay.startedAt).getTime()) / (1000 * 60 * 60 * 24))} jours • {replay.views || 0} vues</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border p-12 rounded-2xl text-center text-muted-foreground">
              Aucun replay disponible.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
