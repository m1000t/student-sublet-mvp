'use client';

import { Dispatch, SetStateAction } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface Filters {
  minPrice: number;
  maxPrice: number;
  location: string;
  startDate: string;
  endDate: string;
}

interface SearchFiltersProps {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
}

export default function SearchFilters({ filters, setFilters }: SearchFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-card p-6 mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <SlidersHorizontal className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Filter Listings</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="City or university"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
          </div>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Price
          </label>
          <input
            type="number"
            placeholder="$0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={filters.minPrice || ''}
            onChange={(e) =>
              setFilters({ ...filters, minPrice: Number(e.target.value) })
            }
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price
          </label>
          <input
            type="number"
            placeholder="$10000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={filters.maxPrice || ''}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: Number(e.target.value) })
            }
          />
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available From
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
