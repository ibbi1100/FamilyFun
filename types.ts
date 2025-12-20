
export type Role = 'Dad' | 'Mum' | 'Son' | 'Daughter';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  duration: string;
  xp: number;
  owner: Role | 'Shared';
  emoji: string;
  status?: 'active' | 'pending_approval' | 'completed';
  proof_url?: string;
  created_by?: string;
}

export enum NavTab {
  Active = 'Active',
  History = 'History'
}

export enum AppScreen {
  Main = 'Main',
  MonsterMashup = 'MonsterMashup',
  PlayerStats = 'PlayerStats',
  SillySoundboard = 'SillySoundboard',
  StoryStarter = 'StoryStarter',
  ScavengerHunt = 'ScavengerHunt',
  MysteryJar = 'MysteryJar',
  Hub = 'Hub',
  Login = 'Login'
}

export type MonsterCategory = 'Heads' | 'Torsos' | 'Legs' | 'Extras';

export interface MonsterPart {
  id: string;
  imageUrl: string;
  category: MonsterCategory;
  name: string;
}

export interface SavedMonster {
  id: string;
  head: MonsterPart;
  skin: string;
  name: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  points: number;
  level: number;
  streak: number;
}
