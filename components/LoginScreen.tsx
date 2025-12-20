
import React, { useState } from 'react';
import { Role, User } from '../types';
import { DAD_AVATAR, SON_AVATAR, MUM_AVATAR, DAUGHTER_AVATAR } from '../constants';
import { supabase } from '../lib/supabase';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('Son');
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError(null);

    try {
      if (isSignUp) {
        // Sign Up Flow
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // Remove emailRedirectTo if running strictly local/PWA to avoid redirect confusion
            // emailRedirectTo: window.location.origin, 
            data: {
              name: name || (role === 'Dad' ? 'Captain Dad' : role === 'Mum' ? 'Super Mum' : role === 'Son' ? 'Super Son' : 'Wonder Daughter'),
              role: role,
              avatar: role === 'Dad' ? DAD_AVATAR : role === 'Mum' ? MUM_AVATAR : role === 'Son' ? SON_AVATAR : DAUGHTER_AVATAR
            }
          },
        });

        if (authError) throw authError;

        if (authData.user) {
          // Poll for profile creation (Trigger latency)
          let retries = 5;
          let profile = null;

          while (retries > 0 && !profile) {
            await new Promise(r => setTimeout(r, 1000)); // Wait 1s
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', authData.user.id)
              .maybeSingle();
            if (data) profile = data;
            retries--;
          }

          if (profile) {
            onLogin({
              id: profile.id,
              name: profile.name,
              role: profile.role as Role,
              avatar: profile.avatar
            });
          } else {
            // Profile creation timed out (but user created)
            setError("Account created! Please try logging in now.");
            setIsSignUp(false);
          }
        }
      } else {
        // Login Flow
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;

        if (authData.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .maybeSingle();

          if (profileError) throw profileError;

          if (profile) {
            onLogin({
              id: profile.id,
              name: profile.name,
              role: profile.role as Role,
              avatar: profile.avatar
            });
          } else {
            throw new Error('Profile not found. Please contact support or try signing up again.');
          }
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background-dark flex flex-col items-center justify-center p-6 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse duration-700"></div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        <div className="w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(87,249,6,0.3)] animate-bounce duration-1000">
          <span className="material-symbols-outlined text-black text-5xl font-black filled">bolt</span>
        </div>

        <h1 className="text-4xl font-black tracking-tight text-center mb-2">Adventure Portal</h1>
        <p className="text-text-sec-dark text-center mb-8 font-medium px-4">
          Connect with your family and start the chaos!
        </p>

        <form onSubmit={handleAuth} className="w-full space-y-4 bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!isSignUp ? 'bg-primary text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isSignUp ? 'bg-primary text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-xs text-center font-bold">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {isSignUp && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/80 ml-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/80 ml-1">Role</label>
                  <div className="flex gap-2">
                    {(['Dad', 'Mum', 'Son', 'Daughter'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`flex-1 py-3 rounded-xl border border-white/10 text-xs font-bold transition-all ${role === r ? 'bg-white/20 border-primary/50 text-white' : 'bg-black/20 text-gray-400 hover:bg-black/30'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary/80 ml-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@family.fun"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary/80 ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full mt-6 bg-primary text-black py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-primary-dark active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            {isAuthenticating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              isSignUp ? 'Create Account' : 'Enter Portal'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
