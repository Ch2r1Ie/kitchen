"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Update = { imgLabel: string; date: string; title: string; desc: string };

const UPDATES: Update[] = [
  { imgLabel: "seasonal menu photo", date: "Jul 5, 2026", title: "New Seasonal Menu Is Here", desc: "Fresh grilled squid and basil fried rice just added — available for a limited time." },
  { imgLabel: "promotion photo", date: "Jun 28, 2026", title: "20% Off This Weekend", desc: "Scan, order and enjoy 20% off all noodle dishes, Saturday and Sunday only." },
  { imgLabel: "takeaway photo", date: "Jun 15, 2026", title: "Now Open for Takeaway", desc: "Skip the table — order ahead and pick up your favorites on the way home." },
  { imgLabel: "songkran photo", date: "Jun 3, 2026", title: "Songkran Family Set", desc: "A shareable set for four — soup, rice, grilled skewers and dessert at one price." },
  { imgLabel: "renovation photo", date: "May 20, 2026", title: "Fresh New Dining Room", desc: "We refreshed the seating area — come see the new look on your next visit." },
  { imgLabel: "hiring photo", date: "May 8, 2026", title: "We're Hiring Kitchen Staff", desc: "Join our growing team — message us on LINE to apply." },
];

export default function Website() {
  const [isMobile, setIsMobile] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const signInTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (signInTimer.current) clearTimeout(signInTimer.current);
    };
  }, []);

  function scrollTrack(dir: number) {
    trackRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  }

  function openLogin() {
    setShowLogin(true);
    setSigningIn(false);
  }

  function closeLogin() {
    setShowLogin(false);
    setSigningIn(false);
  }

  function signIn() {
    setSigningIn(true);
    signInTimer.current = setTimeout(() => {
      window.location.href = "/portal";
    }, 1100);
  }

  return (
    <div style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif", background: "#ffffff", minHeight: "100vh", color: "#09090b" }}>
      {/* Nav */}
      <div style={{ position: "sticky", top: 0, zIndex: 30, background: "#ffffff", borderBottom: "1px solid #e4e4e7", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        {isMobile ? (
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "#18181b", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
              <path d="M14 14h3v3h-3zM14 20h1M20 14v1M20 17v3h-3"></path>
            </svg>
          </div>
        ) : (
          <div style={{ fontWeight: 800, fontSize: 17 }}>Baan Baan Kitchen</div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <a href="#updates" style={{ fontSize: 14, fontWeight: 600, textDecoration: "none", color: "#3f3f46" }}>
            Updates
          </a>
          <button onClick={openLogin} style={{ border: "1px solid #e4e4e7", background: "white", color: "#09090b", borderRadius: 8, padding: "9px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Login
          </button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding: "80px 32px 64px", textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15 }}>Baan Baan Kitchen</div>
        <div style={{ fontFamily: "'Noto Sans Thai', sans-serif", fontSize: 22, color: "#71717a", marginTop: 6 }}>บ้าน บ้าน คิทเช่น</div>
        <div style={{ fontSize: 19, color: "#52525b", marginTop: 20, lineHeight: 1.6, fontFamily: "'Noto Sans Thai', sans-serif" }}>
          ระบบสแกนสั่งอาหารสำหรับร้านอาหาร ลดคน เพิ่มยอดขาย พร้อมใช้งานทันที
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
          <a href="https://line.me/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", background: "#06c755", color: "white", padding: "14px 26px", borderRadius: 12, fontSize: 15, fontWeight: 700 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 5.9 2 10.7c0 4.3 3.6 7.9 8.4 8.6.3.06.7.2.8.46.1.24.06.6.03.85l-.13 1c-.04.3-.24 1.17 1.02.64 1.27-.53 6.83-4.02 9.32-6.88C22.9 13.55 24 12.2 24 10.7 24 5.9 17.52 2 12 2z"></path>
            </svg>
            Add Friend
          </a>
          <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", background: "#ff0000", color: "white", padding: "14px 26px", borderRadius: 12, fontSize: 15, fontWeight: 700 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M23 12s0-3.4-.4-5c-.3-1-1-1.8-2-2C18.9 4.5 12 4.5 12 4.5s-6.9 0-8.6.5c-1 .2-1.7 1-2 2C1 8.6 1 12 1 12s0 3.4.4 5c.3 1 1 1.8 2 2 1.7.5 8.6.5 8.6.5s6.9 0 8.6-.5c1-.2 1.7-1 2-2 .4-1.6.4-5 .4-5zM9.8 15.5v-7l6 3.5-6 3.5z"></path>
            </svg>
            YouTube
          </a>
        </div>
      </div>

      {/* Updates */}
      <div id="updates" style={{ background: "#fafafa", padding: "56px 32px", borderTop: "1px solid #e4e4e7" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800 }}>What&apos;s Happening</div>
              <div style={{ fontSize: 15, color: "#71717a", marginTop: 6 }}>Latest news, menus and promotions from the kitchen</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button onClick={() => scrollTrack(-1)} style={{ width: 38, height: 38, borderRadius: 8, border: "1px solid #e4e4e7", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button onClick={() => scrollTrack(1)} style={{ width: 38, height: 38, borderRadius: 8, border: "1px solid #e4e4e7", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>

          <div ref={trackRef} style={{ display: "flex", gap: 20, overflowX: "auto", scrollSnapType: "x mandatory", scrollBehavior: "smooth", paddingBottom: 6 }}>
            {UPDATES.map((u) => (
              <div key={u.title} style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: 14, overflow: "hidden", flex: "0 0 260px", scrollSnapAlign: "start" }}>
                <div style={{ aspectRatio: "16/10", background: "repeating-linear-gradient(45deg, #f4f4f5, #f4f4f5 10px, #ececed 10px, #ececed 20px)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: 11, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {u.imgLabel}
                </div>
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#71717a" }}>{u.date}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginTop: 6 }}>{u.title}</div>
                  <div style={{ fontSize: 13, color: "#71717a", marginTop: 6, lineHeight: 1.5 }}>{u.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 36, background: "#06c755", borderRadius: 16, padding: 32, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
            <div>
              <div style={{ color: "white", fontSize: 19, fontWeight: 800 }}>Get every update on LINE</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, marginTop: 4 }}>โปรโมชั่น เมนูใหม่ และข่าวสารร้าน ส่งตรงถึงมือคุณ</div>
            </div>
            <a href="https://line.me/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", background: "white", color: "#06c755", padding: "13px 26px", borderRadius: 10, fontSize: 15, fontWeight: 700, flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#06c755">
                <path d="M12 2C6.48 2 2 5.9 2 10.7c0 4.3 3.6 7.9 8.4 8.6.3.06.7.2.8.46.1.24.06.6.03.85l-.13 1c-.04.3-.24 1.17 1.02.64 1.27-.53 6.83-4.02 9.32-6.88C22.9 13.55 24 12.2 24 10.7 24 5.9 17.52 2 12 2z"></path>
              </svg>
              Add Friend
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "#18181b", color: "#ffffff", padding: "52px 32px 0" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 32, paddingBottom: 40 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17 }}>Baan Baan Kitchen</div>
            <div style={{ fontFamily: "'Noto Sans Thai', sans-serif", fontSize: 14, color: "#a1a1aa", marginTop: 4 }}>บ้าน บ้าน คิทเช่น</div>
            <div style={{ fontSize: 13, color: "#a1a1aa", marginTop: 12, lineHeight: 1.6, maxWidth: 220, fontFamily: "'Noto Sans Thai', sans-serif" }}>
              ระบบสแกนสั่งอาหารสำหรับร้านอาหาร ลดคน เพิ่มยอดขาย พร้อมใช้งานทันที
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#71717a", marginBottom: 14 }}>Explore</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a href="#updates" style={{ fontSize: 14, color: "#d4d4d8", textDecoration: "none" }}>
                Updates
              </a>
              <Link href="/scan" style={{ fontSize: 14, color: "#d4d4d8", textDecoration: "none" }}>
                Order Now
              </Link>
              <button onClick={openLogin} style={{ border: "none", background: "transparent", padding: 0, textAlign: "left", fontSize: 14, color: "#d4d4d8", cursor: "pointer", fontFamily: "inherit" }}>
                Login
              </button>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#71717a", marginBottom: 14 }}>Contact</div>
            <div style={{ fontSize: 14, color: "#d4d4d8", lineHeight: 1.8 }}>
              88 Sukhumvit Soi 24
              <br />
              Khlong Toei, Bangkok
              <br />
              02-123-4567
              <br />
              hello@baansuankitchen.co.th
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#71717a", marginBottom: 14 }}>Follow Us</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="https://line.me/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#d4d4d8", textDecoration: "none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#06c755">
                  <path d="M12 2C6.48 2 2 5.9 2 10.7c0 4.3 3.6 7.9 8.4 8.6.3.06.7.2.8.46.1.24.06.6.03.85l-.13 1c-.04.3-.24 1.17 1.02.64 1.27-.53 6.83-4.02 9.32-6.88C22.9 13.55 24 12.2 24 10.7 24 5.9 17.52 2 12 2z"></path>
                </svg>
                LINE
              </a>
              <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#d4d4d8", textDecoration: "none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff0000">
                  <path d="M23 12s0-3.4-.4-5c-.3-1-1-1.8-2-2C18.9 4.5 12 4.5 12 4.5s-6.9 0-8.6.5c-1 .2-1.7 1-2 2C1 8.6 1 12 1 12s0 3.4.4 5c.3 1 1 1.8 2 2 1.7.5 8.6.5 8.6.5s6.9 0 8.6-.5c1-.2 1.7-1 2-2 .4-1.6.4-5 .4-5zM9.8 15.5v-7l6 3.5-6 3.5z"></path>
                </svg>
                YouTube
              </a>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 960, margin: "0 auto", borderTop: "1px solid #27272a", padding: "20px 0", fontSize: 13, color: "#71717a" }}>
          © 2026 Baan Baan Kitchen. All rights reserved.
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={closeLogin}>
          <div style={{ background: "#ffffff", borderRadius: 20, maxWidth: 380, width: "100%", padding: "36px 32px", textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>Welcome back</div>
            <div style={{ fontSize: 14, color: "#71717a", marginTop: 8, lineHeight: 1.6 }}>
              Sign in to the Baan Baan Kitchen Manager Portal to manage orders, menu and sales
            </div>

            <button
              onClick={signIn}
              disabled={signingIn}
              style={{
                marginTop: 24,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                border: "1px solid #e4e4e7",
                background: "#ffffff",
                color: "#09090b",
                borderRadius: 10,
                padding: 13,
                fontSize: 15,
                fontWeight: 600,
                cursor: signingIn ? "default" : "pointer",
                opacity: signingIn ? 0.7 : 1,
              }}
            >
              {signingIn ? (
                "Signing in…"
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z"></path>
                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 6.1 29.5 4 24 4c-7.6 0-14.2 4.3-17.7 10.7z"></path>
                    <path fill="#4CAF50" d="M24 45c5.3 0 10.2-2 13.8-5.3l-6.4-5.4C29.4 35.7 26.8 36.5 24 36.5c-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.7 40.5 16.3 45 24 45z"></path>
                    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.9 2.5-2.5 4.6-4.6 6l6.4 5.4C40.5 36.6 43 30.8 43 24c0-1.2-.1-2.4-.4-3.5z"></path>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <button onClick={closeLogin} style={{ border: "none", background: "transparent", color: "#a1a1aa", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 16 }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
