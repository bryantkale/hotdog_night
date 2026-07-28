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
            {authMessage && <p className="hdl-auth-message">{authMessage}</p>}
        </form>
    );
}
