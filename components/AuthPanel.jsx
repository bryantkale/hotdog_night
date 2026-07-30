import { useEffect, useRef, useState } from "react";
const supabaseCallbackUrl = import.meta.env.VITE_SUPABASE_CALLBACK || "";
const clientId = import.meta.env.CLIENT_ID || "";

export function AuthPanel({
    authState,
    authMode,
    email,
    password,
    username,
    authMessage,
    userLabel,
    onEmailChange,
    onPasswordChange,
    onUsernameChange,
    onSubmit,
    onLogout,
    onModeSwitch,
    onGoogleSignIn,
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return;

        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    useEffect(() => {
        if (authState === "ready") {
            setMenuOpen(false);
        }
    }, [authState]);

    if (authState === "ready") {
        return (
            <div className="hdl-auth-card-ready" ref={menuRef}>
                <button
                    type="button"
                    className="hdl-auth-menu-trigger"
                    onClick={() => setMenuOpen((value) => !value)}
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                >
                    <span className="hdl-auth-label">{userLabel}</span>
                    <span className="hdl-auth-menu-caret">▾</span>
                </button>

                {menuOpen && (
                    <div className="hdl-auth-menu" role="menu">
                        <button
                            type="button"
                            className="hdl-auth-menu-item"
                            onClick={() => {
                                setMenuOpen(false);
                                onLogout();
                            }}
                        >
                            Log out
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="hdl-auth-card-menu" ref={menuRef}>
            <button
                type="button"
                className="hdl-auth-menu-trigger hdl-auth-menu-trigger-guest"
                onClick={() => setMenuOpen((value) => !value)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
            >
                <span>Sign up or log in</span>
                <span className="hdl-auth-menu-caret">▾</span>
            </button>

            {menuOpen && (
                <div className="hdl-auth-menu" role="menu">
                    <form className="hdl-auth-form" onSubmit={onSubmit}>
                        <input
                            className="hdl-auth-input"
                            type="email"
                            value={email}
                            onChange={(e) => onEmailChange(e.target.value)}
                            placeholder="Email"
                        />
                        <input
                            className="hdl-auth-input"
                            type="password"
                            value={password}
                            onChange={(e) => onPasswordChange(e.target.value)}
                            placeholder="Password"
                        />
                        {authMode === "signup" && (
                            <input
                                className="hdl-auth-input"
                                type="text"
                                value={username}
                                onChange={(e) => onUsernameChange(e.target.value)}
                                placeholder="Username"
                            />
                        )}
                        <div className="hdl-auth-actions">
                            <button type="submit" className="hdl-auth-button">
                                {authMode === "login" ? "Log in" : "Sign up"}
                            </button>
                            <button type="button" className="hdl-auth-link" onClick={onModeSwitch}>
                                {authMode === "login" ? "Need an account?" : "Already have one?"}
                            </button>
                        </div>

                        <div className="hdl-auth-divider">or</div>

                        <button type="button" className="hdl-google-button" onClick={onGoogleSignIn}>
                            Continue with Google
                        </button>

                        <div id="g_id_onload"
                            data-client_id={clientId}
                            data-context="signin"
                            data-ux_mode="popup"
                            data-login_uri={supabaseCallbackUrl}
                            data-auto_prompt="false"
                        />

                        <div
                            className="g_id_signin"
                            data-type="standard"
                            data-shape="pill"
                            data-theme="filled_black"
                            data-text="signin_with"
                            data-size="medium"
                            data-logo_alignment="left"
                        />

                        {authMessage && <p className="hdl-auth-message">{authMessage}</p>}
                    </form>
                </div>
            )}
        </div>
    );
}
