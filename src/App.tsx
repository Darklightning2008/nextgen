import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Verify from './sections/Verify'
import Method from './sections/Method'
import Risk from './sections/Risk'
import Console from './sections/Console'
import Evaluation from './sections/Evaluation'
import Team from './sections/Team'
import Next from './sections/Next'
const nav=[['Method','#method'],['Risk','#risk'],['Console','#console'],['Team','#team']]
function Reveal({children}:{children:ReactNode}){const reduce=useReducedMotion();return <motion.div initial={reduce?false:{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.08}} transition={{duration:.3,ease:'easeOut'}}>{children}</motion.div>}
export default function App(){useEffect(()=>{const handle=()=>document.body.classList.toggle('is-scrolling',window.scrollY>8);window.addEventListener('scroll',handle,{passive:true});return()=>window.removeEventListener('scroll',handle)},[]);return <>
  <header className="site-header"><a className="wordmark" href="#top" aria-label="Sigil home">Sigil<span>.</span></a><nav aria-label="Main navigation">{nav.map(([name,href])=><a key={name} href={href}>{name}</a>)}</nav></header>
  <main id="top"><section className="hero page-width"><div className="hero-copy"><div className="eyebrow"><span className="accent-dot"/> SIH 26141 — Digital signature security</div><h1>Is this certificate real, and will it <em>still be</em> in ten years?</h1><p>Sigil checks the signature, looks for signs of tampering, and scores how exposed the key is to quantum attacks. You get one verdict and a plain explanation.</p><a className="text-link hero-link" href="#verify">Try the verifier <span>↓</span></a></div><div className="hero-side" aria-hidden="true"><div className="hero-index mono">26141<br/>CERTIFICATE SECURITY</div><svg viewBox="0 0 280 300" className="hero-mark"><g fill="none" stroke="currentColor" strokeWidth="1.1"><path d="M140 20V280M20 150H260M55 65L225 235M225 65L55 235"/><rect x="73" y="83" width="134" height="134" transform="rotate(45 140 150)"/><circle cx="140" cy="150" r="72"/><path d="M110 150l20 20 42-48"/></g><circle cx="140" cy="20" r="3" fill="#D9391F"/></svg><div className="hero-side-caption mono">SIGNATURE / IDENTITY / TIME</div></div></section>
    <div className="page-width"><Reveal><Verify/></Reveal><Reveal><Method/></Reveal><Reveal><Risk/></Reveal><Reveal><Console/></Reveal><Reveal><Evaluation/></Reveal><Reveal><Team/></Reveal><Reveal><Next/></Reveal></div>
  </main>
  <footer className="site-footer"><div className="footer-meta"><div><span className="mono small">PROJECT</span><b>Sigil</b></div><div><span className="mono small">REFERENCE</span><b>SIH 26141</b></div><div><span className="mono small">STACK</span><b>Python, Flask, scikit-learn, XGBoost, cryptography, dwave-neal, SQLite</b></div><div><span className="mono small">SOURCES</span><b>Gidney arXiv:2505.15917 (2025); NIST IR 8547 draft (2024); NIST FIPS 204 (2024).</b></div></div><div className="footer-close">Verify. Detect. Prepare.</div></footer>
</>}
