
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GoalProgress from './components/GoalProgress';
import MissionTabs from './components/MissionTabs';
import MissionCard from './components/MissionCard';
import ChallengeCreator from './components/ChallengeCreator';
import PlayerStats from './components/PlayerStats';
import StoryStarter from './components/StoryStarter';
import AdventureHub from './components/AdventureHub';
import BottomNav from './components/BottomNav';
import LoginScreen from './components/LoginScreen';
import ScavengerHunt from './components/ScavengerHunt';
import MysteryJar from './components/MysteryJar';
import { NavTab, Activity, AppScreen, SavedMonster, User, UserProfile } from './types';
import { INITIAL_MISSIONS, SON_AVATAR, DAD_AVATAR, MUM_AVATAR, DAUGHTER_AVATAR } from './constants';

import { supabase } from './lib/supabase';

import EmojiCharades from './components/EmojiCharades';
import DadJokeDuel from './components/DadJokeDuel';
import FutureYourself from './components/FutureYourself';
import TruthOrDareAI from './components/TruthOrDareAI';

import AdminPanel from './components/AdminPanel';
import ChatWindow from './components/ChatWindow';

const App: React.FC = () => {
  useEffect(() => {
    console.log("App Version: v4.0 - Multiplayer Logic - " + new Date().toISOString());
  }, []);

  const [activeTab, setActiveTab] = useState<NavTab>(NavTab.Active);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.Hub);
  const [activeMissions, setActiveMissions] = useState<Activity[]>([]);
  const [historyMissions, setHistoryMissions] = useState<Activity[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Cleaned up monster state
  const [savedMonsters, setSavedMonsters] = useState<SavedMonster[]>([]);

  const [totalXP, setTotalXP] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [streak] = useState(0);
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  // Realtime Unread Count
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    const fetchUnread = async () => {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', currentUser.id)
        .eq('is_read', false);
      setUnreadCount(count || 0);
    };

    fetchUnread();

    const channel = supabase.channel('unread-count')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${currentUser.id}` }, () => {
        setUnreadCount(c => c + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  const [familyMembers, setFamilyMembers] = useState<UserProfile[]>([]);
  // v3.0: Selectable opponent from family
  const [selectedOpponentId, setSelectedOpponentId] = useState<string | null>(null);

  // Derived opponent
  const otherUser = familyMembers.find(m => m.id === selectedOpponentId) || {
    id: 'placeholder',
    name: 'Family Member',
    avatar: DAD_AVATAR, // Default fallbacks
    role: 'Dad'
  };

  // Auth & Profile Management
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, retryCount = 0) => {
    try {
      console.log(`Fetching profile for: ${userId} (Attempt ${retryCount + 1})`);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, role, avatar, xp, level, balance, family_name, email')
        .eq('id', userId)
        .limit(1);

      if (error) {
        console.error("Supabase Profile Error:", error);
        throw error;
      };

      if (data && data.length > 0) {
        const profile = data[0];
        setCurrentUser({
          id: profile.id,
          name: profile.name,
          role: profile.role as any,
          avatar: profile.avatar,
          email: profile.email,
          family_name: profile.family_name
        });
        // v2.0 Economy: Use balance if available, else fallback to xp/10
        const currentBalance = profile.balance !== undefined ? profile.balance : (profile.xp || 0) / 10;
        setTotalXP(currentBalance);
        setLevel(profile.level || 1);

        // v3.0: Fetch Family Members
        fetchFamilyMembers(profile.family_name || 'The Incredibles', profile.id);

      } else {
        console.warn("User logged in but no profile found. Auto-healing...");

        const { data: newProfileData, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: userId,
            name: 'Adventurer',
            role: 'Son',
            avatar: SON_AVATAR,
            balance: 0, // Initialize with $0
            family_name: 'The Incredibles' // Default v3 family
          }])
          .select()
          .limit(1);

        if (createError) {
          // Check for Conflict (409) or Unique Violation (23505)
          const err = createError as any;
          if (err.code === '23505' || err.status === 409) {
            console.log("Profile already exists (409 Conflict). Retrying fetch...");
            if (retryCount < 3) {
              // Wait a moment and retry fetch
              setTimeout(() => fetchProfile(userId, retryCount + 1), 1000);
            } else {
              console.error("Max retries reached. Profile exists but cannot be read.");
              setNotification("Error loading profile. Please refresh.");
            }
          } else {
            console.error("Failed to auto-heal in App:", createError);
          }
        } else if (newProfileData && newProfileData.length > 0) {
          const newProfile = newProfileData[0];
          setCurrentUser({
            id: newProfile.id,
            name: newProfile.name,
            role: newProfile.role as any,
            avatar: newProfile.avatar,
            family_name: 'The Incredibles'
          });
          setTotalXP(0);
          setLevel(1);
          setNotification("Profile restored! Welcome back.");
          // Fetch family for new user too
          fetchFamilyMembers('The Incredibles', newProfile.id);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      if (retryCount === 0) setLoading(false); // Only stop loading on main call, although effectively handled by async flow
    }
  };

  const fetchFamilyMembers = async (familyName: string, currentUserId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('family_name', familyName)
      .neq('id', currentUserId); // Exclude self

    if (data) {
      // Map to UserProfile
      const members: UserProfile[] = data.map(p => ({
        id: p.id,
        name: p.name,
        role: p.role,
        avatar: p.avatar,
        balance: p.balance,
        email: p.email,
        family_name: p.family_name,
        xp: p.xp,
        level: p.level
      }));
      setFamilyMembers(members);
      // Auto-select first member as opponent if none selected
      if (members.length > 0 && !selectedOpponentId) {
        setSelectedOpponentId(members[0].id);
      }
    }
  };

  const handleGameReward = async (amount: number, reason: string) => {
    if (!currentUser) return;
    const newBalance = totalXP + amount;
    setTotalXP(newBalance);
    setNotification(`${reason} (+$${amount.toFixed(2)}) 💰`);

    // Add Sparkle Effect? (Optional visual polish could go here)

    // Save to DB
    await supabase.from('profiles').update({ balance: newBalance }).eq('id', currentUser.id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setNotification('Logged out successfully 👋');
  };

  // Live simulation and effects...
  useEffect(() => {
    if (!currentUser) return;

    const liveSims = [
      `${otherUser.name} is online! 🟢`,
      `New challenge from ${otherUser.name}...`,
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.8 && familyMembers.length > 0) {
        // Pick random family member
        const randomMember = familyMembers[Math.floor(Math.random() * familyMembers.length)];
        const msg = `${randomMember.name} earned $5.00! 💰`;
        setNotification(msg);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [currentUser, familyMembers, otherUser.name]);

  // Fetch & Subscribe to Missions
  useEffect(() => {
    if (!currentUser) return;

    const fetchMissions = async () => {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) console.error('Error fetching missions:', error);
      else setActiveMissions(data as Activity[] || []);
    };

    fetchMissions();

    const channel = supabase
      .channel('missions_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'missions' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMission = payload.new as Activity;
            // Only add if active
            if ((payload.new as any).status === 'active') {
              setActiveMissions((prev) => [newMission, ...prev]);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedMission = payload.new as any;
            if (updatedMission.status === 'completed') {
              setActiveMissions((prev) => prev.filter(m => m.id !== updatedMission.id));
            }
          } else if (payload.eventType === 'DELETE') {
            setActiveMissions((prev) => prev.filter(m => m.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleLogin = (user: User) => {
    // Login is now handled by onAuthStateChange, but we keep this for the LoginScreen callback
    // which effectively just sets the user immediately for better UX while the session event fires
    setCurrentUser(user);
    setNotification(`Welcome to the Chaos, ${user.name}! 🌟`);
  };

  const handleApprove = async (id: string, judgeComment: string) => {
    const mission = activeMissions.find(m => m.id === id);
    if (mission) {
      // Optimistic update
      setActiveMissions(prev => prev.filter(m => m.id !== id));
      setHistoryMissions(prev => [mission, ...prev]);

      // Update Profile Balance via new common handler
      handleGameReward(5.00, `JUDGE: ${judgeComment}`);

      await supabase.from('missions').update({ status: 'completed' }).eq('id', id);
    }
  };

  const handleReject = async (id: string) => {
    // Reset mission to active (clear proof)
    setActiveMissions(prev => prev.map(m => m.id === id ? { ...m, status: 'active', proof_url: undefined } : m));
    setNotification("Evidence Rejected! Try again. 📸");

    await supabase
      .from('missions')
      .update({ status: 'active', proof_url: null })
      .eq('id', id);
  };

  const handleResetSeason = async () => {
    if (!window.confirm("Are you sure? This will reset EVERYONE'S score to 0.")) return;

    setTotalXP(0);
    setLevel(1);
    setNotification("SEASON RESET! 🏁 Start your engines!");

    // Reset all profiles (RPC would be better, but loop/client update works for small family app)
    // Actually, due to RLS, I can only update MY profile usually unless I am admin.
    // Assuming 'public' profiles policy allows update, or I only reset mine.
    // For now, reset CURRENT user only to be safe with RLS, or try global if enabled.
    await supabase.from('profiles').update({ xp: 0, level: 1, streak: 0 }).neq('id', '00000000-0000-0000-0000-000000000000'); // Valid UUID hack to match all if policy allows
  };

  const handleAddChallenge = async (newChallenge: Activity) => {
    // Optimistic update
    setActiveMissions(prev => [newChallenge, ...prev]);
    setActiveTab(NavTab.Active);
    setNotification(`Challenge BROADCASTED to ${otherUser.name}! 📱`);

    // Insert to DB
    const { error } = await supabase.from('missions').insert([{
      ...newChallenge,
      status: 'active',
      created_by: currentUser?.id
    }]);

    if (error) {
      console.error('Error creating mission:', error);
      setNotification('Failed to broadcast challenge. Try again!');
    }
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.Hub:
        return <AdventureHub
          onNavigate={setCurrentScreen}
          savedMonsterCount={savedMonsters.length}
          otherUserName={otherUser.name}
        />;
      case AppScreen.PlayerStats:
        return <PlayerStats onBack={() => setCurrentScreen(AppScreen.Hub)} currentUser={currentUser} otherUser={otherUser} totalXP={totalXP} level={level} streak={streak} />;
      case AppScreen.StoryStarter:
        return <StoryStarter onWin={(amount) => handleGameReward(amount, "Storyteller Bonus!")} />;
      case AppScreen.ScavengerHunt:
        return <ScavengerHunt onBack={() => setCurrentScreen(AppScreen.Hub)} />;
      case AppScreen.MysteryJar:
        return <MysteryJar onBack={() => setCurrentScreen(AppScreen.Hub)} />;

      // New Games
      case AppScreen.EmojiCharades:
        return <EmojiCharades onBack={() => setCurrentScreen(AppScreen.Hub)} onWin={(amount) => handleGameReward(amount, "Emoji Master!")} currentUser={currentUser!} />;
      case AppScreen.DadJokeDuel:
        return <DadJokeDuel onBack={() => setCurrentScreen(AppScreen.Hub)} currentUser={currentUser!} onWin={(amount) => handleGameReward(amount, "Joke Champion!")} />;
      case AppScreen.FutureYourself:
        return <FutureYourself onBack={() => setCurrentScreen(AppScreen.Hub)} />;
      case AppScreen.TruthOrDareAI:
        return <TruthOrDareAI onBack={() => setCurrentScreen(AppScreen.Hub)} onWin={(amount) => handleGameReward(amount, "Dare Completed!")} />;

      case AppScreen.Main:
      default:
        return (
          <main className="max-w-2xl mx-auto flex-1 w-full pb-32 no-scrollbar overflow-y-auto">
            <div className="px-4 pt-4 flex items-center gap-2">
              <button onClick={() => setCurrentScreen(AppScreen.Hub)} className="p-2 bg-gray-100 dark:bg-white/10 rounded-full active:scale-90 transition-transform">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h2 className="text-xl font-bold">Chaos Missions</h2>
            </div>
            <GoalProgress xp={totalXP} />
            <MissionTabs activeTab={activeTab} onChange={setActiveTab} />

            <div className="flex flex-col gap-4 px-4">
              {activeTab === NavTab.Active ? (
                <>
                  <ChallengeCreator onCreate={handleAddChallenge} />
                  {activeMissions.length > 0 ? (
                    activeMissions.map(m => (
                      <MissionCard
                        key={m.id}
                        mission={m}
                        onComplete={() => { }} // Not used directly anymore, flow handled by card
                        onApprove={handleApprove}
                        onReject={handleReject}
                        userRole={currentUser.role}
                      />
                    ))
                  ) : (
                    <div className="py-20 text-center opacity-50 animate-pulse">
                      <span className="material-symbols-outlined text-6xl mb-4">auto_awesome</span>
                      <p className="font-bold">The Chaos has been tamed...</p>
                      <p className="text-sm">Create a new challenge!</p>
                    </div>
                  )}
                </>
              ) : (
                historyMissions.length > 0 ? (
                  historyMissions.map(m => (
                    <MissionCard
                      key={m.id}
                      mission={m}
                      onComplete={() => { }}
                      onApprove={() => { }}
                      onReject={() => { }}
                      isHistory
                    />
                  ))
                ) : (
                  <div className="py-20 text-center opacity-50">
                    <span className="material-symbols-outlined text-6xl mb-4">trophy</span>
                    <p className="font-bold">Empty Hall of Fame</p>
                  </div>
                )
              )}
            </div>
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen h-screen flex flex-col transition-colors duration-200 bg-background-light dark:bg-background-dark overflow-hidden font-display max-w-6xl mx-auto shadow-2xl border-x border-gray-100 dark:border-white/5 relative">
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-sm bg-black dark:bg-white text-white dark:text-black font-black px-6 py-4 rounded-3xl shadow-2xl animate-in slide-in-from-top-12 duration-500 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
          <span className="text-sm truncate">{notification}</span>
        </div>
      )}

      <Header
        onOpenMashup={() => setCurrentScreen(AppScreen.Hub)} // Removed MonsterLab link
        onLogout={handleLogout}
        totalXP={totalXP}
        streak={streak}
        level={level}
        user={currentUser}
        otherUserAvatar={otherUser.avatar}
      />

      {/* Admin/Debug: Reset Season Logic (Hidden/Double Tap header or just a small button) */}
      {/* Admin Button (Dad Only) */}
      {currentUser?.role === 'Dad' && (
        <button
          onClick={() => setShowAdmin(true)}
          className="fixed top-4 right-20 z-50 bg-red-600/80 hover:bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-md transition-all active:scale-95 flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">security</span>
          Admin
        </button>
      )}

      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {renderScreen()}
      </div>


      {/* Chat FAB */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-24 right-4 z-50 w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 border-2 border-primary"
        >
          <span className="material-symbols-outlined text-2xl">chat</span>
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-black animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {showChat && currentUser && (
        <ChatWindow
          currentUser={currentUser}
          opponent={otherUser}
          onClose={() => setShowChat(false)}
          onRead={() => setUnreadCount(0)}
        />
      )}

      <BottomNav
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        onAddClick={() => {
          setCurrentScreen(AppScreen.Main);
        }}
      />
    </div>
  );
};

export default App;
