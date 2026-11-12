// Temporary local UI persistence. Replace this adapter when the API contract is available.
// Presets remain identifiers: their mapping to individual options requires backend agreement.
const KEY = 'modi:accessibility-preview:v1'
export const optionDefinitions = [
  { id: 'simplifiedMenu', label: '핵심 메뉴 간소화', description: '메뉴를 크고 간단하게 보여줘요' },
  { id: 'highContrast', label: '색상 고대비', description: '글자와 버튼을 더 선명하게 구분할 수 있어요' },
  { id: 'touchGuidance', label: '터치 위치 안내', description: '다음에 눌러야 할 버튼을 눈에 띄게 안내해요.' },
  { id: 'bottomControls', label: '화면 하단 조작', description: '주요 버튼을 화면 아래쪽에 배치해요' },
]
export function readSettings() {
  const fallback = { mode: 'recommended', preset: 'elderly', options: { simplifiedMenu: true, highContrast: false, touchGuidance: true, bottomControls: false } }
  try {
    const value = JSON.parse(localStorage.getItem(KEY))
    if (!value || !['recommended', 'custom'].includes(value.mode) || !['elderly', 'wheelchair', 'color'].includes(value.preset)) return fallback
    if (!optionDefinitions.every(({ id }) => typeof value.options?.[id] === 'boolean')) return fallback
    return { mode: value.mode, preset: value.preset, options: Object.fromEntries(optionDefinitions.map(({ id }) => [id, value.options[id]])) }
  } catch { return fallback }
}
export function saveSettings(value) {
  localStorage.setItem(KEY, JSON.stringify(value))
}
