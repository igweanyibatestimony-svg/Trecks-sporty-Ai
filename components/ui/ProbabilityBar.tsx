export default function ProbabilityBar({ home, draw, away }: { home: number; draw: number; away: number }) {
  return (
    <div className="w-full h-2 flex rounded-full overflow-hidden">
      <div style={{ width: `${home}%` }} className="bg-blue-600" />
      <div style={{ width: `${draw}%` }} className="bg-gray-500" />
      <div style={{ width: `${away}%` }} className="bg-red-600" />
    </div>
  );
}
