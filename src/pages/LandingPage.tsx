import { useAuthStore } from "@/stores/authStore";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ROUTES } from "@/config/routes";
import { toast } from "sonner";

/* ------------------------------------------------------------------ */
/*  Landing Page — navbar + cream hero with laptop mockup              */
/* ------------------------------------------------------------------ */
export default function LandingPage() {
    const { session, loading } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const params = new URLSearchParams(hash.substring(1));
            const error = params.get("error");
            const errorDescription = params.get("error_description");
            if (error && errorDescription) {
                toast.error(errorDescription.replace(/\+/g, " "));
                window.history.replaceState(null, "", window.location.pathname);
            }
        }
    }, []);

    useEffect(() => {
        if (!loading && session) {
            navigate(ROUTES.DASHBOARD);
        }
    }, [session, loading, navigate]);

    if (loading) return null;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');

                @keyframes lp-fade-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes lp-slide-in {
                    from { opacity: 0; transform: translateX(-50px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                .lp-heading  { animation: lp-fade-up .8s cubic-bezier(.25,.46,.45,.94) both; }
                .lp-subtitle { animation: lp-fade-up .8s cubic-bezier(.25,.46,.45,.94) .12s both; }
                .lp-buttons  { animation: lp-fade-up .8s cubic-bezier(.25,.46,.45,.94) .22s both; }
                .lp-laptop   { animation: lp-slide-in .9s cubic-bezier(.25,.46,.45,.94) .1s both; }

                /* ---- Navbar ---- */
                .lp-navbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px 32px;
                    background: rgba(240, 234, 214, 0.85);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(0,0,0,0.06);
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 100;
                }
                .lp-nav-logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    text-decoration: none;
                    color: #2c2c2c;
                }
                .lp-nav-logo-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                    background: #3c5a2e;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    font-weight: 800;
                    line-height: 1;
                }
                .lp-nav-logo-text {
                    font-size: 13px;
                    font-weight: 600;
                    line-height: 1.2;
                    color: #2c2c2c;
                }
                .lp-nav-links {
                    display: flex;
                    align-items: center;
                    gap: 32px;
                }
                .lp-nav-link {
                    font-size: 14px;
                    font-weight: 500;
                    color: #4a4a3e;
                    text-decoration: none;
                    transition: color .2s;
                }
                .lp-nav-link:hover { color: #2c2c2c; }
                .lp-nav-auth {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .lp-nav-login {
                    padding: 8px 20px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #2c2c2c;
                    text-decoration: none;
                    transition: opacity .2s;
                    background: #d5d5d5;
                    border: none;
                    border-radius: 8px;
                }
                .lp-nav-login:hover { opacity: .8; }
                .lp-nav-signup {
                    padding: 8px 20px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #fff;
                    text-decoration: none;
                    transition: opacity .2s;
                    background: #2c2c2c;
                    border: none;
                    border-radius: 8px;
                }
                .lp-nav-signup:hover { opacity: .85; }

                /* ---- Laptop frame ---- */
                .laptop-frame {
                    position: relative;
                    width: 100%;
                }
                .laptop-bezel {
                    background: #1c1c1e;
                    border-radius: 14px 14px 0 0;
                    padding-top: 28px;
                    position: relative;
                    overflow: hidden;
                    border: 2.5px solid #333;
                    border-bottom: none;
                }
                /* traffic light buttons */
                .laptop-traffic {
                    position: absolute;
                    top: 8px;
                    left: 12px;
                    display: flex;
                    gap: 6px;
                    z-index: 2;
                }
                .laptop-dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                }
                .laptop-screen-img {
                    width: 100%;
                    display: block;
                    aspect-ratio: 16 / 9.5;
                    object-fit: cover;
                    object-position: top left;
                }
                .laptop-base {
                    height: 18px;
                    background: linear-gradient(to bottom, #4a4a4c 0%, #2c2c2e 100%);
                    border-radius: 0 0 4px 4px;
                    position: relative;
                }
                .laptop-base::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 120px;
                    height: 5px;
                    background: #555;
                    border-radius: 0 0 6px 6px;
                }
                .laptop-bottom {
                    width: 108%;
                    margin-left: -4%;
                    height: 10px;
                    background: linear-gradient(to bottom, #3c3c3e 0%, #5a5a5c 100%);
                    border-radius: 0 0 16px 16px;
                }

                /* ---- Hero buttons ---- */
                .lp-login-btn {
                    padding: 10px 24px;
                    background: #d5d5d5;
                    border: none;
                    border-radius: 8px;
                    font-size: 15px;
                    font-weight: 500;
                    color: #2c2c2c;
                    cursor: pointer;
                    font-family: inherit;
                    transition: opacity .2s;
                    text-decoration: none;
                }
                .lp-login-btn:hover { opacity: .8; }
                .lp-cta-btn {
                    padding: 12px 28px;
                    background: #2c2c2c;
                    border: none;
                    border-radius: 8px;
                    font-size: 15px;
                    font-weight: 600;
                    color: #fff;
                    cursor: pointer;
                    font-family: inherit;
                    text-decoration: none;
                    transition: opacity .2s;
                }
                .lp-cta-btn:hover { opacity: .85; }

                @media (max-width: 768px) {
                    .lp-nav-links { display: none; }
                    .lp-navbar { padding: 10px 16px; }
                }
            `}</style>

            <div style={{
                minHeight: "100vh",
                background: "#f0ead6",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
            }}>

                {/* ========== NAVBAR ========== */}
                <nav className="lp-navbar">
                    <a href="/" className="lp-nav-logo">
                        <div className="lp-nav-logo-icon">
                            <span>TM<br />WA</span>
                        </div>
                        <div className="lp-nav-logo-text">
                            Time Management<br />Web App
                        </div>
                    </a>

                    <div className="lp-nav-links">
                        <a href="#features" className="lp-nav-link">Features</a>
                        <a href="#pricing" className="lp-nav-link">Pricing</a>
                        <a href="#faq" className="lp-nav-link">FAQ</a>
                    </div>

                    <div className="lp-nav-auth">
                        <Link to={ROUTES.LOGIN} className="lp-nav-login">Login</Link>
                        <Link to={ROUTES.SIGNUP} className="lp-nav-signup">Sign Up</Link>
                    </div>
                </nav>

                {/* ========== HERO ========== */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    minHeight: "100vh",
                    overflow: "hidden",
                    paddingTop: "60px",
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "clamp(28px, 4vw, 64px)",
                        width: "100%",
                        flexWrap: "wrap",
                        justifyContent: "center",
                    }}>

                        {/* ========== LAPTOP MOCKUP ========== */}
                        <div className="lp-laptop" style={{
                            flex: "1 1 600px",
                            maxWidth: "800px",
                            minWidth: "340px",
                            marginLeft: "clamp(-160px, -10vw, -60px)",
                            padding: "20px 0",
                        }}>
                            <div className="laptop-frame">
                                <div className="laptop-bezel">
                                    {/* traffic light buttons */}
                                    <div className="laptop-traffic">
                                        <div className="laptop-dot" style={{ background: "#ff5f57" }} />
                                        <div className="laptop-dot" style={{ background: "#febc2e" }} />
                                        <div className="laptop-dot" style={{ background: "#28c840" }} />
                                    </div>
                                    <img
                                        className="laptop-screen-img"
                                        src="/calendar-preview.png"
                                        alt="TMWA Calendar Dashboard"
                                    />
                                </div>
                                <div className="laptop-base" />
                                <div className="laptop-bottom" />
                            </div>
                        </div>

                        {/* ========== TEXT CONTENT ========== */}
                        <div style={{
                            flex: "1 1 340px",
                            maxWidth: "440px",
                            minWidth: "280px",
                            paddingRight: "clamp(24px, 4vw, 60px)",
                        }}>
                            <h1 className="lp-heading" style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontStyle: "italic",
                                fontWeight: 400,
                                fontSize: "clamp(36px, 4.5vw, 56px)",
                                lineHeight: 1.15,
                                color: "#2c5ea8",
                                marginBottom: "24px",
                            }}>
                                Efficiency,<br />
                                Collaboration,<br />
                                and Flow
                            </h1>

                            <p className="lp-subtitle" style={{
                                fontSize: "clamp(14px, 1.4vw, 17px)",
                                lineHeight: 1.7,
                                color: "#3c3c2e",
                                marginBottom: "32px",
                                maxWidth: "360px",
                            }}>
                                An all-in-one time management solution focused
                                on effective user interface and collaboration.
                            </p>

                            <div className="lp-buttons" style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                                <Link to={ROUTES.LOGIN} className="lp-login-btn">
                                    Login
                                </Link>
                                <Link to={ROUTES.SIGNUP} className="lp-cta-btn">
                                    Get Started Today
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
