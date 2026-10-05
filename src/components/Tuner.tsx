import { useEffect, useState } from 'react'

// Development-only sliders, like Monocle's, for dialling in the hero picture.
// Copy the values into index.css (:root) once they look right.
const controls = [
  { key: 'blur', label: 'Blur', min: 0, max: 60, step: 1, unit: 'px', initial: 24 },
  { key: 'tint', label: 'Tint', min: 0, max: 1, step: 0.01, unit: '', initial: 0.55 },
  { key: 'grain', label: 'Grain', min: 0, max: 1, step: 0.01, unit: '', initial: 0.35 },
] as const
type Values = Record<(typeof controls)[number]['key'], number>
const storageKey = 'sedes:tuner'

function load(): Values {
  const defaults = Object.fromEntries(controls.map(c => [c.key, c.initial])) as Values
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(storageKey) ?? '{}') } } catch { return defaults }
}

export function Tuner() {
  const [values, setValues] = useState<Values>(load)
  const [open, setOpen] = useState(true)

  useEffect(() => {
    for (const c of controls) document.documentElement.style.setProperty(`--${c.key}`, `${values[c.key]}${c.unit}`)
    try { localStorage.setItem(storageKey, JSON.stringify(values)) } catch { /* private mode */ }
  }, [values])

  const css = controls.map(c => `--${c.key}: ${values[c.key]}${c.unit};`).join(' ')
  return <div className={`tuner${open ? '' : ' is-closed'}`}>
    <button type="button" className="tuner-toggle" onClick={() => setOpen(o => !o)}>{open ? 'Hide' : 'Tune'}</button>
    {open && <>
      {controls.map(c => <label key={c.key}>
        <span>{c.label}</span>
        <input type="range" min={c.min} max={c.max} step={c.step} value={values[c.key]}
          onChange={event => setValues(v => ({ ...v, [c.key]: Number(event.target.value) }))} />
        <output>{values[c.key]}{c.unit}</output>
      </label>)}
      <button type="button" className="tuner-copy" onClick={() => navigator.clipboard?.writeText(css)}>Copy CSS</button>
    </>}
  </div>
}
