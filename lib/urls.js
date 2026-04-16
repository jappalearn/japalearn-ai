/**
 * Returns the correct URL for app.japalearnai.com pages.
 * Falls back to a relative path in local development.
 */
export function getAppUrl(path = '') {
  if (typeof window === 'undefined') return path
  const { hostname } = window.location
  if (hostname === 'localhost' || hostname.startsWith('127.')) return path
  return `https://app.japalearnai.com${path}`
}

/**
 * Returns the correct URL for japalearnai.com (main site) pages.
 * Falls back to a relative path in local development.
 */
export function getMainUrl(path = '') {
  if (typeof window === 'undefined') return path
  const { hostname } = window.location
  if (hostname === 'localhost' || hostname.startsWith('127.')) return path
  return `https://japalearnai.com${path}`
}
