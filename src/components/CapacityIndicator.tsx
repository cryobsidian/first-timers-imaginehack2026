export function CapacityIndicator({
  available,
  maximum,
  label,
}: {
  available: number
  maximum: number
  label: string
}) {
  const percentage = maximum ? Math.round((available / maximum) * 100) : 0
  return (
    <div className="capacity">
      <div className="capacity-label">
        <span>{label}</span>
        <strong>{percentage}% available</strong>
      </div>
      <div className="capacity-track">
        <span style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }} />
      </div>
    </div>
  )
}
