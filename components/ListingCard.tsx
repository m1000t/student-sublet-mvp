'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Listing } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Heart, MapPin, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      checkIfSaved(session.user.id);
    }
  }

  async function checkIfSaved(userId: string) {
    const { data } = await supabase
      .from('saved_listings')
      .select('id')
      .eq('user_id', userId)
      .eq('listing_id', listing.id)
      .single();
    setSaved(!!data);
  }

  async function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) return;

    if (saved) {
      await supabase
        .from('saved_listings')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', listing.id);
      setSaved(false);
    } else {
      await supabase
        .from('saved_listings')
        .insert({ user_id: user.id, listing_id: listing.id });
      setSaved(true);
    }
  }

  const imageUrl = listing.images[0] || '/placeholder.jpg';

  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 cursor-pointer">
        <div className="relative h-56">
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {user && (
            <button
              onClick={toggleSave}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition"
            >
              <Heart
                className={`h-5 w-5 ${
                  saved ? 'fill-red-500 text-red-500' : 'text-gray-700'
                }`}
              />
            </button>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {listing.title}
            </h3>
            <p className="text-lg font-bold text-primary-600">
              {formatCurrency(listing.rent)}/mo
            </p>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{listing.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(listing.start_date)} - {formatDate(listing.end_date)}
              </span>
            </div>
          </div>

          {listing.user && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Posted by <span className="font-medium">{listing.user.name}</span> at {listing.user.university}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
