
import Link from 'next/link';
import { sql } from '@vercel/postgres';
import { fetchFixtures } from '@/lib/football-api';

// Auto‑setup function – runs once when you first visit the site
async function setupDatabase() {
  try {
    // Check if tables already exist by trying to select from matches
    await sql`SELECT 1 FROM matches LIMIT 1`;
    console.log('Database already set up');
    return;
  } catch {
    console.log('Setting up database for the first time...');
    
    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        external_id TEXT UNIQUE,
        league_id INTEGER,
        home_team_id INTEGER,
        away_team_id INTEGER,
        match_date TIMESTAMP,
        status TEXT,
        home_score INTEGER,
        away_score INTEGER,
        home_team JSONB,
        away_team JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS predictions (
        id SERIAL PRIMARY KEY,
        match_id INTEGER REFERENCES matches(id),
        home_win_prob FLOAT,
        draw_prob FLOAT,
        away_win_prob FLOAT,
        over25_prob FLOAT,
        btts_prob FLOAT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS ai_analysis (
        id SERIAL PRIMARY KEY,
        match_id INTEGER REFERENCES matches(id),
        summary TEXT,
        risk_score INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS odds (
        id SERIAL PRIMARY KEY,
        match_id INTEGER REFERENCES matches(id),
        bookmaker TEXT,
        home_odds FLOAT,
        draw_odds FLOAT,
        away_odds FLOAT,
        timestamp TIMESTAMP DEFAULT NOW()
      );
    `;

    // Fetch initial matches
    const leagues = [39, 140, 135]; // Premier League, La Liga, Serie A
    const season = 2024;
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
    console.log('Database setup complete');
  }
}

export default async function Home() {
  // Run setup automatically (only once)
  await setupDatabase();

  return (
    <div className="max-w-4xl mx-auto py-20 px-4 text-center">
      <h1 className="text-5xl font-bold mb-4">OracleX AI</h1>
      <p className="text-xl text-gray-400 mb-8">
        AI-powered sports predictions with real odds comparison
      </p>
      <Link href="/matches" className="bg-blue-600 px-6 py-3 rounded-lg">
        View Today's Matches
      </Link>
    </div>
  );
}
