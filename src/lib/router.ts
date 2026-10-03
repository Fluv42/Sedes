import { useSyncExternalStore } from 'react'
const eventName = 'sedes:navigate'
function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback)
  window.addEventListener(eventName, callback)
  return () => { window.removeEventListener('popstate', callback); window.removeEventListener(eventName, callback) }
}
const snapshot = () => window.location.pathname.replace(/\/+$/, '') || '/'
export const usePath = (initialPath = '/') => useSyncExternalStore(subscribe, snapshot, () => initialPath)
