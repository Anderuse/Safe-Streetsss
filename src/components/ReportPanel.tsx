import { useState } from 'react';
import { X, AlertTriangle, Users, ShieldOff, MapPin } from 'lucide-react';
import { SafetyReport } from '../App';

interface ReportPanelProps {
  onClose: () => void;
  onSubmit: (report: Omit<SafetyReport, 'id' | 'timestamp' | 'upvotes'>) => void;
}

export function ReportPanel({ onClose, onSubmit }: ReportPanelProps) {
  const [type, setType] = useState<SafetyReport['type']>('dangerous');
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState('40.7580');
  const [lng, setLng] = useState('-73.9855');

  const reportTypes = [
    { id: 'dangerous' as const, label: 'Dangerous', Icon: AlertTriangle, color: 'bg-red-500' },
    { id: 'not-busy' as const, label: 'Not Busy/Isolated', Icon: Users, color: 'bg-amber-500' },
    { id: 'no-security' as const, label: 'Lacks Security', Icon: ShieldOff, color: 'bg-purple-500' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onSubmit({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        type,
        description: description.trim()
      });
      setDescription('');
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 z-[2000] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Report a Location</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Report Type
            </label>
            <div className="grid grid-cols-1 gap-2">
              {reportTypes.map((reportType) => (
                <button
                  key={reportType.id}
                  type="button"
                  onClick={() => setType(reportType.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                    type === reportType.id
                      ? `${reportType.color} text-white border-transparent`
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <reportType.Icon size={20} />
                  <span className="font-medium">{reportType.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="Latitude"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  placeholder="Longitude"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <MapPin size={12} />
              Click on the map or enter coordinates manually
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the safety concern..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
