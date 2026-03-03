
import { sql } from '@vercel/postgres';
import MatchCard from '@/components/matches/MatchCard';

export default async function MatchesPage() {
  const { rows } = await sql`
    SELECT m.*, p.home_win_prob
    FROM matches m
    LEFT JOIN predictions p ON m.id = p.match_id
    WHERE m.status = 'scheduled'
    ORDER BY m.match_date ASC
  `;
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Upcoming Matches</h1>
      <div className="space-y-4">
        {rows.map(match => <MatchCard key={match.id} match={match} />)}
      </div>
    </div>
  );
}
