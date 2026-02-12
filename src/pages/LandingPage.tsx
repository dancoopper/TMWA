import { useAuthStore } from "@/stores/authStore";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ROUTES } from "@/config/routes";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Landing Page                                                       */
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
                @keyframes lp-up {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .lp-h1   { animation: lp-up .8s cubic-bezier(.25,.46,.45,.94) both; }
                .lp-h1-2 { animation: lp-up .8s cubic-bezier(.25,.46,.45,.94) .08s both; }
                .lp-sub  { animation: lp-up .8s cubic-bezier(.25,.46,.45,.94) .16s both; }
                .lp-btns { animation: lp-up .8s cubic-bezier(.25,.46,.45,.94) .24s both; }

                .lp-nav-link {
                    color: #1d1d1f;
                    font-size: 14px;
                    font-weight: 500;
                    transition: color .2s;
                    text-decoration: none;
                }
                .lp-nav-link:hover { color: #6e6e73; }
            `}</style>

            <div className="min-h-screen"
                style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
                    background: "#fff",
                    color: "#1d1d1f",
                }}>

                {/* ========== NAVBAR ========== */}
                <nav className="flex items-center justify-between px-6 md:px-10 py-4"
                    style={{ borderBottom: "1px solid #f0f0f0" }}>
                    {/* logo */}
                    <div className="flex items-center gap-2.5">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg text-white text-xs font-bold"
                            style={{ background: "#1d1d1f" }}>
                            ⴵ
                        </div>
                        <span className="text-base font-semibold tracking-tight">TMWA</span>
                    </div>



                    {/* auth links */}
                    <div className="flex items-center gap-4">
                        <Link to={ROUTES.LOGIN} className="lp-nav-link hidden sm:block">Log In</Link>
                        <Link to={ROUTES.SIGNUP}
                            className="inline-flex items-center px-5 py-2 rounded-full text-white text-sm font-medium"
                            style={{ background: "#1d1d1f", transition: "opacity .2s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = ".85")}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
                            Sign Up
                        </Link>
                    </div>
                </nav>

                {/* ========== HERO ========== */}
                <section className="flex flex-col items-center justify-center px-6 text-center"
                    style={{ paddingTop: "clamp(80px, 12vh, 160px)", paddingBottom: "clamp(80px, 12vh, 160px)" }}>
                    <h1 className="lp-h1 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]"
                        style={{ color: "#1d1d1f" }}>
                        TMWA
                    </h1>
                    <h2 className="lp-h1-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mt-1"
                        style={{ color: "#6e6e73" }}>
                        Simply powerful.
                    </h2>
                    <p className="lp-sub mt-6 text-base sm:text-lg md:text-xl max-w-xl leading-relaxed"
                        style={{ color: "#6e6e73" }}>
                        The intuitive way to organize your life and work. Designed for clarity, built for speed. Experience the difference today.
                    </p>
                    <div className="lp-btns flex items-center gap-5 mt-8">
                        <Link to={ROUTES.SIGNUP}
                            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-white font-medium text-sm"
                            style={{ background: "#6366f1", transition: "background .2s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#5558e6")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "#6366f1")}>
                            Get Started for Free
                        </Link>
                        <Link to={ROUTES.LOGIN}
                            className="inline-flex items-center gap-1.5 font-medium text-sm"
                            style={{ color: "#6366f1", transition: "opacity .2s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = ".75")}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
                            Login
                            <ArrowRight size={15} strokeWidth={2.5} />
                        </Link>
                    </div>
                </section>

                {/* ========== FOOTER ========== */}
                <footer className="text-center py-8 text-xs" style={{ color: "#aeaeb2" }}>
                    © {new Date().getFullYear()} TMWA All rights reserved.
                </footer>
            </div>
        </>
    );
}
