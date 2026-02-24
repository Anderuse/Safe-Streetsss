import { AlertTriangle, Users, ShieldOff } from 'lucide-react';

interface FilterControlsProps {
  activeFilters: Set<string>;
  onFilterChange: (filters: Set<string>) => void;
}

export function FilterControls({ activeFilters, onFilterChange }: FilterControlsProps) {
  const filters = [
    { id: 'dangerous', label: 'Dangerous', Icon: AlertTriangle, color: 'bg-red-500' },
    { id: 'not-busy', label: 'Not Busy', Icon: Users, color: 'bg-amber-500' },
    { id: 'no-security', label: 'No Security', Icon: ShieldOff, color: 'bg-purple-500' }
  ];

  const toggleFilter = (filterId: string) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(filterId)) {
      newFilters.delete(filterId);
    } else {
      newFilters.add(filterId);
    }
    onFilterChange(newFilters);
  };

  return (
    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
      <div className="text-xs font-semibold text-gray-600 mb-2">Filter Reports</div>
      <div className="flex flex-col gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => toggleFilter(filter.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
              activeFilters.has(filter.id)
                ? `${filter.color} text-white`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <filter.Icon size={16} />
            <span className="text-sm">{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
