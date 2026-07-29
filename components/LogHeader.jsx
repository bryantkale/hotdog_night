import { AuthPanel } from "./AuthPanel";

export function LogHeader({
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
    onAuthSubmit,
    onLogout,
    onModeSwitch,
    onGoogleSignIn,
}) {
    return (
        <header className="hdl-hero">
            <div>
                <span className="hdl-hero-badge">personal archive · est. today</span>
                <h1 className="hdl-display hdl-title">THE HOT DOG LOG</h1>
                <p className="hdl-hero-copy">
                    Every cart, stand, and stadium dog you've tracked down — rated, dated, and stapled to a photo.
                </p>
            </div>
            <div className="hdl-hero-actions">
                <div className="hdl-auth-card">
                    <AuthPanel
                        authState={authState}
                        authMode={authMode}
                        email={email}
                        password={password}
                        username={username}
                        authMessage={authMessage}
                        userLabel={userLabel}
                        onEmailChange={onEmailChange}
                        onPasswordChange={onPasswordChange}
                        onUsernameChange={onUsernameChange}
                        onSubmit={onAuthSubmit}
                        onLogout={onLogout}
                        onModeSwitch={onModeSwitch}
                        onGoogleSignIn={onGoogleSignIn}
                    />
                </div>
                <svg className="hdl-hero-illustration" width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="50" cy="62" rx="42" ry="15" fill="#D9A62E" stroke="#221E18" strokeWidth="3" />
                    <path d="M12 58 Q50 40 88 58" stroke="#221E18" strokeWidth="3" fill="none" />
                    <path d="M20 52 Q50 62 80 52" stroke="#F8F2E2" strokeWidth="4" strokeLinecap="round" fill="none" />
                    <path d="M22 46 Q35 38 50 45 Q65 52 78 44" stroke="#A9382B" strokeWidth="3" strokeLinecap="round" fill="none" />
                </svg>
            </div>
        </header>
    );
}
