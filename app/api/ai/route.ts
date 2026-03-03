
import { NextResponse } from 'next/server';
import { analyzeMatch } from '@/lib/deepseek';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    if (!message) {
      return NextResponse.json({ error: 'No message' }, { status: 400 });
    }
    // Simple parsing – you can improve this later
    const analysis = await analyzeMatch('Team', 'Opponent', 'League');
    return NextResponse.json({ reply: analysis.summary });
  } catch (error) {
    return NextResponse.json({ error: 'AI service error' }, { status: 500 });
  }
}
