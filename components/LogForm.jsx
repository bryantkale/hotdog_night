import { RatingPicker } from "./RatingPicker";

export function LogForm({
    authState,
    name,
    reviewerName,
    location,
    date,
    rating,
    notes,
    photo,
    saveError,
    fileInputRef,
    onNameChange,
    onReviewerNameChange,
    onLocationChange,
    onDateChange,
    onRatingChange,
    onNotesChange,
    onPhotoChange,
    onSubmit,
}) {
    return (
        <section className="hdl-form-section">
            <h2 className="hdl-display hdl-form-title">Log a new dog</h2>
            <p className="hdl-helper-text">Your ratings are being saved privately to your Supabase account.</p>
            <form onSubmit={onSubmit}>
                <div className="hdl-form-row">
                    <div className="hdl-field">
                        <label className="hdl-label">Hot dog / stand name</label>
                        <input
                            className="hdl-input"
                            type="text"
                            value={name}
                            onChange={(e) => onNameChange(e.target.value)}
                            placeholder="e.g. Chicago-style at Gene's Cart"
                            required
                            disabled={authState !== "ready"}
                        />
                    </div>
                    <div className="hdl-field">
                        <label className="hdl-label">Your name</label>
                        <input
                            className="hdl-input"
                            type="text"
                            value={reviewerName}
                            onChange={(e) => onReviewerNameChange(e.target.value)}
                            placeholder="e.g. Carl"
                            disabled={authState !== "ready"}
                        />
                    </div>
                </div>

                <div className="hdl-form-row">
                    <div className="hdl-field">
                        <label className="hdl-label">Location</label>
                        <input
                            className="hdl-input"
                            type="text"
                            value={location}
                            onChange={(e) => onLocationChange(e.target.value)}
                            placeholder="e.g. Portland, OR"
                            disabled={authState !== "ready"}
                        />
                    </div>
                </div>

                <div className="hdl-form-row">
                    <div className="hdl-field">
                        <label className="hdl-label">Date visited</label>
                        <input
                            className="hdl-input"
                            type="date"
                            value={date}
                            onChange={(e) => onDateChange(e.target.value)}
                            disabled={authState !== "ready"}
                        />
                    </div>
                    <div className="hdl-field">
                        <label className="hdl-label">Rating</label>
                        <RatingPicker value={rating} onChange={onRatingChange} disabled={authState !== "ready"} />
                    </div>
                </div>

                <div className="hdl-field hdl-notes-field">
                    <label className="hdl-label">Notes</label>
                    <textarea
                        className="hdl-input hdl-textarea"
                        value={notes}
                        onChange={(e) => onNotesChange(e.target.value)}
                        placeholder="Snap of the casing, the mustard-to-relish ratio, was the bun steamed..."
                        disabled={authState !== "ready"}
                    />
                </div>

                <div className="hdl-photo-row">
                    <label className="hdl-label">Photo</label>
                    <div className="hdl-photo-actions">
                        <button
                            type="button"
                            className="hdl-mono hdl-btn hdl-photo-button"
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                            disabled={authState !== "ready"}
                        >
                            Add a photo
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={onPhotoChange}
                            disabled={authState !== "ready"}
                        />
                        {photo && <img src={photo} alt="Preview" className="hdl-photo-preview" />}
                    </div>
                </div>

                {saveError && <p className="hdl-error">{saveError}</p>}

                <button type="submit" className="hdl-display hdl-btn hdl-submit-btn" disabled={authState !== "ready"}>
                    Log it
                </button>
            </form>
        </section>
    );
}
