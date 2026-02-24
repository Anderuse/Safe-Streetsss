import { useState } from 'react';
import { Header } from './components/Header';
import { ReportCard } from './components/ReportCard';
import { BottomNav } from './components/BottomNav';
import { ReportModal } from './components/ReportModal';
import { MapModal } from './components/MapModal';
import { AuthScreen } from './components/AuthScreen';
import type { SafetyReport } from './types';

interface UserData {
  name: string;
  email?: string;
  phone?: string;
  reportsRemaining: number;
  upvotesRemaining: number;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  const [reports, setReports] = useState<SafetyReport[]>([
    {
      id: '1',
      lat: 14.811488,
      lng: 120.893985,
      mapX: 28,
      mapY: 50,
      type: 'dangerous',
      locationName: 'Florante St near Puremart',
      address: 'Florante St, Balagtas, Bulacan',
      description: 'Dark street corner with no lighting after sunset. Limited visibility and isolated area after stores close at 8 PM.',
      timestamp: new Date('2026-02-10T20:30:00'),
      upvotes: 24,
      imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800'
    },
    {
      id: '2',
      lat: 14.809512,
      lng: 120.895123,
      mapX: 52,
      mapY: 27,
      type: 'not-busy',
      locationName: 'MHAY\'S STORE Area',
      address: 'Near MHAY\'S STORE, Balagtas, Bulacan',
      description: 'Very quiet street with minimal foot traffic especially during afternoon hours. Few people pass through this area.',
      timestamp: new Date('2026-02-11T08:15:00'),
      upvotes: 12,
      imageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800'
    },
    {
      id: '3',
      lat: 14.813245,
      lng: 120.892341,
      mapX: 88,
      mapY: 25,
      type: 'no-security',
      locationName: 'Jecaths Pet Store Corner',
      address: 'Balagtas, Bulacan',
      description: 'No security cameras visible in this corner area. No security guards or lighting at night.',
      timestamp: new Date('2026-02-10T14:20:00'),
      upvotes: 8,
      imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800'
    },
    {
      id: '4',
      lat: 14.810789,
      lng: 120.894567,
      mapX: 26,
      mapY: 63,
      type: 'dangerous',
      locationName: 'Florante St near Cabin\'s DIY Gift Shop',
      address: 'Florante St, Balagtas, Bulacan',
      description: 'Narrow street section with poor lighting. Multiple residents reported feeling unsafe walking here at night.',
      timestamp: new Date('2026-02-09T18:45:00'),
      upvotes: 31,
      imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800'
    },
    {
      id: '5',
      lat: 14.812156,
      lng: 120.891234,
      mapX: 8,
      mapY: 30,
      type: 'not-busy',
      locationName: 'Near JD Betta Fish',
      address: 'Balagtas, Bulacan',
      description: 'Isolated side street with very few people. Area becomes deserted after early evening when shops close.',
      timestamp: new Date('2026-02-08T16:20:00'),
      upvotes: 15,
      imageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800'
    },
    {
      id: '6',
      lat: 14.811234,
      lng: 120.892567,
      mapX: 44,
      mapY: 10,
      type: 'no-security',
      locationName: 'Mama Glo House Area',
      address: 'Near Mama Glo House, Balagtas, Bulacan',
      description: 'Residential area with no street lighting and no visible security measures. Completely dark at night.',
      timestamp: new Date('2026-02-11T19:15:00'),
      upvotes: 7,
      imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800'
    },
    {
      id: '7',
      lat: 14.810456,
      lng: 120.893789,
      mapX: 9,
      mapY: 18,
      type: 'dangerous',
      locationName: 'Sulok Elementary School Side Street',
      address: 'Near Sulok Elementary School, Balagtas, Bulacan',
      description: 'Poorly lit street beside the school. Reports of suspicious activity after school hours when area is empty.',
      timestamp: new Date('2026-02-07T21:00:00'),
      upvotes: 19,
      imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'feed' | 'map' | 'profile'>('feed');
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | SafetyReport['type']>('all');
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const addReport = (report: Omit<SafetyReport, 'id' | 'timestamp' | 'upvotes' | 'imageUrl'>) => {
    // Check if user has reports remaining
    if (!userData || userData.reportsRemaining <= 0) {
      alert('You have no more reports remaining. Each account has a limited number of reports.');
      return;
    }

    const newReport: SafetyReport = {
      ...report,
      id: Date.now().toString(),
      timestamp: new Date(),
      upvotes: 0,
      imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
      // Store map visual position from selectedLocation
      mapX: selectedLocation?.lat, // We're using lat field to temporarily store mapX
      mapY: selectedLocation?.lng  // We're using lng field to temporarily store mapY
    };
    setReports([newReport, ...reports]);
    
    // Decrease reports remaining
    setUserData({
      ...userData,
      reportsRemaining: userData.reportsRemaining - 1
    });
    
    setShowReportModal(false);
    setSelectedLocation(null);
    setActiveTab('map'); // Switch to map to see the new pin
  };

  const upvoteReport = (id: string) => {
    const report = reports.find(r => r.id === id);
    if (!report) return;
    
    if (userData && userData.upvotesRemaining <= 0) {
      alert('You have no more upvotes remaining. Each account has a limited number of upvotes.');
      return;
    }

    setReports(reports.map(report => 
      report.id === id ? { ...report, upvotes: report.upvotes + 1 } : report
    ));
    
    // Decrease upvotes remaining
    if (userData) {
      setUserData({
        ...userData,
        upvotesRemaining: userData.upvotesRemaining - 1
      });
    }
  };

  const deleteReport = (id: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setReports(reports.filter(report => report.id !== id));
    }
  };

  const filteredReports = activeFilter === 'all' 
    ? reports 
    : reports.filter(r => r.type === activeFilter);

  const handleMapClick = (mapX: number, mapY: number) => {
    setSelectedLocation({ lat: mapX, lng: mapY }); // Using lat/lng fields to store mapX/mapY temporarily
    setShowReportModal(true);
  };

  const handleAuthSuccess = (user: UserData) => {
    setUserData(user);
    setIsAuthenticated(true);
  };

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      {activeTab === 'feed' && (
        <main className="max-w-2xl mx-auto px-4 py-4">
          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-4 p-1 flex gap-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Reports
            </button>
            <button
              onClick={() => setActiveFilter('dangerous')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'dangerous'
                  ? 'bg-red-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Dangerous
            </button>
            <button
              onClick={() => setActiveFilter('not-busy')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'not-busy'
                  ? 'bg-amber-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Isolated
            </button>
            <button
              onClick={() => setActiveFilter('no-security')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'no-security'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              No Security
            </button>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-900 mb-1">Stay Safe, Stay Informed</h3>
            <p className="text-sm text-blue-700">
              Community-reported locations to help you navigate safely. Report areas you find concerning.
            </p>
          </div>

          {/* Reports Feed */}
          <div className="space-y-4">
            {filteredReports.map(report => (
              <ReportCard 
                key={report.id}
                report={report}
                onUpvote={upvoteReport}
                onDelete={deleteReport}
              />
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No reports match this filter</p>
            </div>
          )}
        </main>
      )}

      {activeTab === 'map' && (
        <MapModal reports={reports} onUpvote={upvoteReport} onMapClick={handleMapClick} onDelete={deleteReport} />
      )}

      {activeTab === 'profile' && (
        <main className="max-w-2xl mx-auto px-4 py-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">
                👤
              </div>
              <h2 className="font-semibold text-gray-900">{userData?.name || 'Community Member'}</h2>
              {userData?.email && <p className="text-sm text-gray-500">{userData.email}</p>}
              {userData?.phone && <p className="text-sm text-gray-500">{userData.phone}</p>}
              <p className="text-sm text-gray-400 mt-1">Active since Feb 2026</p>
            </div>

            {/* Account Limits Display */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-center">Account Limits</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{userData?.reportsRemaining || 0}</div>
                  <div className="text-xs text-gray-600 mt-1">Reports Left</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">{userData?.upvotesRemaining || 0}</div>
                  <div className="text-xs text-gray-600 mt-1">Upvotes Left</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Each account has limited actions to prevent abuse
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-700">Reports Submitted</span>
                <span className="font-semibold text-blue-600">{10 - (userData?.reportsRemaining || 10)}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-700">Helpful Votes Given</span>
                <span className="font-semibold text-blue-600">{50 - (userData?.upvotesRemaining || 50)}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-700">Community Impact</span>
                <span className="font-semibold text-green-600">
                  {(userData?.reportsRemaining || 0) < 5 || (userData?.upvotesRemaining || 0) < 25 ? 'High' : 'Good'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsAuthenticated(false);
                setUserData(null);
              }}
              className="w-full mt-6 py-3 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
            >
              Log Out
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
            <h3 className="font-semibold text-gray-900 mb-3">How SafeStreets Works</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>For reporting: Report locations you find unsafe or concerning</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>For review: Review reports from the community</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Upvote reports to help others in your area</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Check the map before your trip for safer routes</span>
              </li>
            </ul>
          </div>
        </main>
      )}

      <BottomNav 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddReport={() => setShowReportModal(true)}
      />

      {showReportModal && (
        <ReportModal 
          onClose={() => {
            setShowReportModal(false);
            setSelectedLocation(null);
          }}
          onSubmit={addReport}
          initialLocation={selectedLocation}
        />
      )}
    </div>
  );
}

export default App; 
