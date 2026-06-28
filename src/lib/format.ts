export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function formatPlays(n: number): string {
  if (!Number.isFinite(n)) return '0'
  return n.toLocaleString('pt-BR')
}

export function formatPlaylistDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0min'
  const total = Math.floor(seconds)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  if (h > 0 && m > 0) return `${h}h${m.toString().padStart(2, '0')}min`
  if (h > 0) return `${h}h`
  return `${m}min`
}

const ptMonths = [
  'jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.',
  'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.',
]

export function formatPtDate(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getDate()} de ${ptMonths[d.getMonth()]} de ${d.getFullYear()}`
}
