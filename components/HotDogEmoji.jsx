export function HotDogEmoji({ filled, size = 26, onClick, label }) {
    return (
        <span
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            aria-label={label}
            onClick={onClick}
            onKeyDown={(e) => {
                if (onClick && (e.key === "Enter" || e.key === " ")) onClick();
            }}
            className={`hdl-rating-emoji ${filled ? "on" : ""} ${onClick ? "is-clickable" : ""}`}
            style={{ "--rating-size": `${size}px` }}
        >
            🌭
        </span>
    );
}
