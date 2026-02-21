'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User, Listing } from '@/types';
import ListingCard from '@/components/ListingCard';
import { User as UserIcon } from 'lucide-react';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
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
      fetchProfile(session.user.id);
      fetchUserListings(session.user.id);
    }
  }

  async function fetchProfile(userId: string) {
    const { data } = await supabase.from('users').select('*').eq('id', userId).single();
    setUser(data);
  }

  async function fetchUserListings(userId: string) {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
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

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-card p-8 mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
            <UserIcon className="h-12 w-12 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.name}</h1>
            <p className="text-gray-600 mb-2">{user.email}</p>
            <p className="text-lg text-primary-600 font-medium">{user.university}</p>
            {user.bio && <p className="text-gray-700 mt-3">{user.bio}</p>}
          </div>
        </div>
      </div>

      {/* User Listings */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          My Listings ({listings.length})
        </h2>
        {listings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-card">
            <p className="text-gray-600">You haven't created any listings yet</p>
            <button
              onClick={() => router.push('/listings/create')}
              className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Create Your First Listing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
