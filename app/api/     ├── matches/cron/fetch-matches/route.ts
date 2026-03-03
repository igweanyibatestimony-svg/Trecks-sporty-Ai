import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { fetchFixtures } from '@/lib/football-api';

export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const leagues = [39, 140, 135]; // Premier League, La Liga, Serie A
  const season = 2024;

  try {
    for (const leagueId of leagues) {
      const data = await fetchFixtures(leagueId, season);
      if (!data?.response) continue;

      for (const f of data.response) {
        const homeTeam = {
          id: f.teams.home.id,
          name: f.teams.home.name,
          logo: f.teams.home.logo,
          elo: 1500,
        };
        const awayTeam = {
          id: f.teams.away.id,
          name: f.teams.away.name,
          logo: f.teams.away.logo,
          elo: 1500,
        };
        await sql`
          INSERT INTO matches (
            external_id, league_id, home_team_id, away_team_id,
            match_date, status, home_team, away_team
          ) VALUES (
            ${f.fixture.id.toString()}, ${leagueId}, ${f.teams.home.id}, ${f.teams.away.id},
            ${new Date(f.fixture.date).toISOString()}, ${f.fixture.status.short},
            ${JSON.stringify(homeTeam)}, ${JSON.stringify(awayTeam)}
          )
          ON CONFLICT (external_id) DO UPDATE SET
            status = EXCLUDED.status,
            home_team = EXCLUDED.home_team,
            away_team = EXCLUDED.away_team
        `;
      }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}
