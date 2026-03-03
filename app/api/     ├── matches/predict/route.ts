
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { PredictionEngine } from '@/lib/models/prediction';

export async function POST(request: Request) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const engine = new PredictionEngine();
    const { rows: matches } = await sql`SELECT * FROM matches WHERE status = 'scheduled'`;
    for (const match of matches) {
      const home = match.home_team || { elo: 1500 };
      const away = match.away_team || { elo: 1500 };
      const probs = engine.calculateMatchProbabilities(home, away);
      await sql`
        INSERT INTO predictions (match_id, home_win_prob, draw_prob, away_win_prob, over25_prob, btts_prob)
        VALUES (${match.id}, ${probs.home_win_prob}, ${probs.draw_prob}, ${probs.away_win_prob}, ${probs.over25_prob}, ${probs.btts_prob})
        ON CONFLICT (match_id) DO UPDATE SET
          home_win_prob = EXCLUDED.home_win_prob,
          draw_prob = EXCLUDED.draw_prob,
          away_win_prob = EXCLUDED.away_win_prob,
          over25_prob = EXCLUDED.over25_prob,
          btts_prob = EXCLUDED.btts_prob
      `;
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Prediction failed' }, { status: 500 });
  }
}
