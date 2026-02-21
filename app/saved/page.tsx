'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Listing } from '@/types';
import ListingCard from '@/components/ListingCard';
import { Heart } from 'lucide-react';

export default function SavedListings() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.push('/auth/login');
    } else {
      fetchSavedListings(session.user.id);
    }
  }

  async function fetchSavedListings(userId: string) {
    try {
      const { data, error } = await supabase
        .from('saved_listings')
        .select(`
          listing:listings(
            *,
            user:users(*)
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      const savedListings = data.map((item: any) => item.listing).filter(Boolean);
      setListings(savedListings);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Listings</h1>
        <p className="text-gray-600">
          {listings.length} {listings.length === 1 ? 'listing' : 'listings'} saved
        </p>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved listings yet</h3>
          <p className="text-gray-600">Start exploring and save your favorites!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
