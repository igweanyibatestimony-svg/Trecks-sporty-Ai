export async function analyzeMatch(home: string, away: string, league: string) {
  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a football analyst. Give a short match analysis.' },
        { role: 'user', content: `Analyze ${home} vs ${away} in ${league}.` },
      ],
      temperature: 0.3,
    }),
  });
  const data = await res.json();
  return { summary: data.choices[0].message.content };
}
