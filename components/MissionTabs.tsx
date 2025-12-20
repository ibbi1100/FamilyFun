
import React from 'react';
import { NavTab } from '../types';

interface MissionTabsProps {
  activeTab: NavTab;
  onChange: (tab: NavTab) => void;
}

const MissionTabs: React.FC<MissionTabsProps> = ({ activeTab, onChange }) => {
  return (
    <div className="px-4 mb-6 sticky top-[156px] z-10">
      <div className="flex p-1 bg-gray-200/50 dark:bg-surface-dark/50 backdrop-blur-md rounded-full shadow-inner">
        <button 
          onClick={() => onChange(NavTab.Active)}
          className={`flex-1 py-2.5 px-4 rounded-full text-center text-sm font-bold transition-all duration-200 ${
            activeTab === NavTab.Active 
              ? 'bg-surface-light dark:bg-gray-700 text-text-main-light dark:text-white shadow-md' 
              : 'text-text-sec-light dark:text-text-sec-dark'
          }`}
        >
          Active Madness 🔥
        </button>
        <button 
          onClick={() => onChange(NavTab.History)}
          className={`flex-1 py-2.5 px-4 rounded-full text-center text-sm font-bold transition-all duration-200 ${
            activeTab === NavTab.History 
              ? 'bg-surface-light dark:bg-gray-700 text-text-main-light dark:text-white shadow-md' 
              : 'text-text-sec-light dark:text-text-sec-dark'
          }`}
        >
          Hall of Fame 🏆
        </button>
      </div>
    </div>
  );
};

export default MissionTabs;
