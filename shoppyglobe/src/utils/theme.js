const THEME_KEY = 'sg-theme'

export function getSavedTheme() {
  return localStorage.getItem(THEME_KEY) || 'light'
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem(THEME_KEY, theme)
}
