import { familyApi } from '../features/family/familyApi.js'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { sampleFamilyProfiles, FAMILY_STATUS } from '../features/family/familyProfiles'
import { updateFamilySettings, linkFamilyKeyring } from '../features/family/familyState'
import { useSession } from './SessionContext'
import avatar from '../assets/images/avatar-mother.png'

const FamilyContext = createContext(null)
function FamilyState({ children }) {
  const { userId, profile: sessionProfile } = useSession()
  const [loading, setLoading] = useState(!!userId)
  const [error, setError] = useState('')
  const generation = useRef(0)
  const selfProfileId = sessionProfile.target === 'self' ? sessionProfile.profileId : undefined
  const refresh = useCallback(async () => {
    if (!userId) return
    const current = ++generation.current
    setLoading(true); setError('')
    try {
      const data = await familyApi.list(selfProfileId)
      if (current === generation.current) setProfiles(data.map(profile => ({ ...profile, avatar })))
    } catch (err) { if (current === generation.current) { setProfiles([]); setError(err.message) } }
    finally { if (current === generation.current) setLoading(false) }
  }, [userId, selfProfileId])
  useEffect(() => { refresh(); return () => { generation.current++ } }, [refresh])
  const [profiles, setProfiles] = useState(() => userId ? [] : sampleFamilyProfiles.map(profile => ({ ...profile })))
  async function addFamily(name) {
    if (userId) {
      const created = await familyApi.add(name)
      await refresh()
      return String(created.profileId)
    }
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
  return <FamilyContext.Provider value={{ profiles, loading, error, refresh, addFamily, saveFamilySettings, connectFamily, disableFamilyKeyring }}>{children}</FamilyContext.Provider>
}
export function FamilyProvider({ children }) {
  const { userId } = useSession()
  return <FamilyState key={userId ?? 'preview'}>{children}</FamilyState>
}
export const useFamilies = () => useContext(FamilyContext)
