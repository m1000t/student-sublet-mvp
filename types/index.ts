export interface User {
  id: string;
  email: string;
  name: string;
  university: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  rent: number;
  start_date: string;
  end_date: string;
  location: string;
  images: string[];
  created_at: string;
  user?: User;
}

export interface SavedListing {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  listing_id?: string;
  content: string;
  created_at: string;
  read: boolean;
}

export interface MatchScore {
  score: number;
  reason: string;
}
