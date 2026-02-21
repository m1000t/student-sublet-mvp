'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Listing } from '@/types';
import ListingCard from '@/components/ListingCard';
import SearchFilters from '@/components/SearchFilters';
import { Search } from 'lucide-react';

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 10000,
    location: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, listings]);

  async function fetchListings() {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          user:users(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
      setFilteredListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = [...listings];

    if (filters.minPrice > 0) {
      filtered = filtered.filter((l) => l.rent >= filters.minPrice);
    }
    if (filters.maxPrice < 10000) {
      filtered = filtered.filter((l) => l.rent <= filters.maxPrice);
    }
    if (filters.location) {
      filtered = filtered.filter((l) =>
        l.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredListings(filtered);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Find Your Perfect Student Sublet
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect with verified students for short-term housing
        </p>
      </div>

      {/* Search Filters */}
      <SearchFilters filters={filters} setFilters={setFilters} />

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'} available
        </p>
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
          <p className="text-gray-600">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
