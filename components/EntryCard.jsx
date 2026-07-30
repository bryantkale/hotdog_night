import { HotDogEmoji } from "./HotDogEmoji";

export function EntryCard({ entry, onDelete }) {
    return (
        <div className="hdl-entry-card">
            <div className="hdl-entry-content">
                <div className="hdl-entry-header">
                    <h3 className="hdl-display hdl-entry-title">
                        {entry.name}
                    </h3>
                    <button className="hdl-entry-delete-btn" onClick={() => onDelete(entry.id)} title="Delete entry">
                        ✕
                    </button>
                </div>
                {entry.location && <p className="hdl-entry-location">📍 {entry.location}</p>}
                {entry.reviewer_name && <p className="hdl-entry-location">👤 {entry.reviewer_name}</p>}
                <div className="hdl-entry-meta">
                    <span className="hdl-mono hdl-entry-date">
                        {entry.date || "no date"}
                    </span>
                    <div className="hdl-entry-rating">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <HotDogEmoji key={n} filled={n <= entry.rating} size={15} />
                        ))}
                    </div>
                </div>
                {entry.notes && (
                    <>
                        <div className="hdl-divider" />
                        <p className="hdl-entry-notes">
                            {entry.notes}
                        </p>
                    </>
                )}
                <div className="hdl-photo-wrap">
                    {entry.photo && (
                        <img className="hdl-entry-photo" src={entry.photo} alt={entry.name} />
                    )}
                </div>
            </div>
        </div>
    );
}
