type Props = { number: string; label: string }
export default function SectionLabel({ number, label }: Props) { return <div className="section-label"><span>{number}</span><span>/</span><span>{label}</span></div> }
