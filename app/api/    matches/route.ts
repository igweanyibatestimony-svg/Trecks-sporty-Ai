import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    // Create matches table
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

    // Create predictions table
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

    // Create ai_analysis table
    await sql`
      CREATE TABLE IF NOT EXISTS ai_analysis (
        id SERIAL PRIMARY KEY,
        match_id INTEGER REFERENCES matches(id),
        summary TEXT,
        risk_score INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Create odds table
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

    return NextResponse.json({ success: true, message: 'Tables created' });
  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json({ error: 'Failed to create tables' }, { status: 500 });
  }
}
