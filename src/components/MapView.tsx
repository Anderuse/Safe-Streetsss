import { useState, useRef, useEffect } from 'react';
import { SafetyReport } from '../App';
import { ThumbsUp, AlertTriangle, Users, ShieldOff, X } from 'lucide-react';

interface MapViewProps {
  reports: SafetyReport[];
  onReportClick: (id: string) => void;
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

export function MapView({ reports, onReportClick }: MapViewProps) {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  // Google Maps screenshot URL - Replace this with your actual screenshot
  const mapImageUrl = "https://i.ibb.co/cKr8PLcC/image-2026-02-15-091639917.png";

  // Convert lat/lng to pixel coordinates on the map image
  const latLngToPixel = (lat: number, lng: number) => {
    // Base center point for Balagtas, Bulacan (Florante St area)
    const centerLat = 14.8115;  // Approximate center of your map area
    const centerLng = 120.8652; // Approximate center of your map area
    
    // Scale factor - adjust this to match your map screenshot zoom level
    const scale = 50000 * zoom;
    
    return {
      x: (lng - centerLng) * scale + pan.x,
      y: -(lat - centerLat) * scale + pan.y
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.marker')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev * delta)));
  };

  return (
    <div 
      ref={mapRef}
      className="relative w-full h-full overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Google Maps screenshot as background */}
      <div 
        className="absolute inset-0 bg-center bg-cover"
        style={{
          backgroundImage: `url(${mapImageUrl})`,
          backgroundSize: `${100 * zoom}%`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
          filter: 'brightness(0.95)'
        }}
      />

      {/* Map markers */}
      <div className="absolute inset-0">
        {reports.map((report) => {
          const pos = latLngToPixel(report.lat, report.lng);
          const Icon = getMarkerIcon(report.type);
          const color = getMarkerColor(report.type);
          
          return (
            <div
              key={report.id}
              className="marker absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`
              }}
            >
              {/* Danger radius circle */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: `${80 * zoom}px`,
                  height: `${80 * zoom}px`,
                  backgroundColor: color,
                  opacity: 0.15,
                  border: `2px solid ${color}`,
                  borderOpacity: 0.3,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
              
              {/* Marker pin */}
              <button
                onClick={() => setSelectedReport(selectedReport === report.id ? null : report.id)}
                className="relative z-10 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
                style={{
                  backgroundColor: color,
                  width: `${32 * Math.min(zoom, 1.5)}px`,
                  height: `${32 * Math.min(zoom, 1.5)}px`,
                  border: '3px solid white'
                }}
              >
                <Icon className="absolute inset-0 m-auto text-white" size={18 * Math.min(zoom, 1.5)} />
              </button>

              {/* Popup */}
              {selectedReport === report.id && (
                <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-64 bg-white rounded-lg shadow-xl p-4 z-20 pointer-events-auto">
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                  
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-semibold text-sm">{getTypeLabel(report.type)}</span>
                    <button
                      onClick={() => onReportClick(report.id)}
                      className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                    >
                      <ThumbsUp size={12} />
                      <span>{report.upvotes}</span>
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">{report.description}</p>
                  
                  <p className="text-xs text-gray-500">
                    {report.timestamp.toLocaleDateString()} at {report.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>

                  {/* Arrow pointer */}
                  <div 
                    className="absolute left-1/2 top-full -translate-x-1/2 -mt-px"
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: '8px solid transparent',
                      borderRight: '8px solid transparent',
                      borderTop: '8px solid white'
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg overflow-hidden z-[1000]">
        <button
          onClick={() => setZoom(prev => Math.min(3, prev * 1.2))}
          className="block w-10 h-10 hover:bg-gray-100 transition-colors border-b border-gray-200"
        >
          +
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(0.5, prev / 1.2))}
          className="block w-10 h-10 hover:bg-gray-100 transition-colors"
        >
          −
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow text-xs text-gray-600">
        Drag to pan • Scroll to zoom
      </div>
    </div>
  );
}