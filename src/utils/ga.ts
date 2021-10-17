export function recordClick(params: {
  event_category: string
  event_label?: string
  value?: number
}) {
  window?.gtag('event', 'Click', params)
}
