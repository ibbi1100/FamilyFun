
import { Activity, MonsterPart } from './types';

export const DAD_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuA8RelFBF05jBD9F6D3IUDAHT_11EVDEDHw2m8-nCfycP1C5K4AoHNNXlKjSMfJtBAWg3YKXpzjJhXlZva-t-vptgamsXXGk3WIezIBJMiuWUPw45YIR9rAwwuZGZ0fpcGn4HVGV-FI6EHpjgKsPxjeakfeEcinXh-HIji736C6nMjBTtWD2pZfdwEndWnxrGWV8bdNIU5AF-gjru4EBy576bLWgYWxe2ehQJs8hzCMASrTfXsluxj4acM-DwLyxSth1KRzQTZ7k2c";
export const SON_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuBwXkgWPF2ox8Wqr-Q_OlHMrjvRT5Vy3aAhO4BRZCDTYF9gXVK6dpryCgUMg58Sg-Ftwm-J33Puf1diwjC_erlsp_4SagWXP9r4TmemtXlRJjmynik-KV4XAJ2r1McM5JvDIpqBIebII9EG4cu2rRHLDnr7NBr_6ur7rZ-Z5l4OtmPJtdXhllnX9aGyh3pjyv71JT9reI0J5EdkmaohtgAI8-L6eCfUc7lqBq1g9rjR99ZODtLEZ9JM0otc9szlE0HL3iMBYZ2y4v4";

export const INITIAL_MISSIONS: Activity[] = [
  {
    id: '1',
    title: 'Walk backwards for 2 mins',
    description: 'No looking over your shoulder! Safety first, but silliness second.',
    duration: '2 min',
    xp: 50,
    owner: 'Dad',
    emoji: '🚶‍♂️'
  },
  {
    id: '2',
    title: 'Talk in a robot voice',
    description: 'You must answer every question like a robot for the next 5 minutes. Beep boop.',
    duration: '5 min',
    xp: 30,
    owner: 'Son',
    emoji: '🤖'
  },
  {
    id: '3',
    title: 'Staring Contest',
    description: 'First one to blink does the dishes tonight! No smiling allowed.',
    duration: '1 min',
    xp: 100,
    owner: 'Shared',
    emoji: '👀'
  }
];

export const SKIN_TONES = [
  '#57f906', '#FF4081', '#7C4DFF', '#40C4FF', '#FFAB40', '#212121'
];

export const MONSTER_HEADS: MonsterPart[] = [
  { id: 'h1', name: 'Cyclops', category: 'Heads', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeSb12vWJMEQYIQS8GKpgzkHMkfn1e-f1eBkMm8msDVEFx56h5lawBOJKXjbIcEt2sM9OryhJnESq2HfR2EsqpEi7jTuhv0LCVVSUvwrHAmqEFcCfeHDeWITa0uvhJs_HqIx2ou02W1mKXN9g06S4dylkcEn-mEwmnMhPfIkxVSMMWQosl7N_ZsmDZd5kQfYu-YGjGDo4xKMi96SrqWCKz8-QR5ITJIJO9IPYBTKGrigQyHoWf0j6RM6aPKHidCzPOQ3_IDt-LD6Q' },
  { id: 'h2', name: 'Tri-Horn', category: 'Heads', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWlg1cx7hLh9iqgYmOy8MlYZcp7oBlvxqTxxKIb_r4iv3ZB9YpcYK9lLPlTHoWLnMWYO7d41klVU2APTYgk26qdECGFf6h5ijgwrue0ICUyZSc3wt396XF21TXddYw3wkdrKPOyu46mxYn6KAZrbMolEIGgvU9XsE0_gJysYKRcsnQKeXUmrKnIH5ytNIHdssoTujSszYCSFzEszB2BYyvruExSnfMC0g4m-c1CBLNtcBEgp-61qCmWRUiRtdnoTQy5vXf6wKJGWE' },
  { id: 'h3', name: 'Slime', category: 'Heads', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHHb6CVLphT3kGc8a9nswhkj7pi2PU5bou0OMQ-gyPtE0jxJF1N0ALWHIg4c3k6JdI4MRso1W8CxfaepqSTvnUp1P472gZnuusPV4cwUZBttfOp59aOku0250yJl_d472xYcSpkZod9zTQJDIs34zK7WhEaKRvQh5RP1GxajMma7R1YwivI4sMTMKBQgbeUAFRMXgrsMk7oAbOMC9QlRaPFmpwjzrP4rie4cvTbcqOs8dNGQ8dSwJF4lDeG7XgEkfnWOX8haFnt6Q' },
  { id: 'h4', name: 'Fangs', category: 'Heads', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEtIEThyPzH9m-VPwI-hjh9XedS1xVCOEkxIiQ4IdT1BgzY2gFU24xpJAk6jz_vWH6_VEp59g5etlsS8qYWWnS8fzqaSWHP8mCAs50pREZSxdkVX9dQ_DKHD3HHXNrfb29ed3uXuxg5NY_vkMyNtfdOWIy_yaOgHPc2WKq8_y5gn6U_PuOMildFjXlsyEwV6d20_rwHdqObtJkgwxBYKwKU81sL0bysRlxiT7MeuZ8PkP3X7iUjDImfjJOUDxh_AMJ2uASL7GJtWY' },
  { id: 'h5', name: 'Furry', category: 'Heads', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBf_VZri4YjK1XtqhzjjM_bLMtWkHBgALwjhCucL4XCLqnuT-jdfI3vZhLl3Cx0qlejLUnUN5Uh5xReusJNQBmIN47UZ7Y1IeGtHtFDWKXbIaZjvPiJn0kEkb4xlCe3fJnU5d86I_2kVvMSdjlExyST9mTJgEVrBODHUcBP64oPuMH5cxDmilaQrurKBG8UScGIt3CXs8Vl7dQgJf-fuSyvROxUHRx9rmfCCRpyeCSOar5DC5rqlUcIitSmwDPga8MEBTuXrhgUZQU' },
];

export const MONSTER_BASE = "https://lh3.googleusercontent.com/aida-public/AB6AXuCrUmDvR7l3rrQxOWFAADyMnp1UAKZbY0ixrDUrLhmBOAQcdmNpUph2tl82VbQwWHlphAcXE9FyXwAhQEMdLZ_59hXQwFuNw4-lyiyYpsLeoZ5rfWbfz2Al85qwcsQXmFb9uPwKy5LHCxCZl6kMzf7eAg6IVx3QiAsruA-BNxnDOsJm3jTZEaaQ5zma1rXF7kvbvSq8hxwcbSGJdsIrjDeKLf_DHwQaNIDMimUJ9AEkj1vFWR_GQT_3oIbqVJK7fwYMAga16nYd0Cs";

export const SOUND_FX = [
  { name: 'Boing', color: 'bg-pink-400 hover:bg-pink-500', icon: 'sprint', freq: 440 },
  { name: 'Crash', color: 'bg-cyan-400 hover:bg-cyan-500', icon: 'warning', freq: 100 },
  { name: 'Zip', color: 'bg-amber-400 hover:bg-amber-500', icon: 'bolt', freq: 880 },
  { name: 'Bonk', color: 'bg-purple-400 hover:bg-purple-500', icon: 'gavel', freq: 220 },
  { name: 'Splat', color: 'bg-lime-500 hover:bg-lime-600', icon: 'ink_highlighter', freq: 150 },
  { name: 'Horn', color: 'bg-rose-400 hover:bg-rose-500', icon: 'campaign', freq: 300 }
];
