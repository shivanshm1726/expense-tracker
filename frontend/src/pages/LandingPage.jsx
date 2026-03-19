import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiBarChart2,
  FiDollarSign,
  FiPieChart,
  FiRepeat,
  FiShield,
  FiTrendingUp,
  FiZap,
  FiGithub,
  FiChevronDown,
} from 'react-icons/fi'

/* ───────────────────────── helpers ───────────────────────── */

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}



/* ───────────────────────── data ───────────────────────── */

const FEATURES = [
  { icon: FiDollarSign, title: 'Track Expenses', desc: 'Log every transaction with categories, dates, and notes. Stay on top of where your money goes.' },
  { icon: FiTrendingUp, title: 'Income Insights', desc: 'Monitor multiple income streams and see how your earnings trend month over month.' },
  { icon: FiPieChart, title: 'Visual Reports', desc: 'Beautiful donut charts and bar graphs that make financial data easy to understand at a glance.' },
  { icon: FiBarChart2, title: 'Budget Control', desc: 'Set monthly budgets and get real-time alerts when you approach or exceed your limits.' },
  { icon: FiRepeat, title: 'Recurring Tracker', desc: 'Automate recurring income and expenses so you never miss a subscription or salary entry.' },
  { icon: FiShield, title: 'Secure & Private', desc: 'Your financial data is encrypted and stored securely. Only you have access to your information.' },
]

const MARQUEE_ITEMS = [
  'Track Expenses',
  'Visual Reports',
  'Set Budgets',
  'Income Insights',
  'Recurring Payments',
  'Secure Data',
  'Responsive Design',
  'Real-time Updates',
  'Smart Analytics',
  'Beautiful Dashboard',
]

const STEPS = [
  { num: '01', title: 'Create Account', desc: 'Sign up in seconds with just your email and password.' },
  { num: '02', title: 'Add Transactions', desc: 'Log your income and expenses with categories and dates.' },
  { num: '03', title: 'Set Budgets', desc: 'Define monthly spending limits and get smart alerts.' },
  { num: '04', title: 'Track Progress', desc: 'View beautiful charts and reports to understand your finances.' },
]

/* ───────────────────────── components ───────────────────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      id="landing-nav"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center shadow shadow-green-500/30">
            <FiDollarSign className="text-white" size={18} />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Money Manager</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-slate-300 hover:text-emerald-400 text-sm transition-colors">Features</a>
          <a href="#how-it-works" className="text-slate-300 hover:text-emerald-400 text-sm transition-colors">How It Works</a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-slate-300 hover:text-white transition-colors px-4 py-2">
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-sm bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-2 rounded-xl transition-all hover:shadow-lg hover:shadow-green-500/25"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
}

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-green-500/15 rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/3 -right-32 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute -bottom-40 left-1/3 w-72 h-72 bg-green-400/10 rounded-full blur-3xl animate-float-slower" />
      <div className="absolute top-20 left-1/2 w-64 h-64 bg-violet-400/10 rounded-full blur-3xl animate-float-slow" />
    </div>
  )
}

function MarqueeStrip() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <section className="relative py-8 overflow-hidden bg-slate-950/80 border-y border-white/5">
      {/* fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 marquee-gradient-left" />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 marquee-gradient-right" />

      {/* row 1 */}
      <div className="flex animate-marquee whitespace-nowrap mb-3">
        {doubled.map((item, i) => (
          <span
            key={`a-${i}`}
            className="mx-6 text-sm font-medium text-slate-400 flex items-center gap-2 select-none"
          >
            {item}
            <span className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
          </span>
        ))}
      </div>

      {/* row 2 (reverse) */}
      <div className="flex animate-marquee-reverse whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={`b-${i}`}
            className="mx-6 text-sm font-medium text-slate-500 flex items-center gap-2 select-none"
          >
            {item}
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50" />
          </span>
        ))}
      </div>
    </section>
  )
}

function FeatureCard({ icon: Icon, title, desc, index }) {
  const [ref, visible] = useInView()
  return (
    <div
      ref={ref}
      className={`landing-card rounded-2xl p-6 opacity-0 ${visible ? 'animate-fade-in-up' : ''} stagger-${index + 1}`}
    >
      <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
        <Icon size={22} className="text-green-400" />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

function StepCard({ num, title, desc, index }) {
  const [ref, visible] = useInView()
  return (
    <div
      ref={ref}
      className={`relative opacity-0 ${visible ? 'animate-fade-in-up' : ''} stagger-${index + 1}`}
    >
      <div className="flex items-start gap-5">
        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
          <span className="gradient-text text-xl font-bold">{num}</span>
        </div>
        <div>
          <h4 className="text-white font-semibold text-lg mb-1">{title}</h4>
          <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
        </div>
      </div>
      {index < 3 && (
        <div className="hidden md:block absolute left-7 top-16 w-px h-12 bg-gradient-to-b from-green-500/30 to-transparent" />
      )}
    </div>
  )
}

/* ───────────────────────── main page ───────────────────────── */

export default function LandingPage() {

  return (
    <div className="bg-slate-950 text-white min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <header className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16">
        <FloatingOrbs />

        {/* badge */}
        <div className="relative z-10 inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up">
          <FiZap size={14} className="text-green-400" />
          <span className="text-xs text-slate-300 font-medium">Smart Financial Tracking</span>
        </div>

        <h1 className="relative z-10 text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight max-w-4xl animate-fade-in-up stagger-1">
          Take Control of Your{' '}
          <span className="gradient-text">Finances</span>
        </h1>

        <p className="relative z-10 mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed opacity-0 animate-fade-in-up stagger-2">
          Track expenses, monitor income, set budgets, and visualise your financial health — all in one
          beautifully designed dashboard.
        </p>

        <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 mt-10 opacity-0 animate-fade-in-up stagger-3">
          <Link
            to="/register"
            className="group flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-green-500/25 transition-all animate-pulse-glow"
          >
            Start for Free
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#features"
            className="flex items-center gap-2 text-slate-300 hover:text-white border border-white/15 hover:border-white/30 px-8 py-3.5 rounded-2xl transition-all"
          >
            Explore Features
          </a>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-10 z-10 animate-bounce">
          <FiChevronDown size={24} className="text-slate-500" />
        </div>
      </header>

      {/* ── MARQUEE ── */}
      <MarqueeStrip />

      {/* ── FEATURES ── */}
      <section id="features" className="relative py-24 px-6">
        <FloatingOrbs />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-green-400 font-semibold text-sm tracking-widest uppercase mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Everything You Need to{' '}
              <span className="gradient-text">Manage Money</span>
            </h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto">
              Powerful tools designed to simplify your personal finance workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>


      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-green-400 font-semibold text-sm tracking-widest uppercase mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Get Started in <span className="gradient-text">4 Simple Steps</span>
            </h2>
          </div>

          <div className="space-y-10">
            {STEPS.map((s, i) => (
              <StepCard key={s.num} {...s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-6 relative">
        <FloatingOrbs />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Master Your <span className="gradient-text">Money?</span>
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto mb-10">
            Join thousands of users who are already taking control of their finances with Money Manager.
          </p>
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-10 py-4 rounded-2xl shadow-lg shadow-green-500/30 transition-all text-lg"
          >
            Create Free Account
            <FiArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center">
              <FiDollarSign className="text-white" size={14} />
            </div>
            <span className="text-white font-bold tracking-tight">Money Manager</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link to="/login" className="hover:text-slate-300 transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-slate-300 transition-colors">Register</Link>
            <a
              href="https://github.com/shivanshm1726/expense-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <FiGithub size={14} /> GitHub
            </a>
          </div>

          <p className="text-xs text-slate-600">© 2026 Money Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
