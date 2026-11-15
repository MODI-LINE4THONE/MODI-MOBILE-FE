import { createContext, useContext, useState } from 'react'
import { sampleFamilyProfiles, FAMILY_STATUS } from '../features/family/familyProfiles'
import { updateFamilySettings, linkFamilyKeyring } from '../features/family/familyState'
import { useSession } from './SessionContext'
import avatar from '../assets/images/avatar-mother.png'

const FamilyContext = createContext(null)
function FamilyState({ children }) {
  const [profiles, setProfiles] = useState(() => sampleFamilyProfiles.map(profile => ({ ...profile })))
  function addFamily(name) {
    const trimmed = name.trim()
    if (!trimmed || trimmed.length > 20) throw Error('별명은 1~20자로 입력해주세요.')
    const id = `family-${crypto.randomUUID()}`
    setProfiles(current => [...current, { id, name: trimmed, avatar, status: FAMILY_STATUS.pending, keyring: null, enabledSettings: [] }])
    return id
  }
  function saveFamilySettings(id, settings) { setProfiles(current => updateFamilySettings(current, id, settings)) }
  function connectFamily(id, keyring) {
    // Validate against the current snapshot before transitioning to the success screen.
    linkFamilyKeyring(profiles, id, keyring)
    setProfiles(current => linkFamilyKeyring(current, id, keyring))
  }
  function disableFamilyKeyring(id) { setProfiles(current => current.map(profile => profile.id === id && profile.keyring ? { ...profile, keyring: { ...profile.keyring, status: 'lost' } } : profile)) }
  return <FamilyContext.Provider value={{ profiles, addFamily, saveFamilySettings, connectFamily, disableFamilyKeyring }}>{children}</FamilyContext.Provider>
}
export function FamilyProvider({ children }) {
  const { userId } = useSession()
  return <FamilyState key={userId ?? 'preview'}>{children}</FamilyState>
}
export const useFamilies = () => useContext(FamilyContext)
