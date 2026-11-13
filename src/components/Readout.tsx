type Props = { rows: [string, string][] }
export default function Readout({ rows }: Props) { return <dl className="readout">{rows.map(([label,value]) => <div className="readout-row" key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl> }
