import { HotDogEmoji } from "./HotDogEmoji";

export function RatingPicker({ value, onChange, disabled = false }) {
    return (
        <div className="hdl-rating-picker">
            {[1, 2, 3, 4, 5].map((n) => (
                <HotDogEmoji
                    key={n}
                    filled={n <= value}
                    onClick={disabled ? undefined : () => onChange(n)}
                    label={disabled ? "Sign in to rate" : `Rate ${n} hot dogs`}
                />
            ))}
        </div>
    );
}
