export function StatsStrip({ total, avg, places }) {
    return (
        <div className="hdl-stats">
            {[
                { label: "dogs logged", value: total },
                { label: "avg rating", value: avg },
                { label: "places", value: places },
            ].map((s) => (
                <div key={s.label} className="hdl-mono hdl-stat">
                    <b className="hdl-display hdl-stat-value">{s.value}</b> {s.label}
                </div>
            ))}
        </div>
    );
}
