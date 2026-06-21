import type { MatchScoreBreakdown as Breakdown } from '../models'

export function MatchScoreBreakdown({ breakdown }: { breakdown: Breakdown }) {
  const entries = [
    ['Route', breakdown.routeFit],
    ['Capacity', breakdown.capacityFit],
    ['Time', breakdown.timeFit],
    ['Cargo', breakdown.cargoFit],
    ['Vehicle', breakdown.vehicleFit],
    ['Reliability', breakdown.reliability],
    ['Commercial', breakdown.profitability],
  ] as const

  return (
    <div className="score-grid" aria-label="Match score breakdown">
      {entries.map(([label, score]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{Math.round(score)}</strong>
        </div>
      ))}
    </div>
  )
}
