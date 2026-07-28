import { useEffect, useRef, useState } from "react";
import { EntryCard } from "./components/EntryCard";
import { LogForm } from "./components/LogForm";
import { LogHeader } from "./components/LogHeader";
import { StatsStrip } from "./components/StatsStrip";
import { resizeImageFile } from "./utils/image";
import { deleteHotDogEntry, getHotDogEntries, saveHotDogEntry, signInWithEmail, signUpWithEmail, supabase } from "./utils/supabase";
import "./styles.css";

const STORAGE_KEY = "hotdog-entries";

export default function HotDogLog() {
    const [entries, setEntries] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [name, setName] = useState("");
    const [reviewerName, setReviewerName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [rating, setRating] = useState(0);
    const [notes, setNotes] = useState("");
    const [photo, setPhoto] = useState("");
    const [saveError, setSaveError] = useState("");
    const [authState, setAuthState] = useState("loading");
    const [authMode, setAuthMode] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [authMessage, setAuthMessage] = useState("");
    const [userLabel, setUserLabel] = useState("Guest");
    const [showLogForm, setShowLogForm] = useState(false);
    const fileInputRef = useRef(null);

    async function loadEntries() {
        try {
            const supabaseEntries = await getHotDogEntries();
            if (supabaseEntries.length > 0) {
                setEntries(supabaseEntries);
            } else {
                const result = await window.storage.get(STORAGE_KEY, false);
                setEntries(result && result.value ? JSON.parse(result.value) : []);
            }
        } catch {
            setEntries([]);
        }
    }
    useEffect(() => {
        (async () => {
            try {
                const currentUser = await supabase?.auth.getUser();
                const user = currentUser?.data?.user ?? null;
                setAuthState(user ? "ready" : "guest");
                setUserLabel(user?.user_metadata?.username || user?.email || "Guest");
                setShowLogForm(false);
                await loadEntries();
            } catch {
                setEntries([]);
                setAuthState("guest");
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
            setSaveError("Couldn't save locally. Try again.");
        }
    }

    async function persistToSupabase(entry) {
        const saved = await saveHotDogEntry(entry);
        if (!saved) {
            throw new Error("Supabase save failed");
        }
        return saved;
    }

    async function handlePhotoChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const dataUrl = await resizeImageFile(file);
            setPhoto(dataUrl);
            setSaveError("");
        } catch {
            setSaveError("Couldn't read that image, try another file.");
        }
    }

    function resetForm() {
        setName("");
        setReviewerName("");
        setLocation("");
        setDate("");
        setRating(0);
        setNotes("");
        setPhoto("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    async function handleAuthSubmit(e) {
        e.preventDefault();
        if (!supabase) return;

        setAuthMessage("");
        if (!email.trim() || !password.trim()) {
            setAuthMessage("Please enter both an email and a password.");
            return;
        }

        if (authMode === "signup") {
            const result = await signUpWithEmail(email.trim(), password, username.trim());
            if (result.success && result.user && result.session) {
                setAuthMode("login");
                setAuthState("ready");
                setUserLabel(result.user.user_metadata?.username || result.user.email || email.trim());
                setAuthMessage(result.message);
                setUsername("");
                setShowLogForm(false);
                await loadEntries();
            } else {
                setAuthMode("login");
                setAuthState("guest");
                setAuthMessage(result.message || "Sign up failed. Please try again.");
            }
            return;
        }

        const result = await signInWithEmail(email.trim(), password);
        if (result.success && result.user) {
            setAuthState("ready");
            setUserLabel(result.user.user_metadata?.username || result.user.email || email.trim());
            setUsername("");
            setShowLogForm(false);
            await loadEntries();
            setAuthMessage(result.message);
        } else {
            setAuthState("guest");
            setAuthMessage(result.message || "Log in failed. Check your email and password.");
        }
    }

    async function handleLogout() {
        if (!supabase) return;
        await supabase.auth.signOut();
        setAuthState("guest");
        setUserLabel("Guest");
        setAuthMessage("");
        setEmail("");
        setPassword("");
        setUsername("");
        setShowLogForm(false);
    }

    function handleAuthModeSwitch() {
        // auth mode is signup rn
        setAuthMode((currentMode) => (currentMode === "login" ? "signup" : "login"));
        setAuthMessage("");
        setPassword("");
        setUsername("");
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (authState !== "ready") {
            setSaveError("Please log in before adding a review.");
            return;
        }

        const trimmedName = name.trim();
        if (!trimmedName) return;
        const entry = {
            name: trimmedName,
            reviewer_name: reviewerName.trim(),
            location: location.trim(),
            date,
            rating,
            notes: notes.trim(),
            photo: photo || null,
            created_at: new Date().toISOString(),
        };

        try {
            const savedEntry = await persistToSupabase(entry);
            const nextEntries = [savedEntry || entry, ...entries];
            await persist(nextEntries);
            resetForm();
        } catch {
            setSaveError("Couldn't save to Supabase right now. Your entry was kept locally instead.");
            const nextEntries = [entry, ...entries];
            await persist(nextEntries);
            resetForm();
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Remove this dog from the log?")) return;
        try {
            const deleted = await deleteHotDogEntry(id);
            if (!deleted) throw new Error("delete failed");
        } catch {
            setSaveError("Couldn't remove it from Supabase, but it will be removed locally.");
        }
        await persist(entries.filter((e) => e.id !== id));
    }

    const total = entries.length;
    const avg = total ? (entries.reduce((s, e) => s + (e.rating || 0), 0) / total).toFixed(1) : "0.0";
    const places = new Set(entries.map((e) => (e.location || "").toLowerCase().trim()).filter(Boolean)).size;
    const sorted = [...entries].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    return (
        <div className="hdl-root hdl-bg">
            <div className="hdl-page-shell">
                <LogHeader
                    authState={authState}
                    authMode={authMode}
                    email={email}
                    password={password}
                    username={username}
                    authMessage={authMessage}
                    userLabel={userLabel}
                    onEmailChange={setEmail}
                    onPasswordChange={setPassword}
                    onUsernameChange={setUsername}
                    onAuthSubmit={handleAuthSubmit}
                    onLogout={handleLogout}
                    onModeSwitch={handleAuthModeSwitch}
                />

                <StatsStrip total={total} avg={avg} places={places} />

                {authState === "ready" && (
                    <div className="hdl-form-toggle-row">
                        <button
                            type="button"
                            className="hdl-display hdl-btn hdl-submit-btn"
                            onClick={() => setShowLogForm((value) => !value)}
                        >
                            {showLogForm ? "Close" : "Log a dog"}
                        </button>
                    </div>
                )}

                {authState === "ready" && showLogForm && (
                    <LogForm
                        authState={"ready"}
                        name={name}
                        reviewerName={reviewerName}
                        location={location}
                        date={date}
                        rating={rating}
                        notes={notes}
                        photo={photo}
                        saveError={saveError}
                        fileInputRef={fileInputRef}
                        onNameChange={setName}
                        onReviewerNameChange={setReviewerName}
                        onLocationChange={setLocation}
                        onDateChange={setDate}
                        onRatingChange={setRating}
                        onNotesChange={setNotes}
                        onPhotoChange={handlePhotoChange}
                        onSubmit={handleSubmit}
                    />
                )}

                {authState !== "ready" && (
                    <p className="hdl-helper-text">Log in to add a review and keep your hot dog log private.</p>
                )}

                <section>
                    <div className="hdl-log-header">
                        <h2 className="hdl-display hdl-log-title">All logs</h2>
                        <span className="hdl-mono hdl-log-count">
                            {total ? `${total} entr${total === 1 ? "y" : "ies"}` : ""}
                        </span>
                    </div>

                    {!loaded ? (
                        <p className="hdl-loading">Loading your log...</p>
                    ) : total === 0 ? (
                        <div className="hdl-empty-state">
                            <b className="hdl-display hdl-empty-state-title">
                                No dogs logged yet.
                            </b>
                            Log your first one above — cart, stand, ballpark, doesn't matter. It counts.
                        </div>
                    ) : (
                        <div className="hdl-entries-grid">
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
