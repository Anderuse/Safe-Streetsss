import { useState } from 'react';
import { X, AlertTriangle, Users, ShieldOff, MapPin } from 'lucide-react';
import type { SafetyReport } from '../types';

interface ReportPanelProps {
  onClose: () => void;
  onSubmit: (report: Omit<SafetyReport, 'id' | 'timestamp' | 'upvotes' | 'imageUrl'>) => void;
  initialLocation?: { lat: number; lng: number } | null;
}

export function ReportModal({ onClose, onSubmit, initialLocation }: ReportPanelProps) {
  const [type, setType] = useState<SafetyReport['type']>('dangerous');
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState(initialLocation?.lat.toString() || '14.811488');
  const [lng, setLng] = useState(initialLocation?.lng.toString() || '120.893985');

  const reportTypes = [
    { id: 'dangerous' as const, label: 'Dangerous Area', Icon: AlertTriangle, color: 'bg-red-500' },
    { id: 'not-busy' as const, label: 'Isolated/Not Busy', Icon: Users, color: 'bg-amber-500' },
    { id: 'no-security' as const, label: 'Lacks Security', Icon: ShieldOff, color: 'bg-purple-500' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationName.trim() && address.trim() && description.trim()) {
      onSubmit({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        type,
        locationName: locationName.trim(),
        address: address.trim(),
        description: description.trim()
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl sm:rounded-t-lg">
          <h2 className="font-semibold text-gray-900">Report Location</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What's the concern?
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location Name
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g., West 42nd Street"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g., Between 8th & 9th Ave, Manhattan"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {initialLocation && (
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700 flex items-center gap-2">
                <MapPin size={16} />
                <span className="font-medium">Pin location selected on map</span>
              </p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what makes this location unsafe..."
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}