import OpenAI from 'openai';
import { Listing } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function calculateMatchScore(
  listing: Listing,
  userBudget: number,
  userStartDate: string,
  userEndDate: string
): Promise<{ score: number; reason: string }> {
  try {
    const prompt = `You are a matching algorithm for student housing. Calculate a compatibility score (0-100) based on:

Listing Details:
- Rent: $${listing.rent}/month
- Available: ${listing.start_date} to ${listing.end_date}
- Location: ${listing.location}

User Preferences:
- Budget: $${userBudget}/month
- Needed: ${userStartDate} to ${userEndDate}

Provide a JSON response with:
{
  "score": <number 0-100>,
  "reason": "<brief 1-sentence explanation>"
}

Consider:
- Price match (±20% is good)
- Date overlap
- Budget flexibility`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 100,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      score: Math.min(100, Math.max(0, result.score || 0)),
      reason: result.reason || 'Match calculated',
    };
  } catch (error) {
    console.error('OpenAI error:', error);
    // Fallback simple calculation
    const priceDiff = Math.abs(listing.rent - userBudget) / userBudget;
    const score = Math.max(0, 100 - priceDiff * 100);
    return {
      score: Math.round(score),
      reason: 'Based on budget match',
    };
  }
}
