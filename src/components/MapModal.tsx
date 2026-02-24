import { useState } from 'react';
import type { SafetyReport } from '../types';
import { ThumbsUp, AlertTriangle, Users, ShieldOff, X, ZoomIn, ZoomOut, MapPin, MapPinned, Trash2 } from 'lucide-react';

interface MapModalProps {
  reports: SafetyReport[];
  onUpvote: (id: string) => void;
  onMapClick: (mapX: number, mapY: number) => void;
  onDelete: (id: string) => void;
}

const getMarkerColor = (type: SafetyReport['type']) => {
  const colors = {
    dangerous: '#ef4444',
    'not-busy': '#f59e0b',
    'no-security': '#8b5cf6'
  };
  return colors[type];
};

const getMarkerIcon = (type: SafetyReport['type']) => {
  const icons = {
    dangerous: AlertTriangle,
    'not-busy': Users,
    'no-security': ShieldOff
  };
  return icons[type];
};

const getTypeLabel = (type: SafetyReport['type']) => {
  const labels = {
    dangerous: 'Dangerous Area',
    'not-busy': 'Isolated/Not Busy',
    'no-security': 'Lacks Security'
  };
  return labels[type];
};

export function MapModal({ reports, onUpvote, onMapClick, onDelete }: MapModalProps) {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [tempPin, setTempPin] = useState<{ x: number, y: number } | null>(null);

  // Google Maps screenshot URL
  const mapImageUrl = "https://i.imgur.com/ZZRarnG.png";

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.marker') || (e.target as HTMLElement).closest('.pin-dialog')) return;
    
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
      setTempPin(null);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging) {
      const dragDistance = Math.sqrt(
        Math.pow(e.clientX - (dragStart.x + pan.x), 2) + 
        Math.pow(e.clientY - (dragStart.y + pan.y), 2)
      );
      
      if (dragDistance < 5 && !e.defaultPrevented) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        setTempPin({ x, y });
      }
    }
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.marker') || (e.target as HTMLElement).closest('.pin-dialog')) return;
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      setPan({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
      setTempPin(null);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isDragging && e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];
      const dragDistance = Math.sqrt(
        Math.pow(touch.clientX - (dragStart.x + pan.x), 2) + 
        Math.pow(touch.clientY - (dragStart.y + pan.y), 2)
      );
      
      if (dragDistance < 5) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;
        
        setTempPin({ x, y });
      }
    }
    setIsDragging(false);
  };

  return (
    <div className="h-[calc(100vh-60px)] relative">
      <div 
        className="relative w-full h-full overflow-hidden touch-none"
        style={{ backgroundColor: '#F2EFE9' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Map base layer */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '50% 50%'
          }}
        >
          {/* Google Maps Screenshot Background */}
          <img 
            src={mapImageUrl}
            alt="Balagtas Bulacan Map"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            draggable={false}
            style={{ zIndex: 0 }}
          />

          {/* Report Markers */}
          {reports.filter(r => r.mapX !== undefined && r.mapY !== undefined).map((report) => {
            const Icon = getMarkerIcon(report.type);
            const color = getMarkerColor(report.type);
            
            return (
              <div
                key={report.id}
                className="marker absolute pointer-events-auto"
                style={{
                  left: `${report.mapX}%`,
                  top: `${report.mapY}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: selectedReport === report.id ? 50 : 20
                }}
              >
                {/* Danger circle */}
                <div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: color,
                    opacity: 0.15,
                    border: `2px solid ${color}`,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1
                  }}
                />
                
                {/* Marker pin */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedReport(selectedReport === report.id ? null : report.id);
                  }}
                  className="relative rounded-full shadow-lg transition-transform active:scale-95"
                  style={{
                    backgroundColor: color,
                    width: '36px',
                    height: '36px',
                    border: '3px solid white',
                    zIndex: 10
                  }}
                >
                  <Icon className="absolute inset-0 m-auto text-white" size={18} />
                </button>

                {/* Popup */}
                {selectedReport === report.id && (
                  <div className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 w-72 bg-white rounded-xl shadow-2xl p-4 z-[100] pointer-events-auto border border-gray-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReport(null);
                      }}
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                    
                    <div className="mb-2 pr-8">
                      <span className="text-sm font-semibold text-gray-900">{report.locationName}</span>
                      <p className="text-xs text-gray-500 mt-1">{report.address}</p>
                    </div>
                    
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium text-white mb-3`} style={{ backgroundColor: color }}>
                      {getTypeLabel(report.type)}
                    </span>
                    
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">{report.description}</p>
                    
                    <div className="space-y-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpvote(report.id);
                        }}
                        className="flex items-center gap-2 text-sm bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 w-full justify-center font-medium transition-colors"
                      >
                        <ThumbsUp size={14} />
                        <span>{report.upvotes} found this helpful</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(report.id);
                          setSelectedReport(null);
                        }}
                        className="flex items-center gap-2 text-sm bg-red-50 text-red-600 px-4 py-2 rounded-full hover:bg-red-100 w-full justify-center font-medium transition-colors"
                      >
                        <Trash2 size={14} />
                        <span>Delete Report</span>
                      </button>
                    </div>

                    <div 
                      className="absolute left-1/2 top-full -translate-x-1/2 -mt-px"
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: '10px solid transparent',
                        borderRight: '10px solid transparent',
                        borderTop: '10px solid white',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Temporary pin */}
        {tempPin && (
          <div 
            className="absolute"
            style={{
              left: `${tempPin.x}%`,
              top: `${tempPin.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 100
            }}
          >
            <div className="absolute inset-0 -m-4 rounded-full bg-blue-500 opacity-20 animate-ping" />
            
            <div className="relative w-10 h-10 bg-blue-600 rounded-full shadow-xl border-3 border-white flex items-center justify-center">
              <MapPin className="text-white" size={20} />
            </div>

            <div className="pin-dialog absolute left-1/2 bottom-full mb-3 -translate-x-1/2 w-64 bg-white rounded-xl shadow-2xl p-4 pointer-events-auto border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Report this location?</h3>
              <p className="text-xs text-gray-500 mb-3">
                Click "Report Here" to add a safety report at this location
              </p>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTempPin(null);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMapClick(tempPin.x, tempPin.y);
                    setTempPin(null);
                  }}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Report Here
                </button>
              </div>

              <div 
                className="absolute left-1/2 top-full -translate-x-1/2 -mt-px"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: '10px solid white',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}
              />
            </div>
          </div>
        )}

        {/* Zoom controls */}
        <div className="absolute bottom-24 right-4 bg-white rounded-xl shadow-lg overflow-hidden z-30 border border-gray-200">
          <button
            onClick={() => setZoom(prev => Math.min(3, prev * 1.3))}
            className="block w-12 h-12 hover:bg-gray-50 transition-colors border-b border-gray-200 flex items-center justify-center text-gray-700"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(0.5, prev / 1.3))}
            className="block w-12 h-12 hover:bg-gray-50 transition-colors flex items-center justify-center text-gray-700"
          >
            <ZoomOut size={20} />
          </button>
        </div>

        {/* Instructions */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2.5 rounded-full shadow-lg text-xs text-gray-600 z-30 border border-gray-200">
          <span className="font-medium">Tap anywhere to report</span> • Drag to pan • Zoom controls on right
        </div>

        {/* Attribution */}
        <div className="absolute bottom-24 left-4 text-xs text-gray-500 bg-white bg-opacity-90 px-2 py-1 rounded shadow">
          Map data ©2026 • Balagtas, Bulacan • {reports.filter(r => r.mapX !== undefined).length} reports
        </div>
      </div>
    </div>
  );
}