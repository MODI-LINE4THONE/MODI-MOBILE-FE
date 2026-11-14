import test from 'node:test'
import assert from 'node:assert/strict'
import { findFamilyWithKeyring } from './familyKeyring.js'

// familyProfiles.js는 사진(png)을 불러와 node에서 바로 읽을 수 없어서, 같은 모양의 목록을 둔다
const keyring = { keyringId: 'AB1234', registeredAt: new Date(2026, 10, 3, 15, 29) }
const profiles = [
  { id: 'mother', name: '어머니', keyring },
  { id: 'grandmother', name: '할머니', keyring: null },
  { id: 'grandfather', name: '할아버지' },
]

test('키링이 연결된 가족은 그 프로필을 돌려준다', () => {
  assert.equal(findFamilyWithKeyring(profiles, 'mother'), profiles[0])
})

test('등록 대기(키링 null·없음) 가족은 null', () => {
  assert.equal(findFamilyWithKeyring(profiles, 'grandmother'), null)
  assert.equal(findFamilyWithKeyring(profiles, 'grandfather'), null)
})

test('없는 id는 null', () => {
  assert.equal(findFamilyWithKeyring(profiles, 'uncle'), null)
  assert.equal(findFamilyWithKeyring(profiles, undefined), null)
})
