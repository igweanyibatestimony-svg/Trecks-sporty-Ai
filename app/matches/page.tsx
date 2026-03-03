import Link from 'next/link';

export default function Home() {
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
