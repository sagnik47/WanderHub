export default function HomePage() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Crimson+Pro:ital,wght@0,300;1,300&display=swap"
        rel="stylesheet"
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

            html, body {
              height: 100%;
              overflow: hidden;
              font-family: 'Crimson Pro', Georgia, serif;
            }

            .scene {
              position: fixed;
              inset: 0;
              background:
                linear-gradient(180deg, transparent 70%, #0d1f0a 85%, #0a1808 100%),
                linear-gradient(180deg, transparent 40%, rgba(8,18,6,0.55) 70%, transparent 100%),
                radial-gradient(ellipse 160% 80% at 50% 100%, #0e1e0b 0%, transparent 70%),
                linear-gradient(180deg,
                  #1a1208 0%,
                  #2b1e0c 18%,
                  #4a2e0f 34%,
                  #7a4a18 48%,
                  #a8681e 58%,
                  #c98530 65%,
                  #d9962a 70%,
                  #e8b040 74%,
                  #f0c55a 78%,
                  #f5d478 81%,
                  #f8e090 84%,
                  #f5d478 87%,
                  #d4a030 90%,
                  #1e3a10 92%,
                  #142808 96%,
                  #0d1e07 100%
                );
            }

            .sun-glow {
              position: absolute;
              top: 60%; left: 38%;
              transform: translate(-50%, -50%);
              width: 320px; height: 220px;
              background: radial-gradient(ellipse,
                rgba(255,230,120,0.55) 0%,
                rgba(240,180,60,0.3) 25%,
                rgba(200,130,20,0.15) 50%,
                transparent 75%
              );
              filter: blur(18px);
              animation: haze 6s ease-in-out infinite alternate;
            }
            @keyframes haze {
              from { opacity: 0.85; transform: translate(-50%,-50%) scale(1); }
              to   { opacity: 1;    transform: translate(-50%,-50%) scale(1.08); }
            }

            .rays {
              position: absolute;
              inset: 0;
              overflow: hidden;
            }
            .rays::before {
              content: '';
              position: absolute;
              inset: 0;
              background:
                linear-gradient(170deg, transparent 40%, rgba(230,170,50,0.06) 50%, transparent 55%),
                linear-gradient(165deg, transparent 38%, rgba(220,160,40,0.05) 48%, transparent 54%),
                linear-gradient(175deg, transparent 42%, rgba(240,185,60,0.07) 52%, transparent 57%),
                linear-gradient(168deg, transparent 36%, rgba(210,150,35,0.04) 46%, transparent 52%),
                linear-gradient(172deg, transparent 40%, rgba(235,175,55,0.06) 50%, transparent 56%);
              mix-blend-mode: screen;
              animation: rayShift 8s ease-in-out infinite alternate;
            }
            @keyframes rayShift {
              from { opacity: 0.7; } to { opacity: 1; }
            }

            .trees { position: absolute; inset: 0; }
            .trees svg { width: 100%; height: 100%; }

            .mist {
              position: absolute;
              bottom: 6%; left: 0; right: 0;
              height: 120px;
              background: radial-gradient(ellipse 80% 100% at 50% 100%,
                rgba(200,160,80,0.12) 0%, rgba(180,140,60,0.06) 40%, transparent 70%
              );
              filter: blur(8px);
            }

            .ground { position: absolute; bottom: 0; left: 0; right: 0; height: 10%; min-height: 55px; }
            .ground svg { width: 100%; height: 100%; }

            .wrapper {
              position: relative;
              z-index: 20;
              height: 100vh;
              display: grid;
              place-items: center;
              padding: 1.5rem;
            }

            .card {
              background: rgba(8,14,6,0.68);
              backdrop-filter: blur(22px) saturate(1.4);
              -webkit-backdrop-filter: blur(22px) saturate(1.4);
              border: 1px solid rgba(200,150,50,0.18);
              padding: 2.2rem 2.8rem 1.8rem;
              max-width: 420px;
              width: 100%;
              position: relative;
              box-shadow: 0 4px 60px rgba(0,0,0,0.7), 0 1px 0 rgba(220,170,60,0.06) inset;
              animation: fadeUp 1.1s cubic-bezier(0.16,1,0.3,1) both;
            }
            .card::before, .card::after {
              content: '';
              position: absolute;
              width: 14px; height: 14px;
              border-color: rgba(210,160,50,0.4);
              border-style: solid;
            }
            .card::before { top: -1px; left: -1px; border-width: 1.5px 0 0 1.5px; }
            .card::after  { bottom: -1px; right: -1px; border-width: 0 1.5px 1.5px 0; }

            @keyframes fadeUp {
              from { opacity: 0; transform: translateY(28px) scale(0.98); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }

            .badge {
              display: inline-flex;
              align-items: center;
              gap: 0.45rem;
              background: rgba(200,150,40,0.08);
              border: 1px solid rgba(200,150,40,0.2);
              color: #c8a040;
              font-size: 0.6rem;
              letter-spacing: 0.22em;
              text-transform: uppercase;
              padding: 0.26rem 0.7rem;
              margin-bottom: 1.5rem;
            }
            .badge-dot {
              width: 5px; height: 5px;
              border-radius: 50%;
              background: #c8a040;
              animation: blink 2.8s ease-in-out infinite;
            }
            @keyframes blink {
              0%,100% { opacity:1; box-shadow: 0 0 4px #c8a040; }
              50%      { opacity:0.2; box-shadow: none; }
            }

            h1 {
              font-family: 'Playfair Display', Georgia, serif;
              font-size: clamp(1.85rem, 4.5vw, 2.5rem);
              font-weight: 400;
              line-height: 1.2;
              color: #f0e8d0;
              margin-bottom: 0.9rem;
            }
            h1 em { font-style: italic; color: #d4a840; }

            .message {
              font-size: 0.95rem;
              line-height: 1.7;
              color: #a89070;
              margin-bottom: 1.6rem;
              font-weight: 300;
              font-style: italic;
            }

            .divider {
              height: 1px;
              background: linear-gradient(90deg, transparent, rgba(200,150,40,0.16), transparent);
              margin-bottom: 1.4rem;
            }

            .links {
              display: flex;
              gap: 0.75rem;
              align-items: center;
            }

            .link-btn {
              display: inline-flex;
              align-items: center;
              gap: 0.45rem;
              text-decoration: none;
              color: #907860;
              font-size: 0.72rem;
              letter-spacing: 0.1em;
              padding: 0.45rem 0.95rem;
              border: 1px solid rgba(255,255,255,0.09);
              transition: all 0.3s ease;
              background: rgba(255,255,255,0.02);
            }
            .link-btn:hover {
              color: #f0e0b0;
              border-color: rgba(200,150,40,0.35);
              background: rgba(200,150,40,0.06);
              transform: translateY(-1px);
            }
            .link-btn svg { width: 14px; height: 14px; fill: currentColor; flex-shrink: 0; }

            .coords {
              margin-left: auto;
              font-size: 0.58rem;
              letter-spacing: 0.1em;
              color: rgba(255,255,255,0.1);
              font-family: monospace;
            }
          `,
        }}
      />

      <div className="scene">
        <div className="sun-glow" />
        <div className="rays" />

        <div className="trees">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="trunk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0c1808" stopOpacity="0.98" />
                <stop offset="100%" stopColor="#080f05" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="canopy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#060c04" stopOpacity="0.97" />
                <stop offset="80%" stopColor="#0e1c09" stopOpacity="0.88" />
                <stop offset="100%" stopColor="#0e1c09" stopOpacity="0" />
              </linearGradient>
            </defs>
            <ellipse cx="-30" cy="680" rx="180" ry="320" fill="#060c04" opacity="0.95" />
            <ellipse cx="20" cy="500" rx="120" ry="260" fill="#080e05" opacity="0.9" />
            <polygon points="195,900 205,900 210,320 190,320" fill="url(#trunk)" />
            <ellipse cx="200" cy="320" rx="28" ry="180" fill="#060c04" opacity="0.92" />
            <polygon points="275,900 287,900 291,260 271,260" fill="url(#trunk)" />
            <ellipse cx="281" cy="260" rx="32" ry="200" fill="#080e05" opacity="0.9" />
            <polygon points="360,900 370,900 374,300 356,300" fill="url(#trunk)" />
            <ellipse cx="365" cy="300" rx="26" ry="170" fill="#060c04" opacity="0.88" />
            <polygon points="445,900 457,900 460,270 442,270" fill="#1a1008" opacity="0.85" />
            <ellipse cx="451" cy="270" rx="30" ry="190" fill="#100c06" opacity="0.8" />
            <polygon points="530,900 542,900 546,290 528,290" fill="url(#trunk)" />
            <ellipse cx="536" cy="290" rx="28" ry="175" fill="#060c04" opacity="0.9" />
            <polygon points="620,900 630,900 633,310" fill="url(#trunk)" />
            <ellipse cx="625" cy="310" rx="24" ry="165" fill="#080e05" opacity="0.88" />
            <polygon points="1100,900 1112,900 1115,340 1097,340" fill="url(#trunk)" />
            <ellipse cx="1106" cy="340" rx="30" ry="185" fill="#060c04" opacity="0.9" />
            <polygon points="1185,900 1196,900 1199,280 1181,280" fill="url(#trunk)" />
            <ellipse cx="1190" cy="280" rx="28" ry="195" fill="#080e05" opacity="0.88" />
            <polygon points="1270,900 1280,900 1283,310 1265,310" fill="url(#trunk)" />
            <ellipse cx="1275" cy="310" rx="24" ry="170" fill="#060c04" opacity="0.87" />
            <polygon points="1350,900 1362,900 1366,260 1347,260" fill="url(#trunk)" />
            <ellipse cx="1356" cy="260" rx="32" ry="200" fill="#080e05" opacity="0.9" />
            <ellipse cx="1480" cy="680" rx="180" ry="320" fill="#060c04" opacity="0.95" />
            <ellipse cx="1430" cy="500" rx="140" ry="270" fill="#080e05" opacity="0.9" />
            <ellipse cx="0" cy="200" rx="300" ry="300" fill="url(#canopy)" />
            <ellipse cx="100" cy="100" rx="250" ry="280" fill="#060c04" opacity="0.85" />
            <ellipse cx="250" cy="150" rx="200" ry="240" fill="#060c04" opacity="0.75" />
            <ellipse cx="350" cy="80" rx="160" ry="200" fill="#070d04" opacity="0.7" />
            <ellipse cx="1440" cy="200" rx="300" ry="300" fill="url(#canopy)" />
            <ellipse cx="1350" cy="100" rx="250" ry="280" fill="#060c04" opacity="0.85" />
            <ellipse cx="1200" cy="140" rx="200" ry="240" fill="#060c04" opacity="0.72" />
            <ellipse cx="1100" cy="80" rx="170" ry="210" fill="#070d04" opacity="0.68" />
            <ellipse cx="550" cy="120" rx="100" ry="140" fill="#060c04" opacity="0.55" />
            <ellipse cx="680" cy="90" rx="80" ry="120" fill="#070d04" opacity="0.45" />
            <ellipse cx="160" cy="860" rx="130" ry="60" fill="#080f05" opacity="0.9" />
            <ellipse cx="340" cy="870" rx="100" ry="50" fill="#070d04" opacity="0.85" />
            <ellipse cx="500" cy="855" rx="90" ry="45" fill="#080f05" opacity="0.8" />
            <ellipse cx="900" cy="870" rx="120" ry="55" fill="#070d04" opacity="0.85" />
            <ellipse cx="1050" cy="860" rx="100" ry="48" fill="#080f05" opacity="0.9" />
            <ellipse cx="1280" cy="865" rx="130" ry="55" fill="#070d04" opacity="0.88" />
            <ellipse cx="1400" cy="850" rx="110" ry="50" fill="#080f05" opacity="0.85" />
          </svg>
        </div>

        <div className="mist" />

        <div className="ground">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#162610" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0a1608" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path d="M0,80 Q20,40 40,55 Q60,30 80,50 Q100,20 120,45 Q140,35 160,55 Q180,25 200,48 Q220,38 240,58 Q260,28 280,50 Q300,40 320,60 Q340,22 360,48 Q380,35 400,55 Q420,28 440,50 Q460,38 480,58 Q500,20 520,45 Q540,35 560,55 Q580,25 600,48 Q620,40 640,60 Q660,22 680,46 Q700,36 720,56 Q740,28 760,50 Q780,38 800,58 Q820,20 840,44 Q860,34 880,54 Q900,26 920,48 Q940,36 960,56 Q980,28 1000,50 Q1020,40 1040,60 Q1060,22 1080,46 Q1100,36 1120,56 Q1140,28 1160,50 Q1180,38 1200,58 Q1220,20 1240,44 Q1260,34 1280,54 Q1300,26 1320,48 Q1340,36 1360,56 Q1380,28 1400,50 Q1420,40 1440,60 L1440,80 Z" fill="url(#grass)" />
          </svg>
        </div>
      </div>

      <div className="wrapper">
        <div className="card">
          <div className="badge">
            <span className="badge-dot" />
            Trail temporarily closed
          </div>

          <h1>
            Gone off the <em>grid.</em>
          </h1>

          <p className="message">
            Saving API credits — broke college student problems.
            <br />
            DM me if you'd like early access.
          </p>

          <div className="divider" />

          <div className="links">
            <a className="link-btn" href="https://www.linkedin.com/in/sagnik-aditya/" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>

            <a className="link-btn" href="https://github.com/sagnik47" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              GitHub
            </a>

            <span className="coords">28.6°N · 77.2°E</span>
          </div>
        </div>
      </div>
    </>
  )
}
