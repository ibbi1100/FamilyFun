
import React, { useState } from 'react';
import { Role, User } from '../types';
import { DAD_AVATAR, SON_AVATAR } from '../constants';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const users: User[] = [
    { id: '1', name: 'Captain Dad', role: 'Dad', avatar: DAD_AVATAR },
    { id: '2', name: 'Super Son', role: 'Son', avatar: SON_AVATAR }
  ];

  const handleIdentityLogin = (user: User) => {
    setSelectedUserId(user.id);
    setIsAuthenticating(true);
    // Simulate a brief authentication verification
    setTimeout(() => {
      onLogin(user);
    }, 800);
  };

  const handleGoogleLogin = () => {
    setIsAuthenticating(true);
    // Simulate Google OAuth flow
    setTimeout(() => {
      // Defaulting to the first user for the demo "Sign in with Google" flow
      onLogin(users[0]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background-dark flex flex-col items-center justify-center p-6 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse duration-700"></div>

      {isAuthenticating && (
        <div className="absolute inset-0 z-[110] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-primary font-black uppercase tracking-widest text-sm animate-pulse">Syncing Portal...</p>
        </div>
      )}

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        <div className="w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(87,249,6,0.3)] animate-bounce duration-1000">
          <span className="material-symbols-outlined text-black text-5xl font-black filled">bolt</span>
        </div>

        <h1 className="text-4xl font-black tracking-tight text-center mb-2">Adventure Portal</h1>
        <p className="text-text-sec-dark text-center mb-12 font-medium px-4">Connect with your family and start the chaos!</p>

        <div className="w-full space-y-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-center text-primary/60 mb-6">Choose Your Identity</p>
          
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleIdentityLogin(user)}
              disabled={isAuthenticating}
              className={`w-full group relative flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl transition-all active:scale-95 overflow-hidden ${
                selectedUserId === user.id ? 'ring-2 ring-primary bg-white/10' : 'hover:bg-white/10 hover:border-primary/50'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <img 
                src={user.avatar} 
                className="w-14 h-14 rounded-full border-2 border-primary/20 object-cover" 
                alt={user.name} 
              />
              <div className="flex flex-col items-start">
                <span className="text-lg font-bold">{user.name}</span>
                <span className="text-xs text-text-sec-dark font-bold uppercase tracking-widest">{user.role}</span>
              </div>
              <span className="material-symbols-outlined ml-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity">login</span>
            </button>
          ))}
        </div>

        <div className="mt-12 w-full pt-8 border-t border-white/5 flex flex-col items-center gap-4">
          <button 
            onClick={handleGoogleLogin}
            disabled={isAuthenticating}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-black rounded-full font-bold text-sm shadow-xl active:scale-95 transition-transform hover:bg-gray-100 disabled:opacity-50"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Sign in with Google Account
          </button>
          <p className="text-[10px] text-gray-500 text-center px-8 leading-relaxed">
            By signing in, you agree to embark on potentially embarrassing family adventures.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
