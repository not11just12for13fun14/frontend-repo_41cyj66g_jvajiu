import React, { useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'

const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Header() {
  return (
    <header className="relative z-10 w-full">
      <div className="mx-auto max-w-7xl px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-blue-500/20 border border-blue-400/30" />
          <span className="text-white font-semibold tracking-tight">AI Minor Project</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <a href="#intro" className="hover:text-white transition">Intro</a>
          <a href="#objective" className="hover:text-white transition">Objective</a>
          <a href="#tech" className="hover:text-white transition">Technology</a>
          <a href="#flow" className="hover:text-white transition">Flowchart</a>
          <a href="#dataset" className="hover:text-white transition">Dataset</a>
          <a href="#impl" className="hover:text-white transition">Implementation</a>
          <a href="#tests" className="hover:text-white transition">Tests</a>
          <a href="#conclusion" className="hover:text-white transition">Conclusion</a>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative h-[70vh] min-h-[520px] w-full overflow-hidden rounded-b-3xl">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/pDXeCthqjmzYX5Zk/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#030712]/60 via-[#030712]/70 to-[#030712]" />
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
            Stress & Mood Assessment Assistant
          </h1>
          <p className="mt-4 text-white/80 text-base md:text-lg">
            Healthcare-inspired AI that analyzes your text for stress and mood indicators.
          </p>
          <a href="#demo" className="mt-6 inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition">
            Try the Demo
          </a>
        </div>
      </div>
    </section>
  )
}

function Card({ id, title, children }) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-4 py-12">
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">{title}</h2>
        <div className="prose prose-invert max-w-none text-white/85">
          {children}
        </div>
      </div>
    </section>
  )
}

function Flowchart() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {[
        { t: 'Input', d: 'User types symptoms or a journal entry' },
        { t: 'Preprocess', d: 'Lowercase and match keywords' },
        { t: 'Assess', d: 'Rule-based scoring for stress/anxiety/mood' },
        { t: 'Result', d: 'Score, label and keywords shown; saved to DB' },
      ].map((n, i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-blue-300">Step {i + 1}</div>
          <div className="mt-1 font-semibold text-white">{n.t}</div>
          <div className="mt-1 text-white/75 text-sm">{n.d}</div>
        </div>
      ))}
    </div>
  )
}

function Demo() {
  const [text, setText] = useState('I feel overwhelmed with workload and a bit anxious, hard to sleep.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const run = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${backend}/api/assess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      const data = await res.json()
      setResult(data)
      loadHistory()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const loadHistory = async () => {
    try {
      const res = await fetch(`${backend}/api/history`)
      const data = await res.json()
      setHistory(data)
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => { loadHistory() }, [])

  return (
    <section id="demo" className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-white/90 font-medium">Enter text</div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-3 w-full h-40 rounded-lg bg-black/30 border border-white/10 p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={run} disabled={loading} className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-500 transition disabled:opacity-60">
            {loading ? 'Assessing...' : 'Assess'}
          </button>
          {result && (
            <div className="mt-5 rounded-lg border border-white/10 bg-black/30 p-4">
              <div className="text-white text-lg font-semibold">Result: {result.label}</div>
              <div className="text-white/80 mt-1">Score: {result.score}</div>
              {result.keywords?.length > 0 && (
                <div className="text-white/70 mt-1 text-sm">Keywords: {result.keywords.join(', ')}</div>
              )}
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-white/90 font-medium">Recent assessments</div>
          <div className="mt-3 space-y-3 max-h-72 overflow-auto pr-2">
            {history.length === 0 && (
              <div className="text-white/60 text-sm">No history available yet.</div>
            )}
            {history.map((h, i) => (
              <div key={i} className="rounded-lg bg-black/30 border border-white/10 p-3">
                <div className="text-white/80 text-sm line-clamp-2">{h.text}</div>
                <div className="text-white mt-1 text-sm font-medium">{h.label} • {h.score}</div>
                {h.keywords?.length > 0 && (
                  <div className="text-white/60 text-xs">{h.keywords.join(', ')}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#030712]">
      <Header />
      <Hero />

      <Card id="intro" title="Introduction">
        <p>
          This mini-project demonstrates an AI-powered assistant that analyzes free-text for stress and mood
          indicators. It is designed for healthcare and educational contexts, blending neuroscience visuals with
          simple natural language analysis.
        </p>
      </Card>

      <Card id="objective" title="Need / Objective of the project">
        <ul>
          <li>Offer a quick preliminary screening to raise self-awareness.</li>
          <li>Assist educators and clinicians with a simple triage tool.</li>
          <li>Demonstrate end-to-end AI app development (frontend + backend + DB).</li>
        </ul>
      </Card>

      <Card id="tech" title="Technology used (software details)">
        <ul>
          <li>Frontend: React + Vite + Tailwind</li>
          <li>3D: Spline brain model for a futuristic, educational hero</li>
          <li>Backend: FastAPI with Python</li>
          <li>Database: MongoDB (automatic connection in this environment)</li>
        </ul>
      </Card>

      <Card id="flow" title="Flowchart">
        <Flowchart />
      </Card>

      <Card id="dataset" title="Dataset used, ER diagrams (if any)">
        <p>
          For this demo, the model is rule-based and does not require a dataset. If extended, you can fine-tune on
          publicly available mental-health text datasets (e.g., stress/anxiety forums) and design an ER model with
          entities like User, Assessment, Session, and Keyword.
        </p>
      </Card>

      <Card id="impl" title="Implementation: main code screenshots">
        <p>
          The backend exposes an endpoint that accepts text, computes a stress score using weighted keywords, and
          returns a label with matched keywords. When the database is available, results are saved and shown in the
          history panel above.
        </p>
      </Card>

      <Card id="tests" title="Test cases (if done)">
        <ul>
          <li>Input with no keywords → Minimal</li>
          <li>Mixed mild terms (tired, down) → Low</li>
          <li>Multiple strong terms (overwhelmed, panic, depressed) → High</li>
        </ul>
      </Card>

      <Card id="conclusion" title="Conclusion">
        <p>
          You now have a working, presentation-ready AI mini-project complete with a live demo, visual flow, and
          documented sections. Expand it by training a model and adding authentication and role-based access.
        </p>
      </Card>

      <footer className="mx-auto max-w-7xl px-4 py-10 text-center text-white/50">
        Built for practical exams • Demo purpose only
      </footer>
    </div>
  )
}
