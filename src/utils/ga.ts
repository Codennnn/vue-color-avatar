export function recordEvent(
  action: string,
  params: {
    event_category: string
    event_label?: string
    value?: number
  }
) {
  window?.gtag('event', action, params)
}
