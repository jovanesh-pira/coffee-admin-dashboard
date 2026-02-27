
export function PasswordStrengthMeter({ score, label }: { score: number; label: string }) {
  // color steps (coffee vibe)
  const color =
    score < 35 ? "bg-red-500" :
    score < 70 ? "bg-amber-700" : // coffee-ish
    "bg-green-500";

  // optional “latte foam” background
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600">Password strength</span>
        <span className="font-medium">{label}</span>
      </div>

      <div className="h-2 w-full rounded-full bg-[#F3E8D3] overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-300`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}