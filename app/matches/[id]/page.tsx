import sql from '@/lib/db';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import ProbabilityBar from '@/components/matches/ProbabilityBar';

export default async function MatchPage({ params }: { params: { id: string } }) {
  const matchId = params.id;
  const result = await sql`
    SELECT m.*, p.*, a.summary as ai_summary
    FROM matches m
    LEFT JOIN predictions p ON m.id = p.match_id
    LEFT JOIN ai_analysis a ON m.id = a.match_id
    WHERE m.id = ${matchId}
  `;
  const match = result.rows[0];
  if (!match) notFound();

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-gray-900 p-6 rounded-lg">
        <p className="text-gray-400">
          {format(new Date(match.match_date), 'MMMM d, yyyy h:mm a')}
        </p>
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-2xl font-bold">{match.home_team?.name}</p>
          </div>
          <span className="text-2xl text-gray-600">vs</span>
          <div>
            <p className="text-2xl font-bold">{match.away_team?.name}</p>
          </div>
        </div>

        {match.home_win_prob && (
          <>
            <div className="mt-6">
              <ProbabilityBar
                home={match.home_win_prob}
                draw={match.draw_prob}
                away={match.away_win_prob}
              />
              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <span>{match.home_win_prob}% Home</span>
                <span>{match.draw_prob}% Draw</span>
                <span>{match.away_win_prob}% Away</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-800 p-3 rounded">
                <p className="text-sm">Over 2.5</p>
                <p className="text-xl">{match.over25_prob}%</p>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <p className="text-sm">BTTS</p>
                <p className="text-xl">{match.btts_prob}%</p>
              </div>
            </div>
          </>
        )}

        {match.ai_summary && (
          <div className="mt-6 border-t border-gray-800 pt-4">
            <h3 className="font-semibold mb-2">AI Analysis</h3>
            <p className="text-gray-400">{match.ai_summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}
