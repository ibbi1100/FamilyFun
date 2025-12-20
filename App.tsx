
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
import { NavTab, Activity, AppScreen, SavedMonster, User } from './types';
import { INITIAL_MISSIONS, SON_AVATAR, DAD_AVATAR } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>(NavTab.Active);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.Hub);
  const [activeMissions, setActiveMissions] = useState<Activity[]>(INITIAL_MISSIONS);
  const [historyMissions, setHistoryMissions] = useState<Activity[]>([]);
  const [savedMonsters, setSavedMonsters] = useState<SavedMonster[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [streak] = useState(0);
  const [level, setLevel] = useState(1);

  const otherUser = currentUser?.role === 'Dad' 
    ? { name: 'Super Son', avatar: SON_AVATAR, role: 'Son' } 
    : { name: 'Captain Dad', avatar: DAD_AVATAR, role: 'Dad' };

  // Live simulation: Random messages from "the other user"
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

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setNotification(`Welcome to the Chaos, ${user.name}! 🌟`);
  };

  const handleCompleteMission = (id: string) => {
    const mission = activeMissions.find(m => m.id === id);
    if (mission) {
      const newXP = totalXP + mission.xp;
      setTotalXP(newXP);
      setActiveMissions(prev => prev.filter(m => m.id !== id));
      setHistoryMissions(prev => [mission, ...prev]);
      setNotification(`BOOM! +${mission.xp} XP! ⚡️`);
      
      // Level up every 500 XP
      const nextLevel = Math.floor(newXP / 500) + 1;
      if (nextLevel > level) {
        setLevel(nextLevel);
        setNotification(`LEVEL UP! You are now Level ${nextLevel}! 🏆`);
      }
    }
  };

  const handleAddChallenge = (newChallenge: Activity) => {
    setActiveMissions(prev => [newChallenge, ...prev]);
    setActiveTab(NavTab.Active);
    setNotification(`Challenge BROADCASTED to ${otherUser.name}! 📱`);
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
                      <MissionCard key={m.id} mission={m} onComplete={handleCompleteMission} />
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
                    <MissionCard key={m.id} mission={m} onComplete={() => {}} isHistory />
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
        totalXP={totalXP}
        streak={streak}
        level={level}
        user={currentUser}
        otherUserAvatar={otherUser.avatar}
      />
      
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
