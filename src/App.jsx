import React, { useEffect, useState, useRef } from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Montserrat:wght@300;400;500;600&display=swap');

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --bg: #f0f2f4;
    --navy: #0d2045;
    --text-muted: rgba(13, 32, 69, 0.4);
    --text-faint: rgba(13, 32, 69, 0.15);
  }

  html, body, #root {
    height: 100%;
    width: 100%;
  }

  body {
    background-color: var(--bg);
    color: var(--navy);
    font-family: 'Montserrat', sans-serif;
    overflow: hidden;
  }

  .page {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .grid-bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(13, 32, 69, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(13, 32, 69, 0.03) 1px, transparent 1px);
    background-size: 64px 64px;
    z-index: 0;
  }

  .glow {
    position: absolute;
    width: 700px;
    height: 700px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(13, 32, 69, 0.04) 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
  }

  .top-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 36px 52px;
    z-index: 10;
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }

  .top-bar.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .logo {
    font-family: 'Montserrat', sans-serif;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--navy);
    line-height: 1;
  }

  .logo span {
    font-weight: 300;
    letter-spacing: 0.08em;
  }

  .logo-sub {
    font-size: 9px;
    font-weight: 400;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-top: 5px;
  }

  .top-right {
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .rule {
    position: absolute;
    top: 96px;
    left: 52px;
    right: 52px;
    height: 1px;
    background: linear-gradient(90deg, var(--navy) 0%, rgba(13,32,69,0.08) 100%);
    opacity: 0;
    transition: opacity 1s ease 0.4s;
    z-index: 10;
  }

  .rule.visible {
    opacity: 0.18;
  }

  .center {
    position: relative;
    z-index: 10;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(72px, 10vw, 128px);
    font-weight: 300;
    line-height: 1.0;
    letter-spacing: -0.01em;
    color: var(--navy);
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 1s ease 0.4s, transform 1s ease 0.4s;
    white-space: nowrap;
  }

  .headline.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 0;
    margin-top: 48px;
    opacity: 0;
    transition: opacity 0.8s ease 0.9s;
  }

  .divider.visible {
    opacity: 1;
  }

  .divider-line {
    height: 1px;
    background: var(--navy);
    flex: 1;
  }

  .divider-diamond {
    width: 6px;
    height: 6px;
    background: var(--navy);
    transform: rotate(45deg);
    flex-shrink: 0;
    margin: 0 10px;
  }

  .bottom-bar {
    position: absolute;
    bottom: 36px;
    left: 52px;
    right: 52px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    z-index: 10;
    opacity: 0;
    transition: opacity 1s ease 1.2s;
  }

  .bottom-bar.visible {
    opacity: 1;
  }

  .bottom-left {
    font-size: 9.5px;
    letter-spacing: 0.18em;
    color: var(--text-faint);
    text-transform: uppercase;
  }

  .bottom-right {
    font-size: 9.5px;
    letter-spacing: 0.18em;
    color: var(--text-faint);
    text-transform: uppercase;
  }

  .corner {
    position: absolute;
    width: 18px;
    height: 18px;
    z-index: 10;
    opacity: 0;
    transition: opacity 1s ease 0.6s;
  }

  .corner.visible { opacity: 0.22; }
  .corner-tl { top: 24px; left: 24px; border-top: 1.5px solid var(--navy); border-left: 1.5px solid var(--navy); }
  .corner-tr { top: 24px; right: 24px; border-top: 1.5px solid var(--navy); border-right: 1.5px solid var(--navy); }
  .corner-bl { bottom: 24px; left: 24px; border-bottom: 1.5px solid var(--navy); border-left: 1.5px solid var(--navy); }
  .corner-br { bottom: 24px; right: 24px; border-bottom: 1.5px solid var(--navy); border-right: 1.5px solid var(--navy); }
`;

export default function App() {
  const [visible, setVisible] = useState(false);
  const [lineWidth, setLineWidth] = useState(0);
  const headlineRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (headlineRef.current) {
      const w = headlineRef.current.getBoundingClientRect().width;
      setLineWidth(w);
    }
  }, [visible]);

  const v = visible ? 'visible' : '';

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="grid-bg" />
        <div className="glow" />

        <div className={`corner corner-tl ${v}`} />
        <div className={`corner corner-tr ${v}`} />
        <div className={`corner corner-bl ${v}`} />
        <div className={`corner corner-br ${v}`} />

        <div className={`top-bar ${v}`}>
          <div>
            <div className="logo">Dupont <span>Economics</span></div>
            <div className="logo-sub">Washington, D.C.</div>
          </div>
          <div className="top-right">Research &amp; Analysis</div>
        </div>

        <div className={`rule ${v}`} />

        <div className="center">
          <h1 className={`headline ${v}`} ref={headlineRef}>
            Coming Soon
          </h1>
          <div
            className={`divider ${v}`}
            style={{ width: lineWidth ? `${lineWidth}px` : 'auto' }}
          >
            <div className="divider-line" />
            <div className="divider-diamond" />
            <div className="divider-line" />
          </div>
        </div>

        <div className={`bottom-bar ${v}`}>
          <div className="bottom-left">Dupont Economics</div>
          <div className="bottom-right">© {new Date().getFullYear()}</div>
        </div>
      </div>
    </>
  );
}
