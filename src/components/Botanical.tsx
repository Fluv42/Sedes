import type { Motif } from '../content/projects'

// Decorative marks, never labelled or presented as application screenshots.
export function Botanical({ motif = 'wheat', className = '' }: { motif?: Motif; className?: string }) {
  return <svg className={`botanical ${className}`} viewBox="0 0 120 150" fill="none" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      {motif === 'wheat' && <>
        <path d="M57 135C57 104 61 76 66 31M45 136C43 109 39 91 33 73M70 135C75 112 81 93 90 73" />
        {[0, 1, 2, 3, 4, 5].map(i => <g key={i} transform={`translate(${64-i*1.4} ${40+i*10})`}><path d="M0 4C-11 1-16-8-13-12C-5-10 0-3 0 4ZM0 4C12 1 19-6 16-11C8-9 3-3 0 4Z" /></g>)}
        <path d="M64 41L68 22M44 119C27 111 24 99 26 91C35 97 40 104 44 119M75 117C92 113 100 102 98 94C88 99 81 107 75 117" />
      </>}
      {motif === 'fern' && <>
        <path d="M52 135C49 102 56 61 77 21" />
        {[0, 1, 2, 3, 4, 5, 6].map(i => <g key={i} transform={`translate(${72-i*2.8} ${33+i*12})`}><path d={`M0 0C${-12-i} -13 ${-23-i} -13 ${-25-i} -8C-13-6-7-2 0 0ZM0 0C15-12 26-10 26-6C17-3 8-1 0 0Z`} /></g>)}
      </>}
      {motif === 'tree' && <>
        <path d="M59 134V55M59 78L39 60M59 95L81 75M43 134H76" />
        <path d="M31 71C10 60 17 37 32 36C27 15 60 8 67 25C84 12 104 36 92 45C110 65 85 86 75 77C64 91 40 87 31 71Z" />
        <path d="M36 50L43 55M82 48L75 55M52 39L57 47" />
      </>}
      {motif === 'book' && <>
        <path d="M60 120C43 111 28 112 15 114V38C31 36 45 38 60 47C74 38 90 36 105 38V114C88 111 75 112 60 120ZM60 47V120M19 123C36 119 48 121 60 127C74 121 88 119 101 123" />
        <path d="M26 53L46 58M26 66L46 71M26 79L46 84M74 58L94 53M74 71L94 66M74 84L94 79" />
        <path d="M83 39V22M83 29C73 25 73 19 75 16C82 19 83 23 83 29M83 25C93 23 96 16 93 13C86 16 83 20 83 25" />
      </>}
      {motif === 'sun' && <>
        <path d="M17 113V66C17 43 35 25 59 25C83 25 103 43 103 66V113M17 113H103M23 104C36 97 43 110 57 103C73 95 87 109 97 101" />
        <circle cx="60" cy="68" r="17" />
        <path d="M60 43V36M60 100V93M35 68H28M92 68H85M42 50L37 45M78 86L83 91M78 50L83 45M42 86L37 91" />
      </>}
    </g>
  </svg>
}
