import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const TELEGRAM_URL = 'https://t.me/get01projects'
const GITHUB_URL = 'https://github.com/aetherdev01/aetherx-web'
const DOWNLOAD_URL = TELEGRAM_URL

const PAGES = [
  { path: '/', label: 'Home' },
  { path: '/download', label: 'Download' },
  { path: '/preview', label: 'Preview' },
  { path: '/about', label: 'About' },
]

const FEATURE_DATA = [
  {
    number: '01',
    title: 'CPU / GPU control',
    body: 'Pilih governor dan perilaku performa perangkat tanpa harus berpindah aplikasi.',
  },
  {
    number: '02',
    title: 'Thermal tuning',
    body: 'Atur bagian thermal dengan kontrol yang lebih terarah untuk pemakaian harian maupun gaming.',
  },
  {
    number: '03',
    title: 'Per-game profiles',
    body: 'Setiap game bisa punya konfigurasi tweak sendiri, terpisah dari profil perangkat utama.',
  },
  {
    number: '04',
    title: 'Glass sliding UI',
    body: 'Tab bar glass dengan perpindahan sliding yang menjadi bagian dari pola navigasi AetherX.',
  },
]

const DOWNLOAD_FEATURES = [
  'CPU governor controls',
  'GPU governor controls',
  'Thermal tuning',
  'Independent per-game tweaks',
  'Glass sliding tab navigation',
]

function normalizePath(pathname = window.location.pathname) {
  const cleaned = pathname.replace(/\/+$/, '') || '/'
  return PAGES.some((page) => page.path === cleaned) ? cleaned : '/'
}

function useNavigation() {
  const [path, setPath] = useState(() => normalizePath())

  useEffect(() => {
    const onPopState = () => setPath(normalizePath())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (nextPath) => {
    if (nextPath === path) return
    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  return { path, navigate }
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    return localStorage.getItem('aetherx-theme') || 'dark'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('aetherx-theme', theme)
    const themeMeta = document.querySelector('meta[name="theme-color"]')
    themeMeta?.setAttribute('content', theme === 'dark' ? '#0b0d10' : '#f4f6f8')
  }, [theme])

  return { theme, toggleTheme: () => setTheme((value) => value === 'dark' ? 'light' : 'dark') }
}

function App() {
  const { path, navigate } = useNavigation()
  const { theme, toggleTheme } = useTheme()
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  return (
    <div className="site-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />

      <header className="site-header">
        <div className="header-inner">
          <RippleButton className="brand" onClick={() => navigate('/')} aria-label="Go to AetherX home">
            <img src="/assets/aether-dev-logo.jpg" alt="Aether Dev" className="brand-mark" />
            <span className="brand-word">Aether<span>X</span></span>
          </RippleButton>

          <nav className="main-nav" aria-label="Primary">
            {PAGES.map((page) => (
              <RippleButton
                key={page.path}
                className={`nav-link ${path === page.path ? 'is-active' : ''}`}
                onClick={() => navigate(page.path)}
              >
                {page.label}
              </RippleButton>
            ))}
          </nav>

          <div className="header-tools">
            <RippleButton className="icon-button" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </RippleButton>
            <RippleLink className="header-cta" href={DOWNLOAD_URL} target="_blank" rel="noreferrer">
              Get AetherX <ArrowUpRightIcon />
            </RippleLink>
            <RippleButton className="icon-button menu-trigger" onClick={() => setDrawerOpen(true)} aria-label="Open navigation">
              <MenuIcon />
            </RippleButton>
          </div>
        </div>
      </header>

      <div className={`drawer-backdrop ${drawerOpen ? 'is-open' : ''}`} onClick={() => setDrawerOpen(false)} aria-hidden={!drawerOpen}>
        <aside className="mobile-drawer" onClick={(event) => event.stopPropagation()}>
          <div className="drawer-head">
            <div className="drawer-brand">
              <img src="/assets/aether-dev-logo.jpg" alt="Aether Dev" />
              <div><strong>AetherX</strong><span>Aether Dev</span></div>
            </div>
            <RippleButton className="icon-button" onClick={() => setDrawerOpen(false)} aria-label="Close navigation"><CloseIcon /></RippleButton>
          </div>
          <div className="drawer-nav">
            {PAGES.map((page) => (
              <RippleButton key={page.path} className={`drawer-link ${path === page.path ? 'is-active' : ''}`} onClick={() => { navigate(page.path); setDrawerOpen(false) }}>
                <span>{page.label}</span><ArrowRightIcon />
              </RippleButton>
            ))}
          </div>
          <div className="drawer-foot">
            <RippleLink className="drawer-link" href={TELEGRAM_URL} target="_blank" rel="noreferrer"><span>Telegram</span><ExternalLinkIcon /></RippleLink>
            <RippleLink className="drawer-link" href={GITHUB_URL} target="_blank" rel="noreferrer"><span>GitHub</span><ExternalLinkIcon /></RippleLink>
            <RippleButton className="drawer-link" onClick={toggleTheme}><span>{theme === 'dark' ? 'Switch to light' : 'Switch to dark'}</span>{theme === 'dark' ? <SunIcon /> : <MoonIcon />}</RippleButton>
          </div>
        </aside>
      </div>

      <main className="page-content">
        {path === '/' && <HomePage navigate={navigate} />}
        {path === '/download' && <DownloadPage />}
        {path === '/preview' && <PreviewPage />}
        {path === '/about' && <AboutPage />}
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand"><img src="/assets/aether-dev-logo.jpg" alt="Aether Dev" /><span>AetherX</span></div>
          <span className="footer-copy">Android performance app by Aether Dev</span>
          <div className="footer-links">
            <RippleLink href={TELEGRAM_URL} target="_blank" rel="noreferrer">Telegram <ArrowUpRightIcon /></RippleLink>
            <RippleLink href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub <ArrowUpRightIcon /></RippleLink>
          </div>
        </div>
      </footer>
    </div>
  )
}

function HomePage({ navigate }) {
  return (
    <div>
      <section className="hero section-wrap">
        <div className="hero-copy">
          <span className="micro-label"><span className="status-dot" /> Android performance app</span>
          <h1>AetherX<span>Control your Android.</span></h1>
          <p className="hero-lead">Atur governor CPU/GPU, thermal, dan tweak per game dari satu interface yang dibuat sederhana, cepat, dan tetap fokus pada perangkatmu.</p>

          <div className="hero-actions">
            <RippleButton className="primary-button" onClick={() => navigate('/download')}>Download AetherX <DownloadIcon /></RippleButton>
            <RippleButton className="secondary-button" onClick={() => navigate('/preview')}>View interface <ArrowRightIcon /></RippleButton>
          </div>

          <div className="hero-chips" aria-label="AetherX features">
            <span className="hero-chip"><i />CPU / GPU</span>
            <span className="hero-chip"><i />Thermal</span>
            <span className="hero-chip"><i />Per-game</span>
            <span className="hero-chip"><i />Glass sliding UI</span>
          </div>
        </div>

        <div className="hero-media">
          <div className="hero-preview">
            <div className="hero-preview-bar"><span>AETHERX</span><span>ANDROID PERFORMANCE</span></div>
            <img src="/assets/aetherx-preview.jpg" alt="AetherX app interface preview" />
            <div className="hero-preview-tag">
              <div><span>Interface preview</span><strong>Built around control.</strong></div>
              <span className="arrow-badge"><ArrowUpRightIcon /></span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap home-block">
        <div className="section-header">
          <div>
            <span className="micro-label">What AetherX does</span>
            <h2>Everything important. Nothing crowded.</h2>
          </div>
          <p>Kontrol utama didekatkan ke fungsi yang memang kamu gunakan, tanpa membuat halaman terlihat seperti dashboard penuh panel.</p>
        </div>

        <div className="feature-grid">
          {FEATURE_DATA.map((item, index) => (
            <article className="feature" key={item.number}>
              <span className="feature-number">{item.number}</span>
              <div className="feature-icon">{index === 0 ? <CpuIcon /> : index === 1 ? <ThermalIcon /> : index === 2 ? <GameIcon /> : <LayersIcon />}</div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-wrap home-block preview-strip">
        <div className="preview-strip-copy">
          <span className="micro-label">Interface</span>
          <h2>Glass navigation, without visual noise.</h2>
          <p>Tab bar sliding menjadi bagian dari pengalaman aplikasi, sementara konten tetap jelas dan ringan untuk dibaca.</p>
          <RippleButton className="text-link" onClick={() => navigate('/preview')}>Open full preview <ArrowRightIcon /></RippleButton>
        </div>
        <div className="preview-strip-media">
          <img src="/assets/aetherx-title.jpg" alt="AetherX Kernel Manager" />
        </div>
      </section>

      <section className="section-wrap home-block release-callout">
        <div>
          <span className="micro-label">Get AetherX</span>
          <h2>Ready to tune your device?</h2>
          <p>Download page berisi jalur menuju build dan channel project resmi.</p>
        </div>
        <RippleButton className="primary-button" onClick={() => navigate('/download')}>Go to download <ArrowRightIcon /></RippleButton>
      </section>
    </div>
  )
}

function DownloadPage() {
  return (
    <section className="section-wrap inner-page">
      <div className="page-title">
        <span className="micro-label">AetherX download</span>
        <h1>Get the latest build.</h1>
        <p>Halaman ini dibuat khusus untuk download dan release information. AetherX didistribusikan melalui channel project resmi.</p>
      </div>

      <div className="download-layout">
        <article className="release-card">
          <div className="release-main">
            <div className="release-kicker">LATEST BUILD</div>
            <div className="release-row">
              <div>
                <h2>AetherX Kernel Manager</h2>
                <p>Governor CPU/GPU, thermal, per-game tweaks, dan glass sliding tab bar.</p>
              </div>
              <div className="release-version">v2.0</div>
            </div>
            <div className="release-actions">
              <RippleLink className="primary-button" href={DOWNLOAD_URL} target="_blank" rel="noreferrer">Get the build <DownloadIcon /></RippleLink>
              <RippleLink className="secondary-button" href={GITHUB_URL} target="_blank" rel="noreferrer">Source <ArrowUpRightIcon /></RippleLink>
            </div>
          </div>
          <div className="release-list">
            {DOWNLOAD_FEATURES.map((item) => <div className="release-feature" key={item}><CheckIcon /><span>{item}</span></div>)}
          </div>
        </article>

        <aside className="download-sidebar">
          <div className="side-panel">
            <span className="micro-label">Distribution</span>
            <h3>Telegram project</h3>
            <p>Release, update, dan announcement dibagikan dari channel project.</p>
            <RippleLink className="text-link" href={TELEGRAM_URL} target="_blank" rel="noreferrer">Open Telegram <ArrowUpRightIcon /></RippleLink>
          </div>
          <div className="side-panel side-panel-muted">
            <span className="micro-label">Note</span>
            <h3>Use the official build.</h3>
            <p>Untuk menjaga integritas distribusi, gunakan file yang dibagikan melalui source resmi Aether Dev.</p>
          </div>
        </aside>
      </div>
    </section>
  )
}

function PreviewPage() {
  return (
    <section className="section-wrap inner-page">
      <div className="page-title page-title-row">
        <div>
          <span className="micro-label">AetherX interface</span>
          <h1>Designed for tuning.</h1>
          <p>Preview visual dari aplikasi AetherX dengan fokus pada kontrol performa dan navigasi tab bar glass.</p>
        </div>
        <span className="page-counter">01 — 01</span>
      </div>

      <div className="preview-layout">
        <div className="preview-info">
          <span className="preview-label">AETHERX / INTERFACE</span>
          <h2>Clear status.<br /><span>Fast movement.</span></h2>
          <p>Dashboard dan kontrol disusun agar informasi utama tetap mudah ditemukan. Tab bar glass menjadi elemen navigasi yang aktif, dengan sliding interaction yang memberi konteks saat berpindah area.</p>
          <div className="preview-stats">
            <div><span>Control</span><strong>CPU / GPU</strong></div>
            <div><span>Profile</span><strong>Per game</strong></div>
            <div><span>Navigation</span><strong>Glass sliding</strong></div>
          </div>
        </div>
        <figure className="preview-image-frame">
          <img src="/assets/aetherx-preview.jpg" alt="AetherX application preview" />
        </figure>
      </div>
    </section>
  )
}

function AboutPage() {
  return (
    <section className="section-wrap inner-page">
      <div className="page-title">
        <span className="micro-label">About AetherX</span>
        <h1>Built by Aether Dev.</h1>
        <p>AetherX adalah aplikasi Android untuk mengatur governor CPU/GPU, thermal, dan tweak mandiri per game, dengan UI glass tab bar dan sliding interaction.</p>
      </div>

      <div className="about-layout">
        <div className="about-profile">
          <img src="/assets/aether-dev-logo.jpg" alt="Aether Dev" />
          <strong>Aether Dev</strong>
          <span>AetherX project</span>
        </div>
        <div className="about-copy">
          <span className="micro-label">Project direction</span>
          <h2>Performance controls,<br />without unnecessary noise.</h2>
          <p>Website ini menjadi pintu masuk untuk AetherX: menjelaskan apa yang dilakukan aplikasinya, menampilkan interface, dan menyediakan jalur menuju release resmi.</p>
          <div className="about-actions">
            <RippleLink className="secondary-button" href={TELEGRAM_URL} target="_blank" rel="noreferrer">Telegram <ArrowUpRightIcon /></RippleLink>
            <RippleLink className="secondary-button" href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub <ArrowUpRightIcon /></RippleLink>
          </div>
        </div>
      </div>
    </section>
  )
}

function RippleButton({ className = '', children, onClick, ...props }) {
  return (
    <button
      type="button"
      className={`ripple-host ${className}`}
      onPointerDown={(event) => spawnRipple(event.currentTarget, event)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

function RippleLink({ className = '', children, onClick, ...props }) {
  return (
    <a
      className={`ripple-host ${className}`}
      onPointerDown={(event) => spawnRipple(event.currentTarget, event)}
      onClick={onClick}
      {...props}
    >
      {children}
    </a>
  )
}

function spawnRipple(element, event) {
  const rect = element.getBoundingClientRect()
  const ripple = document.createElement('span')
  ripple.className = 'ripple-wave'
  const size = Math.hypot(rect.width, rect.height) * 1.35
  ripple.style.width = `${size}px`
  ripple.style.height = `${size}px`
  ripple.style.left = `${event.clientX - rect.left}px`
  ripple.style.top = `${event.clientY - rect.top}px`
  element.appendChild(ripple)
  ripple.addEventListener('animationend', () => ripple.remove(), { once: true })
}

function Icon({ children, size = 17, stroke = 1.8 }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}

const ArrowRightIcon = () => <Icon><path d="M5 12h13" /><path d="m13 6 6 6-6 6" /></Icon>
const ArrowUpRightIcon = () => <Icon><path d="M7 17 17 7" /><path d="M7 7h10v10" /></Icon>
const DownloadIcon = () => <Icon><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></Icon>
const CheckIcon = () => <Icon size={16}><path d="m5 12 4 4L19 6" /></Icon>
const MenuIcon = () => <Icon><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></Icon>
const CloseIcon = () => <Icon><path d="m6 6 12 12" /><path d="m18 6-12 12" /></Icon>
const SunIcon = () => <Icon><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></Icon>
const MoonIcon = () => <Icon><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8Z" /></Icon>
const ExternalLinkIcon = () => <Icon size={16}><path d="M14 3h7v7" /><path d="M10 14 21 3" /><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" /></Icon>

const CpuIcon = () => <Icon size={17}><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></Icon>
const ThermalIcon = () => <Icon size={17}><path d="M12 3a3 3 0 0 0-3 3v7.2a4.5 4.5 0 1 0 6 0V6a3 3 0 0 0-3-3Z" /><path d="M12 10v7" /></Icon>
const GameIcon = () => <Icon size={17}><path d="M7 9h10a4 4 0 0 1 3.8 5l-.6 2a2.5 2.5 0 0 1-4.5.6l-.7-1.2H9l-.7 1.2a2.5 2.5 0 0 1-4.5-.6l-.6-2A4 4 0 0 1 7 9Z" /><path d="M8 12v3M6.5 13.5h3M16.5 13.5h.01M18.5 12h.01" /></Icon>
const LayersIcon = () => <Icon size={17}><path d="m12 3 8 4-8 4-8-4 8-4Z" /><path d="m4 12 8 4 8-4" /><path d="m4 16 8 4 8-4" /></Icon>

createRoot(document.getElementById('root')).render(<App />)
