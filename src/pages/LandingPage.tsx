import { useAuthStore } from "@/stores/authStore";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ROUTES } from "@/config/routes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
                .lp-nav-logo-mark {
                    display: flex;
                    flex-direction: column;
                    font-size: 18px;
                    line-height: 0.9;
                    font-weight: 800;
                    letter-spacing: 0.5px;
                    color: #116CE2;
                }
                .lp-nav-logo-mark span {
                    display: block;
                }
                .lp-nav-logo-text {
                    font-size: 13px;
                    font-weight: 500;
                    line-height: 1.15;
                    color: #737269;
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
                    object-position: top right;
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
                        <div className="lp-nav-logo-mark" aria-hidden="true">
                            <span>TM</span>
                            <span>WA</span>
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
                        <Button
                            asChild
                            className="h-9 rounded-xl bg-[#dfdcc8] px-5 text-sm font-semibold text-[#2c2c2c] hover:bg-[#d4d0bb]"
                        >
                            <Link to={ROUTES.LOGIN}>Login</Link>
                        </Button>
                        <Button
                            asChild
                            className="h-9 rounded-xl bg-[#1f2023] px-5 text-sm font-semibold text-white hover:bg-[#17181b]"
                        >
                            <Link to={ROUTES.SIGNUP}>Sign Up</Link>
                        </Button>
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
                            flex: "1 1 680px",
                            maxWidth: "900px",
                            minWidth: "380px",
                            marginLeft: "clamp(-520px, -32vw, -260px)",
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
                                        src="/dashboard-screenshot.png"
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
                                color: "#116CE2",
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
                                <Button
                                    asChild
                                    className="h-12 rounded-xl bg-[#dfdcc8] px-9 text-base font-semibold text-[#2c2c2c] hover:bg-[#d4d0bb]"
                                >
                                    <Link to={ROUTES.LOGIN}>Login</Link>
                                </Button>
                                <Button
                                    asChild
                                    className="h-12 rounded-xl bg-[#1f2023] px-9 text-base font-semibold text-white hover:bg-[#17181b]"
                                >
                                    <Link to={ROUTES.SIGNUP}>Get Started Today</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
