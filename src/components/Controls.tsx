import type { ReactNode } from 'react'
import { soundPlaying, toggleSound, useSound } from '../lib/music'
import { toggleQuality, useQuality } from '../lib/quality'
import { NoteIcon, SparkleIcon } from './Icons'

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

// Sound: one button that plays or pauses the music and the field sound together. Paused, it says
// so in words ("Play sound"), since nothing plays until it's pressed; playing, it's the note alone.
export function SoundButton({ className = '' }: { className?: string }) {
  const playing = soundPlaying(useSound())
  if (!playing) {
    return <div className={`control-pill sound-control is-waiting ${className}`}>
      <ControlButton label="Play the music and field sound" on onClick={toggleSound}>
        <NoteIcon /><span className="control-text">Play sound</span>
      </ControlButton>
    </div>
  }
  return <ControlButton className={`sound-control ${className}`} label="Sound playing: pause it" on onClick={toggleSound}>
    <NoteIcon />
  </ControlButton>
}

export function QualityButton({ className = '' }: { className?: string }) {
  const quality = useQuality()
  const label = quality === 'pretty' ? 'Pretty, every effect: switch to Performance' : 'Performance, lighter effects: switch to Pretty'
  return <ControlButton className={`quality-control ${className}`} label={label} on={quality === 'pretty'} onClick={toggleQuality}>
    <SparkleIcon />
  </ControlButton>
}
