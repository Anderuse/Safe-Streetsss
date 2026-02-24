import { ShieldAlert } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <ShieldAlert className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">SafeStreets</h1>
            <p className="text-xs text-gray-500">Community Safety Network</p>
          </div>
        </div>
      </div>
    </header>
  );
}
