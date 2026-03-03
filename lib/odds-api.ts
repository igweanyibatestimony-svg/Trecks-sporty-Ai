export async function fetchUpcomingOdds(sport = 'soccer') {
  const res = await fetch(
    `https://api.the-odds-api.com/v4/sports/${sport}/odds?apiKey=${process.env.ODDS_API_KEY}&regions=uk&markets=h2h&oddsFormat=decimal`
  );
  return res.json();
}
