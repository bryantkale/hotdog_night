import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "hotdog-entries";

const FONT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bungee&family=Work+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
  .hdl-root { font-family: 'Work Sans', sans-serif; }
  .hdl-display { font-family: 'Bungee', sans-serif; }
  .hdl-mono { font-family: 'JetBrains Mono', monospace; }
  .hdl-bg {
    background-color: #EDE1C3;
    background-image: radial-gradient(circle at 1px 1px, rgba(34,30,24,0.06) 1px, transparent 0);
    background-size: 18px 18px;
  }
  .hdl-title { text-shadow: 2px 2px 0 #221E18; }
  .hdl-rating-emoji { filter: grayscale(1) opacity(0.35); transition: filter .12s; }
  .hdl-rating-emoji.on { filter: none; }
  .hdl-divider { position: relative; border-top: 2px dashed rgba(34,30,24,0.18); }
  .hdl-divider::before, .hdl-divider::after {
    content: ''; position: absolute; top: -9px; width: 18px; height: 18px; border-radius: 50%;
    background: #EDE1C3; border: 2px solid #221E18;
  }
  .hdl-divider::before { left: -10px; }
  .hdl-divider::after { right: -10px; }
  .hdl-photo-wrap {
    background-image: repeating-linear-gradient(45deg, #e7dcc2, #e7dcc2 10px, #ddd0b0 10px, #ddd0b0 20px);
  }
  .hdl-input:focus, .hdl-btn:focus, .hdl-emoji-btn:focus {
    outline: 3px solid #D9A62E; outline-offset: 1px;
  }
`;

function resizeImageFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const maxDim = 700;
                let { width, height } = img;
                if (width > height && width > maxDim) {
                    height *= maxDim / width;
                    width = maxDim;
                } else if (height > maxDim) {
                    width *= maxDim / height;
                    height = maxDim;
                }
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                canvas.getContext("2d").drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL("image/jpeg", 0.72));
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function HotDogEmoji({ filled, size = 26, onClick, label }) {
    return (
        <span
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            aria-label={label}
            onClick={onClick}
            onKeyDown={(e) => {
                if (onClick && (e.key === "Enter" || e.key === " ")) onClick();
            }}
            className={`hdl-rating-emoji ${filled ? "on" : ""}`}
            style={{ fontSize: size, cursor: onClick ? "pointer" : "default", lineHeight: 1 }}
        >
            🌭
        </span>
    );
}

function RatingPicker({ value, onChange }) {
    return (
        <div style={{ display: "flex", gap: 4 }}>
            {[1, 2, 3, 4, 5].map((n) => (
                <HotDogEmoji
                    key={n}
                    filled={n <= value}
                    onClick={() => onChange(n)}
                    label={`Rate ${n} hot dogs`}
                />
            ))}
        </div>
    );
}

function EntryCard({ entry, onDelete }) {
    return (
        <div
            style={{
                position: "relative",
                background: "#F8F2E2",
                border: "2px solid #221E18",
                borderRadius: 10,
                overflow: "hidden",
                boxShadow: "3px 3px 0 rgba(34,30,24,0.25)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div className="hdl-photo-wrap" style={{ width: "100%", height: 150 }}>
                {entry.photo && (
                    <img
                        src={entry.photo}
                        alt={entry.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                )}
            </div>
            <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 8 }}>
                    <h3 className="hdl-display" style={{ margin: 0, fontSize: 15, color: "#A9382B", lineHeight: 1.25 }}>
                        {entry.name}
                    </h3>
                    <button
                        onClick={() => onDelete(entry.id)}
                        title="Delete entry"
                        style={{
                            background: "none",
                            border: "none",
                            color: "#a8a394",
                            cursor: "pointer",
                            fontSize: 16,
                            lineHeight: 1,
                            padding: "2px 4px",
                            flexShrink: 0,
                        }}
                    >
                        ✕
                    </button>
                </div>
                {entry.location && (
                    <p style={{ fontSize: 12, color: "#584f3f", margin: 0 }}>📍 {entry.location}</p>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                    <span className="hdl-mono" style={{ fontSize: 11, color: "#7a715f" }}>
                        {entry.date || "no date"}
                    </span>
                    <div style={{ display: "flex", gap: 1 }}>
                        {[1, 2, 3, 4, 5].map((n) => (
                            <HotDogEmoji key={n} filled={n <= entry.rating} size={15} />
                        ))}
                    </div>
                </div>
                {entry.notes && (
                    <>
                        <div className="hdl-divider" />
                        <p style={{ fontSize: 13, lineHeight: 1.45, color: "#3a352c", margin: "4px 0 0" }}>
                            {entry.notes}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default function HotDogLog() {
    const [entries, setEntries] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [rating, setRating] = useState(0);
    const [notes, setNotes] = useState("");
    const [photo, setPhoto] = useState("");
    const [saveError, setSaveError] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        (async () => {
            try {
                const result = await window.storage.get(STORAGE_KEY, false);
                setEntries(result && result.value ? JSON.parse(result.value) : []);
            } catch {
                setEntries([]);
            } finally {
                setLoaded(true);
            }
        })();
    }, []);

    async function persist(next) {
        setEntries(next);
        try {
            setSaveError("");
            await window.storage.set(STORAGE_KEY, JSON.stringify(next), false);
        } catch {
            setSaveError("Couldn't save that — the photo may be too large. Try a smaller image.");
        }
    }

    async function handlePhotoChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const dataUrl = await resizeImageFile(file);
            setPhoto(dataUrl);
        } catch {
            setSaveError("Couldn't read that image, try another file.");
        }
    }

    function resetForm() {
        setName("");
        setLocation("");
        setDate("");
        setRating(0);
        setNotes("");
        setPhoto("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName) return;
        const entry = {
            id: "dog_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
            name: trimmedName,
            location: location.trim(),
            date,
            rating,
            notes: notes.trim(),
            photo,
        };
        await persist([entry, ...entries]);
        resetForm();
    }

    async function handleDelete(id) {
        if (!window.confirm("Remove this dog from the log?")) return;
        await persist(entries.filter((e) => e.id !== id));
    }

    const total = entries.length;
    const avg = total ? (entries.reduce((s, e) => s + (e.rating || 0), 0) / total).toFixed(1) : "0.0";
    const places = new Set(entries.map((e) => (e.location || "").toLowerCase().trim()).filter(Boolean)).size;
    const sorted = [...entries].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    return (
        <div className="hdl-root hdl-bg" style={{ minHeight: "100vh" }}>
            <style>{FONT_STYLES}</style>
            <div style={{ maxWidth: 840, margin: "0 auto", padding: "28px 20px 60px" }}>

                {/* HERO */}
                <header
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 16,
                        paddingBottom: 20,
                        borderBottom: "3px solid #221E18",
                        marginBottom: 22,
                        flexWrap: "wrap",
                    }}
                >
                    <div>
                        <span
                            className="hdl-mono"
                            style={{
                                fontSize: 11,
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                                color: "#7E2A20",
                                display: "block",
                                marginBottom: 6,
                            }}
                        >
                            personal archive · est. today
                        </span>
                        <h1
                            className="hdl-display hdl-title"
                            style={{ fontSize: "clamp(28px, 6vw, 42px)", lineHeight: 1, color: "#A9382B", margin: "0 0 10px" }}
                        >
                            THE HOT DOG LOG
                        </h1>
                        <p style={{ margin: 0, maxWidth: 440, fontSize: 14.5, lineHeight: 1.5, color: "#3a352c" }}>
                            Every cart, stand, and stadium dog you've tracked down — rated, dated, and stapled to a photo.
                        </p>
                    </div>
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                        <ellipse cx="50" cy="62" rx="42" ry="15" fill="#D9A62E" stroke="#221E18" strokeWidth="3" />
                        <path d="M12 58 Q50 40 88 58" stroke="#221E18" strokeWidth="3" fill="none" />
                        <path d="M20 52 Q50 62 80 52" stroke="#F8F2E2" strokeWidth="4" strokeLinecap="round" fill="none" />
                        <path d="M22 46 Q35 38 50 45 Q65 52 78 44" stroke="#A9382B" strokeWidth="3" strokeLinecap="round" fill="none" />
                    </svg>
                </header>

                {/* STATS */}
                <div style={{ display: "flex", gap: 10, marginBottom: 26, flexWrap: "wrap" }}>
                    {[
                        { label: "dogs logged", value: total },
                        { label: "avg rating", value: avg },
                        { label: "places", value: places },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className="hdl-mono"
                            style={{
                                background: "#F8F2E2",
                                border: "2px solid #221E18",
                                borderRadius: 8,
                                padding: "8px 14px",
                                fontSize: 12.5,
                                display: "flex",
                                alignItems: "baseline",
                                gap: 6,
                            }}
                        >
                            <b className="hdl-display" style={{ fontSize: 16, color: "#A9382B" }}>{s.value}</b> {s.label}
                        </div>
                    ))}
                </div>

                {/* FORM */}
                <section
                    style={{
                        background: "#F8F2E2",
                        border: "2px solid #221E18",
                        borderRadius: 12,
                        padding: 20,
                        boxShadow: "4px 4px 0 rgba(34,30,24,0.25)",
                        marginBottom: 34,
                    }}
                >
                    <h2 className="hdl-display" style={{ fontSize: 16, color: "#221E18", margin: "0 0 14px" }}>
                        Log a new dog
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                            <div style={{ flex: 1, minWidth: 160, display: "flex", flexDirection: "column", gap: 5 }}>
                                <label style={labelStyle}>Hot dog / stand name</label>
                                <input
                                    className="hdl-input"
                                    style={inputStyle}
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Chicago-style at Gene's Cart"
                                    required
                                />
                            </div>
                            <div style={{ flex: 1, minWidth: 160, display: "flex", flexDirection: "column", gap: 5 }}>
                                <label style={labelStyle}>Location</label>
                                <input
                                    className="hdl-input"
                                    style={inputStyle}
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g. Portland, OR"
                                />
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                            <div style={{ flex: 1, minWidth: 160, display: "flex", flexDirection: "column", gap: 5 }}>
                                <label style={labelStyle}>Date visited</label>
                                <input
                                    className="hdl-input"
                                    style={inputStyle}
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <div style={{ flex: 1, minWidth: 160, display: "flex", flexDirection: "column", gap: 5 }}>
                                <label style={labelStyle}>Rating</label>
                                <RatingPicker value={rating} onChange={setRating} />
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
                            <label style={labelStyle}>Notes</label>
                            <textarea
                                className="hdl-input"
                                style={{ ...inputStyle, minHeight: 56, resize: "vertical", fontFamily: "inherit" }}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Snap of the casing, the mustard-to-relish ratio, was the bun steamed..."
                            />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
                            <label style={labelStyle}>Photo</label>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                                <button
                                    type="button"
                                    className="hdl-mono hdl-btn"
                                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                    style={{
                                        fontSize: 12.5,
                                        background: "#221E18",
                                        color: "#F8F2E2",
                                        border: "none",
                                        borderRadius: 6,
                                        padding: "9px 14px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Add a photo
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={handlePhotoChange}
                                />
                                {photo && (
                                    <img
                                        src={photo}
                                        alt="Preview"
                                        style={{ width: 52, height: 52, borderRadius: 6, objectFit: "cover", border: "2px solid #221E18" }}
                                    />
                                )}
                            </div>
                        </div>

                        {saveError && (
                            <p style={{ color: "#A9382B", fontSize: 12.5, margin: "0 0 10px" }}>{saveError}</p>
                        )}

                        <button
                            type="submit"
                            className="hdl-display hdl-btn"
                            style={{
                                fontSize: 14,
                                background: "#A9382B",
                                color: "#F8F2E2",
                                border: "2px solid #221E18",
                                borderRadius: 8,
                                padding: "12px 20px",
                                cursor: "pointer",
                                boxShadow: "3px 3px 0 #221E18",
                            }}
                        >
                            Log it
                        </button>
                    </form>
                </section>

                {/* LOG */}
                <section>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
                        <h2 className="hdl-display" style={{ fontSize: 16, margin: 0 }}>Your log</h2>
                        <span className="hdl-mono" style={{ fontSize: 12, color: "#584f3f" }}>
                            {total ? `${total} entr${total === 1 ? "y" : "ies"}` : ""}
                        </span>
                    </div>

                    {!loaded ? (
                        <p style={{ fontSize: 13, color: "#584f3f" }}>Loading your log...</p>
                    ) : total === 0 ? (
                        <div
                            style={{
                                border: "2px dashed rgba(34,30,24,0.18)",
                                borderRadius: 10,
                                padding: "34px 20px",
                                textAlign: "center",
                                color: "#584f3f",
                                fontSize: 14,
                            }}
                        >
                            <b className="hdl-display" style={{ display: "block", fontSize: 16, color: "#221E18", marginBottom: 6 }}>
                                No dogs logged yet.
                            </b>
                            Log your first one above — cart, stand, ballpark, doesn't matter. It counts.
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 18 }}>
                            {sorted.map((entry) => (
                                <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

const labelStyle = {
    fontSize: 11.5,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#584f3f",
};

const inputStyle = {
    fontSize: 14,
    padding: "9px 10px",
    border: "2px solid rgba(34,30,24,0.18)",
    borderRadius: 7,
    background: "#fff",
    color: "#221E18",
    fontFamily: "'Work Sans', sans-serif",
    width: "100%",
};
