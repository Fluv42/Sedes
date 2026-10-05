import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { leaveThen } from '../lib/motion'
const eventName = 'sedes:navigate'
export function Link({ href = '/', onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target || props.download) return
    const url = new URL(href, window.location.href)
    if (url.origin !== window.location.origin || url.hash) return
    event.preventDefault()
    if (url.pathname === window.location.pathname) return window.scrollTo({ top: 0 })
    leaveThen(() => {
      window.history.pushState(null, '', url.pathname + url.search)
      window.dispatchEvent(new Event(eventName))
    })
  }
  return <a href={href} onClick={navigate} {...props} />
}
