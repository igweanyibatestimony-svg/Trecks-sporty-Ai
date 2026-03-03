const BASE = 'https://api-football-v1.p.rapidapi.com/v3';
export async function fetchFixtures(leagueId: number, season: number) {
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0];
  const res = await fetch(
    `${BASE}/fixtures?league=${leagueId}&season=${season}&from=${today}&to=${nextWeek}`,
    {
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST!,
      },
    }
  );
  return res.json();
}
