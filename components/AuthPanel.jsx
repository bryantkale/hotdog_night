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

    if (authState === "ready") {
        return (
            <div className="hdl-auth-card-ready">
                <span className="hdl-auth-label">{userLabel}</span>
                <button type="button" className="hdl-auth-button" onClick={onLogout}>
                    Log out
                </button>
            </div>
        );
    }

    return (
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
                data-client_id="52712180133-ukuatpc8euivitmuo9icgq97ra6qflb9.apps.googleusercontent.com"
                data-context="signin"
                data-ux_mode="popup"
                data-login_uri="https://hotdognights.caelin.io"
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
    );
}
