import Link from 'next/link';
import { format } from 'date-fns';

export default function MatchCard({ match }: { match: any }) {
  const prob = match.home_win_prob || 0;
  const tier = prob >= 92 ? 'Titan Lock' : prob >= 85 ? 'Prime Edge' : 'Speculative';
  return (
    <Link href={`/matches/${match.id}`}>
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700">
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">
            {format(new Date(match.match_date), 'MMM d, h:mm a')}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            tier === 'Titan Lock' ? 'bg-green-900 text-green-400' :
            tier === 'Prime Edge' ? 'bg-yellow-900 text-yellow-400' :
            'bg-gray-800 text-gray-400'
          }`}>{tier}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">{match.home_team?.name || 'Home'}</p>
            <p className="text-gray-400 text-sm">vs</p>
            <p className="text-white font-semibold">{match.away_team?.name || 'Away'}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Home Win</p>
            <p className="text-2xl font-bold text-blue-500">{prob}%</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
