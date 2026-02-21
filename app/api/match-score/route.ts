import { NextRequest, NextResponse } from 'next/server';
import { calculateMatchScore } from '@/lib/openai';
import { Listing } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listing, userBudget, userStartDate, userEndDate } = body;

    if (!listing || !userBudget || !userStartDate || !userEndDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await calculateMatchScore(
      listing as Listing,
      userBudget,
      userStartDate,
      userEndDate
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Match score error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate match score' },
      { status: 500 }
    );
  }
}
