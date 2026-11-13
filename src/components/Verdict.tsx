import type { Verdict as VerdictType } from '../data/samples'
export default function Verdict({ value }: { value: VerdictType }) {
  return <div className={`verdict verdict-${value.toLowerCase()}`}><span className="verdict-square" aria-hidden="true" /><span>{value}</span></div>
}
