import { Home, Map, User, Plus } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'feed' | 'map' | 'profile';
  onTabChange: (tab: 'feed' | 'map' | 'profile') => void;
  onAddReport: () => void;
}

export function BottomNav({ activeTab, onTabChange, onAddReport }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-2xl mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          <button
            onClick={() => onTabChange('feed')}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'feed' 
                ? 'text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Home size={22} />
            <span className="text-xs font-medium">Feed</span>
          </button>

          <button
            onClick={() => onTabChange('map')}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'map' 
                ? 'text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Map size={22} />
            <span className="text-xs font-medium">Map</span>
          </button>

          <button
            onClick={onAddReport}
            className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors -mt-6"
          >
            <Plus size={28} />
          </button>

          <button
            onClick={() => onTabChange('profile')}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'profile' 
                ? 'text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <User size={22} />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
