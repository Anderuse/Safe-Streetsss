import { ThumbsUp, MapPin, Clock, AlertTriangle, Users, ShieldOff, Trash2 } from 'lucide-react';
import type { SafetyReport } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ReportCardProps {
  report: SafetyReport;
  onUpvote: (id: string) => void;
  onDelete: (id: string) => void;
}

const typeConfig = {
  dangerous: {
    label: 'Dangerous',
    color: 'bg-red-500',
    icon: AlertTriangle
  },
  'not-busy': {
    label: 'Isolated',
    color: 'bg-amber-500',
    icon: Users
  },
  'no-security': {
    label: 'No Security',
    color: 'bg-purple-500',
    icon: ShieldOff
  }
};

export function ReportCard({ report, onUpvote, onDelete }: ReportCardProps) {
  const config = typeConfig[report.type];
  const Icon = config.icon;

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        <ImageWithFallback 
          src={report.imageUrl}
          alt={report.locationName}
          className="w-full h-full object-cover"
        />
        
        {/* Type Badge */}
        <div className={`absolute top-3 left-3 ${config.color} text-white px-3 py-1 rounded-full flex items-center gap-1.5 text-sm shadow-lg`}>
          <Icon size={14} />
          <span className="font-medium">{config.label}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{report.locationName}</h3>
        
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
          <MapPin size={14} />
          <span>{report.address}</span>
        </div>

        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
          {report.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock size={12} />
            <span>{formatTimeAgo(report.timestamp)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpvote(report.id)}
              className="flex items-center gap-1.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 px-3 py-1.5 rounded-full transition-colors group"
            >
              <ThumbsUp size={14} className="group-hover:fill-current" />
              <span className="text-sm font-medium">{report.upvotes}</span>
            </button>

            <button
              onClick={() => onDelete(report.id)}
              className="flex items-center gap-1 bg-gray-100 hover:bg-red-50 hover:text-red-600 p-1.5 rounded-full transition-colors group"
              title="Delete report"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}