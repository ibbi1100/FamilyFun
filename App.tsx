
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GoalProgress from './components/GoalProgress';
import MissionTabs from './components/MissionTabs';
import MissionCard from './components/MissionCard';
import ChallengeCreator from './components/ChallengeCreator';
import MonsterMashup from './components/MonsterMashup';
import PlayerStats from './components/PlayerStats';
import SillySoundboard from './components/SillySoundboard';
import StoryStarter from './components/StoryStarter';
import AdventureHub from './components/AdventureHub';
import BottomNav from './components/BottomNav';
import LoginScreen from './components/LoginScreen';
import ScavengerHunt from './components/ScavengerHunt';
import MysteryJar from './components/MysteryJar';
import { NavTab, Activity, AppScreen, SavedMonster, User } from './types';
import { INITIAL_MISSIONS, SON_AVATAR, DAD_AVATAR, MUM_AVATAR, DAUGHTER_AVATAR } from './constants';

import { supabase } from './lib/supabase';

const App: React.FC = () => {
  useEffect(() => {
    console.log("App Version: v1.3 - 409 Conflict Retry Logic - " + new Date().toISOString());
  }, []);

  const [activeTab, setActiveTab] = useState<NavTab>(NavTab.Active);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.Hub);
  const [activeMissions, setActiveMissions] = useState<Activity[]>([]);
  const [historyMissions, setHistoryMissions] = useState<Activity[]>([]);
  const [savedMonsters, setSavedMonsters] = useState<SavedMonster[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [streak] = useState(0);
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  const getOtherUser = () => {
    switch (currentUser?.role) {
      case 'Dad':
        return { name: 'Super Son', avatar: SON_AVATAR, role: 'Son' }; // Default pair
      case 'Mum':
        return { name: 'Wonder Daughter', avatar: DAUGHTER_AVATAR, role: 'Daughter' }; // Default pair
      case 'Son':
        return { name: 'Captain Dad', avatar: DAD_AVATAR, role: 'Dad' };
      case 'Daughter':
        return { name: 'Super Mum', avatar: MUM_AVATAR, role: 'Mum' };
      default:
        return { name: 'Captain Dad', avatar: DAD_AVATAR, role: 'Dad' };
    }
  };

  const otherUser = getOtherUser();

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
        .select('id, name, role, avatar, xp, level')
        .eq('id', userId)
        .limit(1);

      if (error) {
        console.error("Supabase Profile Error:", error);
        throw error;
      };

      if (data && data.length > 0) {
        const profile = data[0];
        console.log("Profile found:", profile.name);
        setCurrentUser({
          id: profile.id,
          name: profile.name,
          role: profile.role as any,
          avatar: profile.avatar
        });
        setTotalXP(profile.xp || 0);
        setLevel(profile.level || 1);
      } else {
        console.warn("User logged in but no profile found. Auto-healing...");

        const { data: newProfileData, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: userId,
            name: 'Adventurer',
            role: 'Son',
            avatar: SON_AVATAR
          }])
          .select()
          .limit(1);

        if (createError) {
          // Check for Conflict (409) or Unique Violation (23505)
          if (createError.code === '23505' || createError.status === 409) {
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
            avatar: newProfile.avatar
          });
          setTotalXP(0);
          setLevel(1);
          setNotification("Profile restored! Welcome back.");
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      if (retryCount === 0) setLoading(false); // Only stop loading on main call, although effectively handled by async flow
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setNotification('Logged out successfully 👋');
  };

  // Live simulation and effects...
  useEffect(() => {
    if (!currentUser) return;

    const liveSims = [
      `${otherUser.name} just played a funky sound! 💨`,
      `${otherUser.name} is in the Monster Lab... 🧪`,
      `${otherUser.name} challenged you to a Face Off! 👀`,
      `${otherUser.name} reached a new level! 🚀`,
      "New Global Challenge available! ⚡️"
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const msg = liveSims[Math.floor(Math.random() * liveSims.length)];
        setNotification(msg);
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [currentUser, otherUser.name]);

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
              if (newMission.owner !== currentUser.role && newMission.owner !== 'Shared') {
                // Notification if created by other user?
                // Logic already handled by notification effect effectively if we want generic notifications
              }
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

      const newXP = totalXP + mission.xp;
      setTotalXP(newXP);
      setNotification(`JUDGE: ${judgeComment} (+${mission.xp} XP) 👨‍⚖️`);

      // Update DB
      await supabase.from('missions').update({ status: 'completed' }).eq('id', id);

      // Update Profile XP
      const nextLevel = Math.floor(newXP / 500) + 1;
      const updates: any = { xp: newXP };
      if (nextLevel > level) {
        setLevel(nextLevel);
        updates.level = nextLevel;
        setNotification(`LEVEL UP! You are now Level ${nextLevel}! 🏆`);
      }

      await supabase.from('profiles').update(updates).eq('id', currentUser?.id);
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
      case AppScreen.MonsterMashup:
        return <MonsterMashup
          onBack={() => setCurrentScreen(AppScreen.Hub)}
          onSave={(monster) => {
            setSavedMonsters(prev => [monster, ...prev]);
            setNotification(`${monster.name} has been BORN! 🧬`);
          }}
        />;
      case AppScreen.PlayerStats:
        return <PlayerStats onBack={() => setCurrentScreen(AppScreen.Hub)} currentUser={currentUser} otherUser={otherUser} totalXP={totalXP} level={level} streak={streak} />;
      case AppScreen.SillySoundboard:
        return <SillySoundboard />;
      case AppScreen.StoryStarter:
        return <StoryStarter />;
      case AppScreen.ScavengerHunt:
        return <ScavengerHunt onBack={() => setCurrentScreen(AppScreen.Hub)} />;
      case AppScreen.MysteryJar:
        return <MysteryJar onBack={() => setCurrentScreen(AppScreen.Hub)} />;
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
    <div className="min-h-screen h-screen flex flex-col transition-colors duration-200 bg-background-light dark:bg-background-dark overflow-hidden font-display">
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-sm bg-black dark:bg-white text-white dark:text-black font-black px-6 py-4 rounded-3xl shadow-2xl animate-in slide-in-from-top-12 duration-500 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
          <span className="text-sm truncate">{notification}</span>
        </div>
      )}

      <Header
        onOpenMashup={() => setCurrentScreen(AppScreen.MonsterMashup)}
        onLogout={handleLogout}
        totalXP={totalXP}
        streak={streak}
        level={level}
        user={currentUser}
        otherUserAvatar={otherUser.avatar}
      />

      {/* Admin/Debug: Reset Season Logic (Hidden/Double Tap header or just a small button) */}
      <button
        onClick={handleResetSeason}
        className="fixed top-4 right-20 z-50 opacity-20 hover:opacity-100 text-[10px] bg-red-500 text-white px-2 py-1 rounded"
      >
        Reset XP
      </button>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {renderScreen()}
      </div>

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
