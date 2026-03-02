import Link from 'next/link';
export default function Navbar() {
  return (
    <nav className="bg-black border-b border-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between">
        <Link href="/" className="text-white font-bold text-xl">OracleX</Link>
        <div className="space-x-4">
          <Link href="/matches" className="text-gray-300">Matches</Link>
          <Link href="/ask-ai" className="text-gray-300">Ask AI</Link>
        </div>
      </div>
    </nav>
  );
}