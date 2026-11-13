import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { motion } from 'framer-motion'
import { samples } from '../data/samples'
import type { Sample } from '../data/samples'
import Verdict from '../components/Verdict'
import Readout from '../components/Readout'
import SectionLabel from '../components/SectionLabel'

const steps = ['Parse','Signature','Chain','Expiry / revocation','Forgery model','Quantum exposure']
export default function Verify() {
  const [selected, setSelected] = useState(samples[0].id)
  const [running, setRunning] = useState(false)
  const [complete, setComplete] = useState(false)
  const [step, setStep] = useState(-1)
  const [showQr, setShowQr] = useState(false)
  const [qr, setQr] = useState('')
  const [apiState, setApiState] = useState<'local' | 'connected' | 'offline'>('local')
  const sample = useMemo(() => samples.find(s => s.id === selected)!, [selected])
  useEffect(() => { setComplete(false); setStep(-1); setShowQr(false) }, [selected])
  useEffect(() => {
    if (!showQr) return
    QRCode.toDataURL(`SIGIL|${sample.id}|${sample.issuer}|${sample.fingerprint}`, { width: 168, margin: 1, color: { dark:'#151515', light:'#F6F4EF' } }).then(setQr)
  }, [showQr, sample])
  const verify = async () => {
    if (running) return
    setRunning(true); setComplete(false); setStep(-1)
    let current = 0
    const tick = () => {
      setStep(current)
      current += 1
      if (current < steps.length) window.setTimeout(tick, 200)
    }
    window.setTimeout(tick, 100)
    const apiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')
    if (apiBase) {
      const controller = new AbortController()
      const timeout = window.setTimeout(() => controller.abort(), 5000)
      void fetch(`${apiBase}/api/verify`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificate_id: sample.id }), signal: controller.signal
      }).then(response => {
        if (!response.ok) throw new Error(`API returned ${response.status}`)
        setApiState('connected')
      }).catch(() => setApiState('offline')).finally(() => window.clearTimeout(timeout))
    } else { setApiState('local') }
    window.setTimeout(() => { setStep(steps.length - 1); setRunning(false); setComplete(true) }, 1200)
  }
  const rows: [string,string][] = [
    ['Forgery probability', sample.probability], ['Quantum exposure', `${sample.exposure} / 100 (${sample.level})`],
    ['Key', `${sample.key} · ${sample.algorithm}`], ['Issuer', sample.issuer], ['Valid until', sample.validUntil]
  ]
  return <section className="section verify-section" id="verify">
    <SectionLabel number="01" label="Verify" />
    <div className="verify-intro"><h2>One certificate.<br/><em>Six checks.</em></h2><p>Select a sample record to see how the verifier reaches its verdict. Each result is simulated in your browser.</p></div>
    <div className="verify-panel">
      <div className="sample-column">
        <div className="panel-kicker">Sample certificates <span>04 RECORDS</span></div>
        <div className="sample-list" role="radiogroup" aria-label="Select a sample certificate">
          {samples.map((s: Sample) => <button className={`sample-row ${selected===s.id?'selected':''}`} key={s.id} role="radio" aria-checked={selected===s.id} onClick={() => setSelected(s.id)}>
            <span className="sample-id">{s.id}</span><span className="sample-meta">{s.issuer} <b>{s.key}</b></span><span className="sample-arrow" aria-hidden="true">↗</span>
          </button>)}
        </div>
        <button className="ink-button" onClick={verify} disabled={running}>{running ? 'Checking…' : 'Verify certificate'} <span aria-hidden="true">↗</span></button>
        <div className="checklist" aria-live="polite">
          <div className="panel-kicker">Verification sequence <span>{complete?'COMPLETE':running?'RUNNING':'READY'}</span></div>
          {steps.map((name,i) => <div className={`check-line ${step>=i?'checked':''}`} key={name}><span className="check-mark">{step>=i?'✓':'—'}</span><span>{name}</span><span className="check-state">{step>=i?'DONE':'WAITING'}</span></div>)}
        </div>
      </div>
      <div className="result-column" aria-live="polite" aria-atomic="true">
        <div className="result-topline"><span className="panel-kicker">Verification result</span><span className="mono small">{complete ? (apiState === 'connected' ? 'API DEMO' : apiState === 'offline' ? 'LOCAL FALLBACK' : 'LOCAL DEMO') : 'SAMPLE OUTPUT'}</span></div>
        <div className="verdict-heading"><Verdict value={sample.verdict} /><span className="mono result-id">{sample.id}</span></div>
        <Readout rows={rows} />
        <p className="result-explanation">{sample.explanation}</p>
        <button className="text-link qr-toggle" onClick={() => setShowQr(v => !v)} aria-expanded={showQr}>{showQr?'Hide certificate QR':'Show certificate QR'} <span aria-hidden="true">{showQr?'↑':'↓'}</span></button>
        {showQr && <motion.div className="qr-area" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.2}}><div className="qr-frame">{qr && <img src={qr} alt={`QR code for ${sample.id}`} />}</div><div><div className="mono small">PUBLIC FINGERPRINT</div><p>{sample.fingerprint}</p><p className="qr-caption">Anyone can scan this. No login.</p></div></motion.div>}
      </div>
    </div>
    <p className="demo-note"><span className="accent-dot" /> Demo runs on sample data in your browser. Verdicts are simulated for illustration.</p>
  </section>
}
