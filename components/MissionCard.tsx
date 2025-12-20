import React, { useState, useRef } from 'react';
import { Activity } from '../types';
import { supabase } from '../lib/supabase';
import { generateJudgeCommentary } from '../services/aiService';

interface MissionCardProps {
  mission: Activity;
  onComplete: (id: string) => void;
  onApprove: (id: string, judgeComment: string) => void; // New callback
  onReject: (id: string) => void;
  isHistory?: boolean;
  userRole?: string; // To know if we are Owner or User
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, onComplete, onApprove, onReject, isHistory = false, userRole }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [judgeVerdict, setJudgeVerdict] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getOwnerStyles = () => {
    switch (mission.owner) {
      case 'Dad':
        return {
          bar: 'bg-blue-600',
          badge: 'bg-blue-100 text-blue-700',
          label: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-500/5',
          border: 'border-blue-500/10',
          xpText: 'text-blue-600 dark:text-blue-300',
          title: "Dad's Task",
          initial: 'D'
        };
      case 'Son':
        return {
          bar: 'bg-orange-500',
          badge: 'bg-orange-100 text-orange-700',
          label: 'text-orange-500 dark:text-orange-400',
          bg: 'bg-orange-500/5',
          border: 'border-orange-500/10',
          xpText: 'text-orange-600 dark:text-orange-300',
          title: "Son's Task",
          initial: 'S'
        };
      case 'Mum':
        return {
          bar: 'bg-teal-500',
          badge: 'bg-teal-100 text-teal-700',
          label: 'text-teal-500 dark:text-teal-400',
          bg: 'bg-teal-500/5',
          border: 'border-teal-500/10',
          xpText: 'text-teal-600 dark:text-teal-300',
          title: "Mum's Task",
          initial: 'M'
        };
      case 'Daughter':
        return {
          bar: 'bg-pink-500',
          badge: 'bg-pink-100 text-pink-700',
          label: 'text-pink-500 dark:text-pink-400',
          bg: 'bg-pink-500/5',
          border: 'border-pink-500/10',
          xpText: 'text-pink-600 dark:text-pink-300',
          title: "Daughter's Task",
          initial: 'D'
        };
      default:
        return {
          bar: 'bg-purple-600',
          badge: 'bg-purple-100 text-purple-700',
          label: 'text-purple-600 dark:text-purple-400',
          bg: 'bg-purple-500/5',
          border: 'border-purple-500/10',
          xpText: 'text-purple-600 dark:text-purple-300',
          title: "Team Face Off",
          initial: 'VS'
        };
    }
  };

  const styles = getOwnerStyles();

  // HISTORY / COMPLETED CARD
  if (isHistory && mission.status === 'completed') {
    return (
      <div className="relative overflow-hidden rounded-[2rem] bg-gray-50 dark:bg-white/5 p-6 border border-black/5 dark:border-white/5 opacity-80 group grayscale hover:grayscale-0 transition-all duration-500">
        <div className="absolute top-0 left-0 w-2 h-full bg-primary-dark/50"></div>
        <div className="flex gap-6 items-center">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] font-black">check</span> VICTORY
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Completed</span>
            </div>
            <h3 className="text-gray-400 dark:text-gray-500 text-xl font-black leading-tight line-through">
              {mission.title}
            </h3>
          </div>
          <div className="shrink-0 text-center">
            {mission.proof_url && (
              <a href={mission.proof_url} target="_blank" rel="noreferrer" className="block w-10 h-10 rounded-lg bg-gray-200 mb-1 overflow-hidden">
                <img src={mission.proof_url} className="w-full h-full object-cover" />
              </a>
            )}
            <p className="text-2xl font-black text-primary-dark dark:text-primary">+{mission.xp}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to 'proofs' bucket
      const { error: uploadError } = await supabase.storage
        .from('proofs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get URL
      const { data: { publicUrl } } = supabase.storage
        .from('proofs')
        .getPublicUrl(filePath);

      // Update Mission to Pending Approval
      const { error: updateError } = await supabase
        .from('missions')
        .update({
          proof_url: publicUrl,
          status: 'pending_approval'
        })
        .eq('id', mission.id);

      if (updateError) throw updateError;

      // Optimistic UI Update handled by subscription in App.tsx ideally, 
      // but we can assume parent will refresh or we trigger a callback if needed.
      // For now, we wait for Supabase realtime.

    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to upload proof. Ensure 'proofs' bucket exists and is public!");
    } finally {
      setIsUploading(false);
    }
  };

  const isOwner = userRole === mission.owner || mission.owner === 'Shared';
  // Simplified logic: If I created it, I approve it? 
  // OR: If I am the "Owner" role (e.g. Dad task), then Dad approves it?
  // Let's go with: The person who assigned the task (Owner Role) approves it. 
  // If it's a Shared task, anyone can approve (simplified).

  const handleJudge = async (approved: boolean) => {
    if (approved) {
      const comment = await generateJudgeCommentary(mission.title, true);
      onApprove(mission.id, comment);
    } else {
      const comment = await generateJudgeCommentary(mission.title, false);
      alert(`Judge Says: ${comment}`); // Simple alert for rejection for now
      onReject(mission.id);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-surface-dark p-6 shadow-xl border-2 border-transparent hover:border-primary/30 transition-all duration-500 hover:-translate-y-1">
      <div className={`absolute top-0 left-0 w-2 h-full ${styles.bar} rounded-l-[2.5rem]`}></div>
      <div className="flex gap-6">
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${styles.badge}`}>
                {styles.initial}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${styles.label}`}>
                {styles.title}
              </span>
              {mission.status === 'pending_approval' && (
                <span className="bg-yellow-400 text-black px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest animate-pulse">
                  Judge Reviewing
                </span>
              )}
            </div>
            <h3 className="text-text-main-light dark:text-white text-2xl font-black leading-tight mb-2 tracking-tight">
              {mission.title}
            </h3>
            <p className="text-text-sec-light dark:text-text-sec-dark text-sm leading-relaxed font-medium">
              {mission.description}
            </p>
          </div>

          <div className="mt-6">
            {mission.status === 'active' ? (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full bg-gray-100 hover:bg-black hover:text-white dark:bg-white/5 dark:hover:bg-primary text-black dark:text-white dark:hover:text-black transition-all py-4 px-6 rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest active:scale-95 border border-black/5 dark:border-white/5"
                >
                  {isUploading ? (
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                  ) : (
                    <span className="material-symbols-outlined text-2xl font-black">add_a_photo</span>
                  )}
                  {isUploading ? 'Uploading...' : 'Submit Proof'}
                </button>
              </>
            ) : mission.status === 'pending_approval' ? (
              // APPROVAL STATE
              <div className="flex flex-col gap-2">
                {mission.proof_url && (
                  <div className="h-32 w-full rounded-xl overflow-hidden bg-black/10 relative">
                    <img src={mission.proof_url} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white font-black uppercase tracking-widest opacity-0 hover:opacity-100 transition-opacity">
                      View
                    </div>
                  </div>
                )}
                {/* Logic: Only Owners can approve? For simplicity, anyone can approve for now to prevent deadlock if User role logic is tricky */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleJudge(false)}
                    className="flex-1 bg-red-100 text-red-600 py-3 rounded-xl font-black text-xs uppercase hover:bg-red-200"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleJudge(true)}
                    className="flex-[2] bg-green-500 text-white py-3 rounded-xl font-black text-xs uppercase shadow-lg hover:bg-green-400 hover:scale-105 transition-transform"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="w-24 shrink-0 flex flex-col items-center">
          <div className={`aspect-square w-full rounded-3xl ${styles.bg} ${styles.border} border flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
            <span className="text-5xl drop-shadow-md">{mission.emoji}</span>
          </div>
          <div className={`w-full text-center ${styles.bg} rounded-xl py-2 px-1 border-2 ${styles.border}`}>
            <p className="text-[8px] font-black uppercase opacity-60 mb-0.5 tracking-widest">Reward</p>
            <p className={`font-black text-xl leading-none italic ${styles.xpText}`}>
              {mission.xp} <span className="text-[10px] uppercase">XP</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionCard;
