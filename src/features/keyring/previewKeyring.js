// UI preview only: never used to claim a real keyring has been disabled.
const STORAGE_KEY = 'modi:keyring-preview:v1'
const initialKeyring = { id: 'TM-8244', status: 'active', lastUsedLocation: null }

export function readPreviewKeyring(storage = localStorage) {
  try {
    const value = JSON.parse(storage.getItem(STORAGE_KEY))
    if (value?.id === initialKeyring.id && ['active', 'lost'].includes(value.status)) {
      return { ...initialKeyring, status: value.status }
    }
  } catch { /* Corrupt or unavailable storage starts with the example keyring. */ }
  return { ...initialKeyring }
}

export function disablePreviewKeyring(keyring, storage = localStorage) {
  const next = { ...keyring, status: 'lost' }
  // Persist before reporting success, so a storage failure leaves the UI active.
  storage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}
