export class PredictionEngine {
  private poisson(lambda: number, k: number): number {
    return (Math.exp(-lambda) * Math.pow(lambda, k)) / this.factorial(k);
  }
  private factorial(n: number): number {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  }
  calculateMatchProbabilities(homeTeam: any, awayTeam: any) {
    const homeAdvantage = 1.1;
    const expectedHome = (homeTeam.elo / (homeTeam.elo + awayTeam.elo)) * homeAdvantage * 2.5;
    const expectedAway = (awayTeam.elo / (homeTeam.elo + awayTeam.elo)) * 2.5;

    let homeWin = 0, draw = 0, awayWin = 0, over25 = 0, btts = 0;
    for (let i = 0; i <= 10; i++) {
      for (let j = 0; j <= 10; j++) {
        const prob = this.poisson(expectedHome, i) * this.poisson(expectedAway, j);
        if (i > j) homeWin += prob;
        else if (i === j) draw += prob;
        else awayWin += prob;
        if (i + j > 2) over25 += prob;
        if (i > 0 && j > 0) btts += prob;
      }
    }
    const total = homeWin + draw + awayWin;
    return {
      home_win_prob: Math.round((homeWin / total) * 10000) / 100,
      draw_prob: Math.round((draw / total) * 10000) / 100,
      away_win_prob: Math.round((awayWin / total) * 10000) / 100,
      over25_prob: Math.round(over25 * 100) / 100,
      btts_prob: Math.round(btts * 100) / 100,
    };
  }
}
