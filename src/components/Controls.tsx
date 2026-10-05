import type { ReactNode } from 'react'
import { fieldOn, musicOn, toggleLayer, useSound } from '../lib/music'
import { toggleQuality, useQuality } from '../lib/quality'
import { FieldIcon, NoteIcon, SparkleIcon } from './Icons'

// The picture's controls: small round icon buttons rather than words, so they take little room.
// Each says what it does in a small note above it on hover or keyboard focus (like the footer's
// links), and screen readers get the same words. Walnut means on.

// A button with its note. `label` is what it is now and what pressing does.
export function ControlButton({ label, on = false, className = '', onClick, children }: {
  label: string; on?: boolean; className?: string; onClick: () => void; children: ReactNode
}) {
  return <button type="button" className={`control${on ? ' is-on' : ''} ${className}`} aria-label={label} onClick={onClick}>
    {children}
    <span className="control-hint" aria-hidden="true">{label}</span>
  </button>
}

// Sound: one pill with two switches, music and the field sound, divided by a thin line. Before
// the browser allows sound it's a single "Enable sound" button instead.
export function SoundPill({ className = '' }: { className?: string }) {
  const sound = useSound()
  if (!sound.allowed) {
    return <div className={`control-pill sound-control is-waiting ${className}`}>
      <ControlButton label="Turn on music and field sound" on onClick={() => toggleLayer('music')}>
        <NoteIcon /><span className="control-text">Enable sound</span>
      </ControlButton>
    </div>
  }
  const music = musicOn(sound.mode)
  const field = fieldOn(sound.mode)
  return <div className={`control-pill sound-control ${className}`} role="group" aria-label="Sound">
    <ControlButton label={music ? 'Music on: turn it off' : 'Music off: turn it on'} on={music} onClick={() => toggleLayer('music')}>
      <NoteIcon />
    </ControlButton>
    <span className="control-divider" aria-hidden="true" />
    <ControlButton label={field ? 'Field sound on: turn it off' : 'Field sound off: turn it on'} on={field} onClick={() => toggleLayer('field')}>
      <FieldIcon />
    </ControlButton>
  </div>
}

export function QualityButton({ className = '' }: { className?: string }) {
  const quality = useQuality()
  const label = quality === 'pretty' ? 'Pretty, every effect: switch to Performance' : 'Performance, lighter effects: switch to Pretty'
  return <ControlButton className={`quality-control ${className}`} label={label} on={quality === 'pretty'} onClick={toggleQuality}>
    <SparkleIcon />
  </ControlButton>
}
