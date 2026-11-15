const KEY = 'modi:accessibility-preview:v1'
export const optionDefinitions = [
  { id: 'largeText', label: '큰 글씨', description: '메뉴와 버튼의 글자를 크게 보여줘요.' },
  { id: 'highContrast', label: '색상 고대비', description: '글자와 버튼을 더 선명하게 구분할 수 있어요.' },
  { id: 'touchGuidance', label: '터치 위치 안내', description: '다음에 눌러야 할 버튼을 눈에 띄게 안내해요.' },
  { id: 'touchCorrection', label: '터치 입력 보정', description: '버튼을 조금 빗나가게 눌러도 인식돼요.' },
  { id: 'bottomControls', label: '화면 하단 조작', description: '주요 버튼을 화면 아래쪽에 배치해요.' },
]
// UI mapping follows the tags in the current Figma. API mapping remains pending.
export const presetOptions = {
  elderly: ['largeText', 'highContrast', 'touchGuidance', 'touchCorrection'],
  wheelchair: ['largeText', 'touchCorrection', 'bottomControls'],
  color: ['largeText', 'highContrast', 'touchCorrection'],
}
export const emptyOptions = () => Object.fromEntries(optionDefinitions.map(({ id }) => [id, false]))
export const optionsForPreset = preset => Object.fromEntries(optionDefinitions.map(({ id }) => [id, presetOptions[preset]?.includes(id) ?? false]))
export function readSettings(storage) {
  const fallback = { mode: 'recommended', preset: null, options: emptyOptions() }
  try {
    const value = JSON.parse((storage ?? globalThis.localStorage).getItem(KEY))
    if (!value || !['recommended', 'custom'].includes(value.mode) || (value.preset !== null && !Object.hasOwn(presetOptions, value.preset))) return fallback
    if (!value.options || !['highContrast', 'touchGuidance', 'bottomControls'].every(id => typeof value.options[id] === 'boolean')) return fallback
    // Preserve old flags; menu simplification does not imply large font size.
    return { mode: value.mode, preset: value.preset, options: Object.fromEntries(optionDefinitions.map(({ id }) => [id, value.options[id] === true])) }
  } catch { return fallback }
}
export function saveSettings(value, storage) {
  (storage ?? globalThis.localStorage).setItem(KEY, JSON.stringify(value))
}
export function settingsChanged(value, saved) {
  if (value.mode === 'recommended') return value.preset !== null && (saved.mode !== value.mode || saved.preset !== value.preset)
  return optionDefinitions.some(({ id }) => value.options[id] !== saved.options[id]) || (saved.mode !== value.mode && Object.values(value.options).some(Boolean))
}
