'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Listing } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { MapPin, Calendar, User, Heart, Trash2, Edit, MessageCircle } from 'lucide-react';

export default function ListingDetail() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);

  useEffect(() => {
    checkUser();
    fetchListing();
  }, [params.id]);

  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user) {
      setCurrentUser(session.user);
      checkIfSaved(session.user.id);
    }
  }

  async function fetchListing() {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          user:users(*)
        `)
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setListing(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function checkIfSaved(userId: string) {
    const { data } = await supabase
      .from('saved_listings')
      .select('id')
      .eq('user_id', userId)
      .eq('listing_id', params.id)
      .single();
    setSaved(!!data);
  }

  async function toggleSave() {
    if (!currentUser) return;

    if (saved) {
      await supabase
        .from('saved_listings')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('listing_id', params.id);
      setSaved(false);
    } else {
      await supabase
        .from('saved_listings')
        .insert({ user_id: currentUser.id, listing_id: params.id });
      setSaved(true);
    }
  }

  async function deleteListing() {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    await supabase.from('listings').delete().eq('id', params.id);
    router.push('/');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold">Listing not found</h1>
      </div>
    );
  }

  const isOwner = currentUser?.id === listing.user_id;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {listing.images.length > 0 ? (
          listing.images.map((image, index) => (
            <div key={index} className="relative h-80 rounded-xl overflow-hidden">
              <Image
                src={image}
                alt={`${listing.title} - Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))
        ) : (
          <div className="relative h-80 rounded-xl overflow-hidden bg-gray-200">
            <div className="flex items-center justify-center h-full text-gray-500">
              No images available
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>{listing.location}</span>
              </div>
            </div>
            {currentUser && !isOwner && (
              <button
                onClick={toggleSave}
                className="p-3 rounded-full hover:bg-gray-100 transition"
              >
                <Heart
                  className={`h-6 w-6 ${
                    saved ? 'fill-red-500 text-red-500' : 'text-gray-700'
                  }`}
                />
              </button>
            )}
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl shadow-card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Details</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="font-medium">
                    {formatDate(listing.start_date)} - {formatDate(listing.end_date)}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t">
                <p className="text-2xl font-bold text-primary-600">
                  {formatCurrency(listing.rent)}
                  <span className="text-base text-gray-600 font-normal">/month</span>
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Host Info */}
          {listing.user && (
            <div className="bg-white rounded-xl shadow-card p-6 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{listing.user.name}</h3>
                  <p className="text-sm text-gray-600">{listing.user.university}</p>
                </div>
              </div>
              {listing.user.bio && (
                <p className="text-sm text-gray-700 mb-4">{listing.user.bio}</p>
              )}
              {currentUser && !isOwner && (
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                  <MessageCircle className="h-5 w-5" />
                  <span>Message Host</span>
                </button>
              )}
            </div>
          )}

          {/* Owner Actions */}
          {isOwner && (
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="font-semibold mb-4">Manage Listing</h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push(`/listings/${listing.id}/edit`)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Edit className="h-5 w-5" />
                  <span>Edit Listing</span>
                </button>
                <button
                  onClick={deleteListing}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Delete Listing</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
