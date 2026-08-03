import { AuthPanel } from "./AuthPanel";

const HOT_DOG_IMAGE_URL = "https://dcsmjiyimxsnmarchisx.supabase.co/storage/v1/object/public/album-art/HotDogStockImage.png";

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
                <span className="hdl-hero-badge">personal archive · est. 2026</span>
                <h1 className="hdl-title" aria-label="The Hot Dog Log">
                    <span className="hdl-title-line hdl-title-line-top">
                        <span className="hdl-title-word hdl-title-word-federal">THE</span>
                    </span>
                    <span className="hdl-title-line hdl-title-line-middle">
                        <span className="hdl-title-word hdl-title-word-caslon">HOT DOG</span>
                    </span>
                    <span className="hdl-title-line hdl-title-line-bottom">
                        <span className="hdl-title-word hdl-title-word-federal">LOG</span>
                    </span>
                </h1>
                <p className="hdl-hero-copy">
                    For your everyday hot dog needs. Logs for every cart, stand, and stadium dog you've had.
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
                <img
                    className="hdl-hero-illustration"
                    src={HOT_DOG_IMAGE_URL}
                    alt="Hot dog illustration"
                    width="100"
                    height="100"
                />
            </div>
        </header>
    );
}
